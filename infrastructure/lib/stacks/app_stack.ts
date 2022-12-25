import * as cdk from 'aws-cdk-lib';
import { aws_codecommit, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Function, Code, InlineCode, Runtime, CfnFunction } from 'aws-cdk-lib/aws-lambda';
import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { APP_NAME, EXPORT_CODEBUILD_S3_KEY } from '../constants';

interface AppStackProps extends cdk.StageProps {
  readonly buildArtifact: Artifact;
  readonly artifactsBucket: Bucket;
}

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    new sqs.Queue(this, 'AppQueue', {
      queueName: "AppQueue"
    });

    new Function(this, 'LambdaFunction', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: new InlineCode('exports.handler = _ => console.log("Hello, CDK");')
    });

    const importedCodeBuildS3ObjectKey = cdk.Fn.importValue(EXPORT_CODEBUILD_S3_KEY);
    const lambda = new Function(this, `${APP_NAME}ApiLambdaFunction`, {
      runtime: Runtime.JAVA_11,
      handler: 'com.package.lambda.handlers.DefaultHandler::handleRequest', // TODO replace with your handler
      code: Code.fromBucket(props.artifactsBucket, importedCodeBuildS3ObjectKey)
    })
  }
}
