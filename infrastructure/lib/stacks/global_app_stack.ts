import * as cdk from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface GlobalAppStackProps extends cdk.StageProps {
}

export class GlobalAppStack extends Stack {
  constructor(scope: Construct, id: string, props: GlobalAppStackProps) {
    super(scope, id, props);

    // CREATE AWS resources that are global
    // Examples:
    //  - Route53 for Domain management
    //  - IAM users required across regions
    //  - S3 buckets required across regions
  }
}
