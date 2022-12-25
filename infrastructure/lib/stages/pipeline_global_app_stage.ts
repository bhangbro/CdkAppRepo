import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { APP_NAME } from '../constants';
import { GlobalAppStack } from '../stacks/global_app_stack';

interface PipelineAppStageProps extends cdk.StageProps {}

export class PipelineGlobalAppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: PipelineAppStageProps) {
    super(scope, id, props);

    const appStack = new GlobalAppStack(this, `${APP_NAME}GlobalStack`, {});
  }
}