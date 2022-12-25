import * as cdk from 'aws-cdk-lib';
import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { Construct } from 'constructs';
import { CodeBuildStack } from '../stacks/code_build_stack';

interface CodeBuildStageProps extends cdk.StageProps {
    readonly sourceArtifact: Artifact;
}

export class CodeBuildStage extends cdk.Stage {
  public readonly stack: CodeBuildStack

  constructor(scope: Construct, id: string, props: CodeBuildStageProps) {
    super(scope, id, props);

    //Build Stage
    this.stack = new CodeBuildStack(this, "CodeBuildStack", {
        sourceArtifact: props.sourceArtifact,
    })
  }
}