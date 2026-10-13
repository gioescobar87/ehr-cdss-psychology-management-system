#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { FrontendCertificateStack } from '../lib/frontend-certificate-stack';

const app = new cdk.App();

new InfrastructureStack (app, 'ClarityEhrProductionStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-2',
  },
});

const frontendCertificateStack = new FrontendCertificateStack(
  app,
  'ClarityEhrFrontendCertificateStack',
  {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: 'us-east-1',
    },
  },
);