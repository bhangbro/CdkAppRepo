import * as cdk from 'aws-cdk-lib';
import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { Construct } from 'constructs';
import { SourceStack } from '../stacks/source_stack';

interface SourceStageProps extends cdk.StageProps {
    readonly sourceArtifact: Artifact;
}

export class SourceStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: SourceStageProps) {
    super(scope, id, props);

    const sourceStack = new SourceStack(this, 'SourceStack', {
        sourceArtifact: props.sourceArtifact
    });
  }
}