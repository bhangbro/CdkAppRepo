import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AppStack } from '../stacks/app_stack';
import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { APP_NAME } from '../constants';

interface PipelineAppStageProps extends cdk.StageProps {
  readonly buildArtifact: Artifact;
  readonly artifactsBucket: Bucket;
}

export class PipelineAppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: PipelineAppStageProps) {
    super(scope, id, props);

    const appStack = new AppStack(this, `${APP_NAME}Stack`, {
      buildArtifact: props.buildArtifact,
      artifactsBucket: props.artifactsBucket
    });
  }
}