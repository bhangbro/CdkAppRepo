import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import { CdkPipeline, SimpleSynthAction } from 'aws-cdk-lib/pipelines';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import { STACK_CONFIGS } from '../config/stack_config';
import { APP_NAME, CODE_COMMIT_DEPLOY_BRANCH_NAME, CODE_COMMIT_REPO_NAME } from '../constants';
import { PipelineAppStage } from '../stages/pipeline_app_stage';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { SourceStage } from '../stages/source_stage';
import { CodeBuildStage } from '../stages/code_build_stage';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Creates a CodeCommit repository that provides the code for the Pipeline deployments (this code)
    const appRepo = new codecommit.Repository(this, CODE_COMMIT_REPO_NAME, {
      repositoryName: CODE_COMMIT_REPO_NAME
    });

    // The basic pipeline declaration. This sets the initial structure
    // of our pipeline
    const pipeline = new CodePipeline(this, `${APP_NAME}ApiPipeline`, {
      pipelineName: `${APP_NAME}ApiPipeline`,
      synth: new CodeBuildStep('Synth', {
        input: CodePipelineSource.codeCommit(appRepo, CODE_COMMIT_DEPLOY_BRANCH_NAME),
        installCommands: [
            'npm install -g aws-cdk'
        ],
        commands: [
          'npm ci', 
          'npm run build',
          'npx cdk synth'
        ]
      })
    });

    // Source Stage
    const sourceArtifact = new Artifact();
    const sourceStage = new SourceStage(scope, "SourceStage", {
      sourceArtifact: sourceArtifact
    })
    pipeline.addStage(sourceStage);

    // Code Build Stage
    const buildStage = new CodeBuildStage(scope, "CodeBuildStage", {
      sourceArtifact: sourceArtifact,
    })
    pipeline.addStage(buildStage);
    
    // App Stages
    for (let index in STACK_CONFIGS) {
      if (index == "0") {
        // First entry is Alpha stage
        let alphaEnv = new PipelineAppStage(this, "AlphaEnv",
          {
            env: {
              account: STACK_CONFIGS[index].account,
              region: STACK_CONFIGS[index].region
            },
            buildArtifact: buildStage.stack.buildArtifact,
            artifactsBucket: buildStage.stack.artifactsBucket
          }
        );
        const alphaStage = pipeline.addStage(alphaEnv);
        alphaStage.addPost(new ManualApprovalStep("AlphaManualApprovalStep", {
          comment: "Alpha Manual Approval Step"
        }));
      } else if (index == "1") {
        // Second entry is Beta stage
        let betaEnv = new PipelineAppStage(this, "BetaEnv",
          {
            env: {
              account: STACK_CONFIGS[index].account,
              region: STACK_CONFIGS[index].region
            },
            buildArtifact: buildStage.stack.buildArtifact,
            artifactsBucket: buildStage.stack.artifactsBucket
          }
        );
        const betaStage = pipeline.addStage(betaEnv);
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
        //const prodStage = pipeline.addStage(prodEnv);
      }
    }
  }
}
