import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new sqs.Queue(this, 'AppQueue', {
      queueName: "AppQueue"
    });

    new Function(this, 'LambdaFunction', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: new InlineCode('exports.handler = _ => console.log("Hello, CDK");')
    });
  }
}
