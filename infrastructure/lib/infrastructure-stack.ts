import * as cdk from 'aws-cdk-lib';
import {
  aws_ec2 as ec2,
  aws_ecr as ecr,
  aws_rds as rds,
  aws_s3 as s3,
  aws_secretsmanager as secretmanager,
} from 'aws-cdk-lib';
import { Construct }from 'constructs'

export class InfrastructureStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly database: rds.DatabaseInstance;
  public readonly clinicalDocumentsBucket: s3.Bucket;
  public readonly backendRepository: ecr.Repository;
  public readonly applicationSecret: secretmanager.Secret;

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
        *   -> Future Application Load Balancer
        *
        * Private subnets
        *   -> Future ECS Fargate tasks
        *
        * Isolated subnets
        *   -> RDS PostgreSQL
     *
     * We use two Availability Zones but only one NAT Gateway
     * to keep the initial infrastructure cost reasonable.
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
     * 2. Database security group
     * ------------------------------------------------------------
     */

    const applicationSecurityGroup = new ec2.SecurityGroup(
      this,
      'ApplicationSecurityGroup',
      {
        vpc: this.vpc,
        securityGroupName: 'clarityehr-prod-application-sg',
        description: 'Security group for future ECS Fargate tasks',
        allowAllOutbound: true,
      },
    );

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
      applicationSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow PostgreSQL access only from ECS application tasks',
    );

    /*
     * ------------------------------------------------------------
     * 3. RDS PostgreSQL
     * ------------------------------------------------------------
     */

    this. database = new rds.DatabaseInstance(this, 'ClarityEhrDatabase', {
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
    });

    /*
     * ------------------------------------------------------------
     * 4. Clinical documents S3 bucket (Clinical records only - private)
     * ------------------------------------------------------------
     */

    this.clinicalDocumentsBucket = new s3.Bucket(this, 'ClinicalDocumentsBucket',
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
     * 5. ECR repository
     * ------------------------------------------------------------
     */

    this.backendRepository = new ecr.Repository(this, 'BackendRepository',
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
     * 6. Application secrets
     * ------------------------------------------------------------
     */

    this.applicationSecret = new secretmanager.Secret(this, 'ApplicationSecret',
      {
        secretName: 'clarityehr/prod/application',
        description: 'Application secrets for the Clarity EHR Spring Boot backend',
        generateSecretString: {
          secretStringTemplate: JSON.stringify({
            username: 'application',
          }),
          generateStringKey: 'jwtSecret',
          excludePunctuation: false,
        },
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
    );

    /*
     * ------------------------------------------------------------
     * 7. CloudFormation outputs
     * ------------------------------------------------------------
     */

    new cdk.CfnOutput(this, 'VpcId',
      {
        value: this.vpc.vpcId,
        description: 'Clarity EHR production VPC ID',
      }
    );

    new cdk.CfnOutput(this, 'DatabaseEndpoint',
      {
        value: this.database.dbInstanceEndpointAddress,
        description: 'RDS PostgreSQL endpoint',
      }
    );

    new cdk.CfnOutput(this, 'DatabasePort',
      {
        value: this.database.dbInstanceEndpointPort,
        description: 'RDS PostgreSQL port',
      }
    );

    new cdk.CfnOutput(this, 'ClinicalDocumentsBucketName',
      {
        value: this.clinicalDocumentsBucket.bucketName,
        description: 'S3 bucket for clinical documents',
      }
    );

    new cdk.CfnOutput(this, 'BackendRepositoryUri',
      {
        value: this.backendRepository.repositoryUri,
        description: 'ECR repository URI for the Spring Boot backend',
      }
    );

    new cdk.CfnOutput(this, 'DatabaseSecretArn',
      {
        value: this.database.secret!.secretArn,
        description: 'Secrets Manager secret containing RDS credentials',
      }
    );

    new cdk.CfnOutput(this, 'ApplicationSecretArn',
      {
        value: this.applicationSecret.secretArn,
        description: 'Secrets Manager secret containing application secrets',
      }
    );
  }
}