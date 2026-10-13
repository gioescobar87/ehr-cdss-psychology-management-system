import * as cdk from 'aws-cdk-lib';
import {
    aws_certificatemanager as acm,
    aws_route53 as route53,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class FrontendCertificateStack extends cdk.Stack {
    public readonly certificate: acm.Certificate;

    constructor(
        scope: Construct,
        id: string,
        props?: cdk.StackProps,
    ) {
        super(scope, id, props);
        const hostedZone = route53.HostedZone.fromLookup(
            this,
            'ClarityEhrHostedZone',
            {
                domainName: 'clarityehr.app',
                privateZone: false,
            },
        );

        this.certificate = new acm.Certificate(
            this,
            'FrontendCertificate',
            {
                domainName: 'clarityehr.app',
                subjectAlternativeNames: [
                    'www.clarityehr.app',
                ],
                validation: acm.CertificateValidation.fromDns(hostedZone),
            },
        );

        new cdk.CfnOutput(
            this,
            'FrontendCertificateArn',
            {
                value: this.certificate.certificateArn,
                description: 'ACM certificate for the Clarity EHR frontend',
            },
        );
    }
}
