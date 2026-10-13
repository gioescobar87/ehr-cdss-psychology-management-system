import * as cdk from 'aws-cdk-lib';
import {
  aws_certificatemanager as acm,
  aws_ec2 as ec2,
  aws_ecr as ecr,
  aws_ecs as ecs,
  aws_elasticloadbalancingv2 as elbv2,
  aws_iam as iam,
  aws_logs as logs,
  aws_rds as rds,
  aws_route53 as route53,
  aws_route53_targets as targets,
  aws_s3 as s3,
  aws_secretsmanager as secretmanager,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class InfrastructureStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly applicationSecurityGroup: ec2.SecurityGroup;
  public readonly database: rds.DatabaseInstance;
  public readonly clinicalDocumentsBucket: s3.Bucket;
  public readonly frontendBucket: s3.Bucket;
  public readonly backendRepository: ecr.Repository;
  public readonly applicationSecret: secretmanager.ISecret;
  public readonly ecsCluster: ecs.Cluster;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /*
     * ------------------------------------------------------------
     * 1. VPC
     * ------------------------------------------------------------
     *
     * Network layout:
     *
     * Public subnets
     *   -> Application Load Balancer
     *
     * Private subnets
     *   -> ECS Fargate tasks
     *
     * Isolated subnets
     *   -> RDS PostgreSQL
     *
     * Two Availability Zones are used.
     * One NAT Gateway is used to control initial costs.
     */

    this.vpc = new ec2.Vpc(this, 'ClarityEhrVpc', {
      vpcName: 'clarityehr-prod-vpc',
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'Application',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          name: 'Database',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });

    /*
     * ------------------------------------------------------------
     * 2. ECS application security group
     * ------------------------------------------------------------
     */

    this.applicationSecurityGroup = new ec2.SecurityGroup(
      this,
      'ApplicationSecurityGroup',
      {
        vpc: this.vpc,
        securityGroupName: 'clarityehr-prod-application-sg',
        description: 'Security group for future ECS Fargate tasks',
        allowAllOutbound: true,
      },
    );

    /*
     * ------------------------------------------------------------
     * 3. Database security group
     * ------------------------------------------------------------
     */

    const databaseSecurityGroup = new ec2.SecurityGroup(
      this,
      'DatabaseSecurityGroup',
      {
        vpc: this.vpc,
        securityGroupName: 'clarityehr-prod-database-sg',
        description: 'Security group for RDS PostgreSQL',
        allowAllOutbound: false,
      },
    );

    databaseSecurityGroup.addIngressRule(
      this.applicationSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow PostgreSQL access only from ECS application tasks',
    );

    /*
     * ------------------------------------------------------------
     * 4. Application Load Balancer security group
     * ------------------------------------------------------------
     */

    const loadBalancerSecurityGroup = new ec2.SecurityGroup(
      this,
      'LoadBalancerSecurityGroup',
      {
        vpc: this.vpc,
        securityGroupName: 'clarityehr-prod-load-balancer-sg',
        description: 'Security group for the Clarity EHR Application Load Balancer',
        allowAllOutbound: true,
      },
    );

    loadBalancerSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP traffic from the internet',
    );

    loadBalancerSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS traffic from the internet',
    );

    /*
     * Only the Application Load Balancer may access
     * the ECS application container.
     */
    this.applicationSecurityGroup.addIngressRule(
      loadBalancerSecurityGroup,
      ec2.Port.tcp(8080),
      'Allow application traffic only from the Application Load Balancer',
    );

    /*
     * ------------------------------------------------------------
     * 5. RDS PostgreSQL
     * ------------------------------------------------------------
     */

    this.database = new rds.DatabaseInstance(
      this,
      'ClarityEhrDatabase',
      {
        instanceIdentifier: 'clarityehr-prod-postgresql',
        engine: rds.DatabaseInstanceEngine.postgres({
          version: rds.PostgresEngineVersion.VER_16,
        }),
        databaseName: 'clinical_system',
        credentials: rds.Credentials.fromGeneratedSecret('postgres', {
          secretName: 'clarityehr/prod/database',
        }),
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.T4G,
          ec2.InstanceSize.MICRO,
        ),
        vpc: this.vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
        securityGroups: [databaseSecurityGroup],
        publiclyAccessible: false,
        allocatedStorage: 20,
        maxAllocatedStorage: 100,
        storageEncrypted: true,
        backupRetention: cdk.Duration.days(7),
        deletionProtection: false,
        removalPolicy: cdk.RemovalPolicy.SNAPSHOT,
        multiAz: false,
        autoMinorVersionUpgrade: true,
        copyTagsToSnapshot: true,
        enablePerformanceInsights: false,
      },
    );

    /*
     * ------------------------------------------------------------
     * 6. Clinical documents S3 bucket
     * ------------------------------------------------------------
     */

    this.clinicalDocumentsBucket = new s3.Bucket(
      this,
      'ClinicalDocumentsBucket',
      {
        bucketName: `clarityehr-prod-clinical-documents-${this.account}`,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        encryption: s3.BucketEncryption.S3_MANAGED,
        enforceSSL: true,
        versioned: true,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
    );

    /*
    * ------------------------------------------------------------
    * 6.1. Frontend S3 bucket
    * ------------------------------------------------------------
    *
    * This bucket stores the compiled React application.
    *
    * It is intentionally separate from the clinical-document
    * bucket and remains private. CloudFront accesses it through
    * Origin Access Control (OAC).
    */
    
    this.frontendBucket = new s3.Bucket(
      this,
      'FrontendBucket',
      {
        bucketName: `clarityehr-prod-frontend-${this.account}`,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        encryption: s3.BucketEncryption.S3_MANAGED,
        enforceSSL: true,
        versioned: true,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
    );

    /*
    * ------------------------------------------------------------
    * 6.2. CloudFront distribution
    * ------------------------------------------------------------
    * CloudFront is the public entry point for the React
    * application.
    *
    * The S3 bucket remains private and is accessed through
    * Origin Access Control.
    */

    const frontendCertificateArn = this.node.tryGetContext('frontendCertificateArn');

    if (!frontendCertificateArn) {
      throw new Error(
        'Missing CDK context value: frontendCertificateArn',
      );
    }

    const frontendCertificate = acm.Certificate.fromCertificateArn(
      this,
      'FrontendCertificate',
      frontendCertificateArn,
    );

    const frontendDistribution = new cloudfront.Distribution(
      this,
      'FrontendDistribution',
      {
        comment: 'Clarity EHR production frontend',

        domainNames: [
          'clarityehr.app',
          'www.clarityehr.app',
        ],
        certificate: frontendCertificate,

        defaultRootObject: 'index.html',
        defaultBehavior: {
          origin: origins.S3BucketOrigin.withOriginAccessControl(
            this.frontendBucket,
          ),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          compress: true,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
            ttl: cdk.Duration.seconds(0),
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/index.html',
            ttl: cdk.Duration.seconds(0),
          },
        ],
        enableIpv6: true,
      },
    );

    /*
     * ------------------------------------------------------------
     * 7. ECR repository
     * ------------------------------------------------------------
     */

    this.backendRepository = new ecr.Repository(
      this,
      'BackendRepository',
      {
        repositoryName: 'clarityehr-prod-backend',
        imageScanOnPush: true,
        imageTagMutability: ecr.TagMutability.IMMUTABLE,
        lifecycleRules: [
          {
            maxImageCount: 10,
          },
        ],
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
    );

    /*
     * ------------------------------------------------------------
     * 8. Application secrets
     * ------------------------------------------------------------
     */

    // this.applicationSecret = new secretmanager.Secret(
    //   this,
    //   'ApplicationSecret',
    //   {
    //     secretName: 'clarityehr/prod/application',
    //     description:
    //       'Application secrets for the Clarity EHR Spring Boot backend',
    //     removalPolicy: cdk.RemovalPolicy.RETAIN,
    //   },
    // );

    this.applicationSecret =
      secretmanager.Secret.fromSecretNameV2(
        this,
        'ApplicationSecret',
        'clarityehr/prod/application',
      );

    /*
     * ------------------------------------------------------------
     * 9. ECS cluster
     * ------------------------------------------------------------
     */

    this.ecsCluster = new ecs.Cluster(this, 'ClarityEhrCluster', {
      clusterName: 'clarityehr-prod-cluster',
      vpc: this.vpc,
      containerInsightsV2: ecs.ContainerInsights.ENABLED,
    });

    /*
     * ------------------------------------------------------------
     * 10. CloudWatch log group
     * ------------------------------------------------------------
     */

    const logGroup = logs.LogGroup.fromLogGroupName(
      this,
      'BackendLogGroup',
      '/aws/ecs/clarityehr-prod',
    );

    /*
     * ------------------------------------------------------------
     * 11. ECS task execution role
     * ------------------------------------------------------------
     *
     * Used by ECS itself to:
     * - Pull the container image from ECR
     * - Write container logs to CloudWatch
     * - Retrieve secrets referenced by the task definition
     */

    const taskExecutionRole = new iam.Role(
      this,
      'BackendTaskExecutionRole',
      {
        roleName: 'clarityehr-prod-ecs-execution-role',
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            'service-role/AmazonECSTaskExecutionRolePolicy',
          ),
        ],
      },
    );

    /*
     * ECS needs permission to retrieve the application
     * and database secrets.
     */

    this.applicationSecret.grantRead(taskExecutionRole);
    this.database.secret!.grantRead(taskExecutionRole);

    /*
     * ------------------------------------------------------------
     * 12. ECS task role
     * ------------------------------------------------------------
     *
     * This role is assumed by the Spring Boot application itself.
     *
     * It receives only the permissions the application needs.
     */

    const taskRole = new iam.Role(this, 'BackendTaskRole', {
      roleName: 'clarityehr-prod-ecs-task-role',
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    /*
     * The backend application needs access to clinical documents.
     */

    this.clinicalDocumentsBucket.grantReadWrite(taskRole);

    /*
     * ------------------------------------------------------------
     * 13. ECS Fargate task definition
     * ------------------------------------------------------------
     */

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      'BackendTaskDefinition',
      {
        family: 'clarityehr-prod-backend',
        cpu: 512,
        memoryLimitMiB: 1024,
        executionRole: taskExecutionRole,
        taskRole,
      },
    );

    /*
    * ------------------------------------------------------------
    * 14. Backend container
    * ------------------------------------------------------------
    *
    * The image is intentionally referenced using an immutable
    * milestone tag rather than using "latest".
    *
    * This tag corresponds to the backend image containing the
    * latest database/Flyway deployment fixes.
    */

    // THIS FUNCTIONALITY WILL BE DELEGATED TO CI/CD THROUGH GITHUB ACTIONS
    // const backendImageTag = 
    //   this.node.tryGetContext('backendImageTag') ??
    //   process.env.BACKEND_IMAGE_TAG ??
    //   'milestone-2-db-fix';

    const backendImageTag =
      this.node.tryGetContext('backendImageTag') ??
      process.env.BACKEND_IMAGE_TAG;

    if (!backendImageTag) {
      throw new Error(
        'Missing backend image tag. Provide -c backendImageTag=<git-sha> or BACKEND_IMAGE_TAG.',
      );
    }

    const backendContainer = taskDefinition.addContainer(
      'BackendContainer',
      {
        containerName: 'clarityehr-backend',
        image: ecs.ContainerImage.fromEcrRepository(
          this.backendRepository,
          backendImageTag,
        ),
        essential: true,

        logging: ecs.LogDrivers.awsLogs({
          logGroup,
          streamPrefix: 'backend',
        }),

        environment: {
          SPRING_PROFILES_ACTIVE: 'prod',

          DB_URL: `jdbc:postgresql://${this.database.dbInstanceEndpointAddress}:${this.database.dbInstanceEndpointPort}/clinical_system`,

          AWS_S3_BUCKET: this.clinicalDocumentsBucket.bucketName,
          AWS_S3_REGION: this.region,

          //APP_FRONTEND_URL: 'http://localhost:5173',
          APP_FRONTEND_URL: 'https://clarityehr.app',

          MAIL_PORT: '587',

          JWT_EXPIRATION: '3600000',
          JWT_REFRESH_EXPIRATION: '86400000',
          JWT_ISSUER: 'clinical-system',
        },

        secrets: {
          DB_USERNAME: ecs.Secret.fromSecretsManager(
            this.database.secret!,
            'username',
          ),

          DB_PASSWORD: ecs.Secret.fromSecretsManager(
            this.database.secret!,
            'password',
          ),

          JWT_SECRET: ecs.Secret.fromSecretsManager(
            this.applicationSecret,
            'jwtSecret',
          ),

          ENCRYPTION_KEY: ecs.Secret.fromSecretsManager(
            this.applicationSecret,
            'encryptionKey',
          ),

          MAIL_HOST: ecs.Secret.fromSecretsManager(
            this.applicationSecret,
            'mailHost',
          ),

          MAIL_USERNAME: ecs.Secret.fromSecretsManager(
            this.applicationSecret,
            'mailUsername',
          ),

          MAIL_PASSWORD: ecs.Secret.fromSecretsManager(
            this.applicationSecret,
            'mailPassword',
          ),

          MAIL_FROM: ecs.Secret.fromSecretsManager(
            this.applicationSecret,
            'mailFrom',
          ),
        },
      },
    );

    backendContainer.addPortMappings({
      containerPort: 8080,
      protocol: ecs.Protocol.TCP,
    });

    /*
    * ------------------------------------------------------------
    * 15. Route 53 hosted zone
    * ------------------------------------------------------------
    *
    * The domain is registered through GoDaddy, but DNS is hosted
    * in the Route 53 public hosted zone.
    *
    * The GoDaddy nameservers have already been changed to the
    * four Route 53 nameservers for this hosted zone.
    */

    const hostedZone = route53.HostedZone.fromLookup(
      this,
      'ClarityEhrHostedZone',
      {
        domainName: 'clarityehr.app',
        privateZone: false,
      },
    );

    /*
    * ------------------------------------------------------------
    * 15.1. ACM certificate
    * ------------------------------------------------------------
    *
    * Certificate for the production backend API.
    *
    * DNS validation is performed automatically through Route 53.
    */

    const apiCertificate = new acm.Certificate(
      this,
      'ApiCertificate',
      {
        domainName: 'api.clarityehr.app',
        validation: acm.CertificateValidation.fromDns(hostedZone,),
      },
    );

    /*
     * ------------------------------------------------------------
     * 15.2. Application Load Balancer
     * ------------------------------------------------------------
     */

    const loadBalancer = new elbv2.ApplicationLoadBalancer(
      this,
      'ClarityEhrLoadBalancer',
      {
        loadBalancerName: 'clarityehr-prod-alb',
        vpc: this.vpc,
        internetFacing: true,
        securityGroup: loadBalancerSecurityGroup,
      },
    );

    const targetGroup = new elbv2.ApplicationTargetGroup(
      this,
      'BackendTargetGroup',
      {
        targetGroupName: 'clarityehr-prod-backend-tg',
        vpc: this.vpc,
        port: 8080,
        protocol: elbv2.ApplicationProtocol.HTTP,
        targetType: elbv2.TargetType.IP,

        healthCheck: {
          path: '/actuator/health',
          protocol: elbv2.Protocol.HTTP,
          port: '8080',
          healthyHttpCodes: '200',
          interval: cdk.Duration.seconds(30),
          timeout: cdk.Duration.seconds(5),
          healthyThresholdCount: 2,
          unhealthyThresholdCount: 3,
        },
      },
    );

    /*
     * ------------------------------------------------------------
     * 16. ECS service
     * ------------------------------------------------------------
     */

    const backendService = new ecs.FargateService(
      this,
      'BackendService',
      {
        serviceName: 'clarityehr-prod-backend-service',
        cluster: this.ecsCluster,
        taskDefinition,
        desiredCount: 1,

        assignPublicIp: false,

        securityGroups: [
          this.applicationSecurityGroup,
        ],

        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },

        healthCheckGracePeriod: cdk.Duration.seconds(120),

        circuitBreaker: {
          enable: true,
          rollback: true,
        },

        minHealthyPercent: 0,
        maxHealthyPercent: 200,
      },
    );

    targetGroup.addTarget(
      backendService.loadBalancerTarget({
        containerName: 'clarityehr-backend',
        containerPort: 8080,
      }),
    );

    /*
    * ------------------------------------------------------------
    * 17. HTTPS listener
    * ------------------------------------------------------------
    */

    const httpsListener = loadBalancer.addListener(
      'HttpsListener',
      {
        port: 443,
        protocol: elbv2.ApplicationProtocol.HTTPS,
        certificates: [apiCertificate],
        open: true,
        sslPolicy: elbv2.SslPolicy.RECOMMENDED_TLS,
      },
    );

    /*
    * ------------------------------------------------------------
    * 18. HTTP → HTTPS redirect
    * ------------------------------------------------------------
    */

    loadBalancer.addListener(
      'HttpListener',
      {
        port: 80,
        protocol: elbv2.ApplicationProtocol.HTTP,
        open: true,
        defaultAction: elbv2.ListenerAction.redirect({
          protocol: 'HTTPS',
          port: '443',
          permanent: true,
        }),
      },
    );

    httpsListener.addTargetGroups(
      'BackendTarget',
      {
        targetGroups: [targetGroup],
      },
    );

    /*
    * ------------------------------------------------------------
    * 19. Production API DNS record
    * ------------------------------------------------------------
    */

    new route53.ARecord(
      this,
      'ApiAliasRecord',
      {
        zone: hostedZone,
        recordName: 'api',
        target: route53.RecordTarget.fromAlias(
          new targets.LoadBalancerTarget(loadBalancer),
        ),
      },
    );

    /*
    * ------------------------------------------------------------
    * 20. Production frontend DNS records
    * ------------------------------------------------------------
    */

    new route53.ARecord(
      this,
      'FrontendAliasRecord',
      {
        zone: hostedZone,
        recordName: '',
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(frontendDistribution),
        ),
      },
    );

    new route53.ARecord(
      this,
      'FrontendWwwAliasRecord',
      {
        zone: hostedZone,
        recordName: 'www',
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(frontendDistribution)
        )
      }
    )

    /*
     * ------------------------------------------------------------
     * 21. CloudFormation outputs
     * ------------------------------------------------------------
     */

    new cdk.CfnOutput(this, 'VpcId', {
      value: this.vpc.vpcId,
      description: 'Clarity EHR production VPC ID',
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: this.database.dbInstanceEndpointAddress,
      description: 'RDS PostgreSQL endpoint',
    });

    new cdk.CfnOutput(this, 'DatabasePort', {
      value: this.database.dbInstanceEndpointPort,
      description: 'RDS PostgreSQL port',
    });

    new cdk.CfnOutput(this, 'ClinicalDocumentsBucketName', {
      value: this.clinicalDocumentsBucket.bucketName,
      description: 'S3 bucket for clinical documents',
    });

    new cdk.CfnOutput(this, 'BackendRepositoryUri', {
      value: this.backendRepository.repositoryUri,
      description: 'ECR repository URI for the Spring Boot backend',
    });

    new cdk.CfnOutput(this, 'DatabaseSecretArn', {
      value: this.database.secret!.secretArn,
      description: 'Secrets Manager secret containing RDS credentials',
    });

    new cdk.CfnOutput(this, 'ApplicationSecretArn', {
      value: this.applicationSecret.secretArn,
      description: 'Secrets Manager secret containing application secrets',
    });

    new cdk.CfnOutput(this, 'LoadBalancerDnsName', {
      value: loadBalancer.loadBalancerDnsName,
      description: 'Application Load Balancer DNS name',
    });

    new cdk.CfnOutput(this, 'ApiDomainName', {
      value: 'api.clarityehr.app',
      description: 'Production backend API domain',
    });

    new cdk.CfnOutput(this, 'ApiCertificateArn', {
      value: apiCertificate.certificateArn,
      description: 'ACM certificate for the production backend API',
    });

    new cdk.CfnOutput(this, 'EcsClusterName', {
      value: this.ecsCluster.clusterName,
      description: 'ECS cluster name',
    });

    new cdk.CfnOutput(this, 'EcsServiceName', {
      value: backendService.serviceName,
      description: 'ECS backend service name',
    });
  }
}
