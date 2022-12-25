import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/stacks/pipeline_stack';
import { PIPELINE_STACK_CONFIG } from '../lib/config/stack_config';

const app = new cdk.App();

// Define pipeline for continuous integration/continuous deployment application
new PipelineStack(app, 'CdkPipelineStack', {
  env: {
    account: PIPELINE_STACK_CONFIG.account,
    region: PIPELINE_STACK_CONFIG.region
  }
});
