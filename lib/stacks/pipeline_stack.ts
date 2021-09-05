import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CdkPipeline, SimpleSynthAction } from 'aws-cdk-lib/pipelines';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import { STACK_CONFIGS } from '../config/stack_config';
import { CODE_COMMIT_REPO_NAME } from '../constants';
import { PipelineAppStage } from '../stages/pipeline_app_stage';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Creates a CodeCommit repository that provides the code for the Pipeline deployments (this code)
    const appRepo = new codecommit.Repository(this, CODE_COMMIT_REPO_NAME, {
      repositoryName: CODE_COMMIT_REPO_NAME
    });

    // Defines the artifact representing the sourcecode
    const sourceArtifact = new codepipeline.Artifact();
    // Defines the artifact representing the cloud assembly 
    // (cloudformation template + all other assets)
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    // The basic pipeline declaration. This sets the initial structure
    // of our pipeline
    const pipeline = new CdkPipeline(this, 'AppPipeline', {
      pipelineName: 'AppPipeline',
      cloudAssemblyArtifact,
      // Generates the source artifact from the repo we created in the last step
      sourceAction: new codepipeline_actions.CodeCommitSourceAction({
        actionName: 'CodeCommit', // Any Git-based source control
        output: sourceArtifact, // Indicates where the artifact is stored
        repository: appRepo // Designates the repo to draw code from
      }),
      // Builds our source code outlined above into a could assembly artifact
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact, // Where to get source code to build
        cloudAssemblyArtifact, // Where to place built source
        buildCommand: 'npm run build' // Language-specific build cmd
      })
    });

    for (let index in STACK_CONFIGS) {
      if (index == "0") {
        // First entry is Alpha stage
        let alphaEnv = new PipelineAppStage(this, "AlphaEnv",
          {
            env: {
              account: STACK_CONFIGS[index].account,
              region: STACK_CONFIGS[index].region
            }
          }
        );
        const alphaStage = pipeline.addApplicationStage(alphaEnv);
        alphaStage.addManualApprovalAction({
          actionName: "AlphaManualApprovalAction"
        });
      } else if (index == "1") {
        // Second entry is Beta stage

        let betaEnv = new PipelineAppStage(this, "BetaEnv",
          {
            env: {
              account: STACK_CONFIGS[index].account,
              region: STACK_CONFIGS[index].region
            }
          }
        );
        const betaStage = pipeline.addApplicationStage(betaEnv);
      } else {
        //// All other entries are production
        //let prodEnv = new PipelineAppStage(this, ["ProdEnv", STACK_CONFIGS[index].account, STACK_CONFIGS[index].region].join("_"),
        //  {
        //    env: {
        //      account: STACK_CONFIGS[index].account,
        //      region: STACK_CONFIGS[index].region
        //    }
        //  }
        //);
        //const prodStage = pipeline.addApplicationStage(prodEnv);
      }
    }
  }
}