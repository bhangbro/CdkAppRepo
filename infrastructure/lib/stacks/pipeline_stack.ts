import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { STACK_CONFIGS } from '../config/stack_config';
import { APP_NAME, CODE_COMMIT_DEPLOY_BRANCH_NAME, CODE_COMMIT_REPO_NAME } from '../constants';
import { PipelineAppStage } from '../stages/pipeline_app_stage';
import { PipelineGlobalAppStage } from '../stages/pipeline_global_app_stage';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Creates a CodeCommit repository that provides the code for the Pipeline deployments (this code)
    const appRepo = new codecommit.Repository(this, CODE_COMMIT_REPO_NAME, {
      repositoryName: CODE_COMMIT_REPO_NAME
    });

    // The basic pipeline declaration. This sets the initial structure
    // of our pipeline
    // The CodePipeline is used to build official versions of you software, and then do things like:
    //  - publish the library
    //  - deploy apps to AWS
    //  - deploy resources to AWS (may cost money depending on what you create)
    // These are all configurable by editting this code using the AWS Cloud Development Kit (https://docs.aws.amazon.com/cdk/v2/guide/home.html)
    // Data structures + resources: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html
    const pipeline = new CodePipeline(this, `${APP_NAME}Pipeline`, {
      pipelineName: `${APP_NAME}Pipeline`,
      codeBuildDefaults: {
        partialBuildSpec: this.getBuildSpecContent()
      },
      synth: new CodeBuildStep('Synth', {
        input: CodePipelineSource.codeCommit(appRepo, CODE_COMMIT_DEPLOY_BRANCH_NAME),
        installCommands: [
            'npm install -g aws-cdk'
        ],
        commands: [
          // Build Kotlin Lambda code
          'cd software/api-lambda',
          './gradlew clean build --refresh-dependencies --parallel',
          // Build NodeJS Lambda code
          'cd software/api-lambda-js',
          'npm ci',
          'npm run build',
          // Build Typescript CDK
          'cd ../../infrastructure/',
          'npm ci', 
          'npm run build',
          'npx cdk synth'
        ]
      })
    });
    // Global Stage
    let globalEnv = new PipelineGlobalAppStage(this, "GlobalEnv", {});
    const globalStage = pipeline.addStage(globalEnv);
    // TODO add back the approval step when ready to deploy to PROD
    // globalStage.addPost(new ManualApprovalStep("GlobalManualApprovalStep", {
    //   comment: "Global Manual Approval Step"
    // }));
    
    // App Stages
    for (let index in STACK_CONFIGS) {
      let stackConfig = STACK_CONFIGS[index];
      if (stackConfig.isAlpha()) {
        // First entry is Alpha stage
        let alphaEnv = new PipelineAppStage(this, "AlphaEnv",
          {
            env: {
              account: STACK_CONFIGS[index].account,
              region: STACK_CONFIGS[index].region
            },
            stackConfig: stackConfig
          }
        );
        const alphaStage = pipeline.addStage(alphaEnv);
        // TODO uncomment approval step when ready to deploy to BETA
        // alphaStage.addPost(new ManualApprovalStep("AlphaManualApprovalStep", {
        //   comment: "Alpha Manual Approval Step"
        // }));
      } else if (stackConfig.isBeta()) {
        // Second entry is Beta stage
        let betaEnv = new PipelineAppStage(this, "BetaEnv",
          {
            env: {
              account: STACK_CONFIGS[index].account,
              region: STACK_CONFIGS[index].region
            },
            stackConfig: stackConfig
          }
        );
        const betaStage = pipeline.addStage(betaEnv);
      } else if (stackConfig.isProd()) {
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
      } else {
        throw new TypeError("Unsupported stageType");
      }
    }
  }

  private getBuildSpecContent = () => {
    return BuildSpec.fromObject({
        version: '0.2',
        phases: {
            install: {
                'runtime-versions': {
                  java: 'corretto11',
                  nodejs: '14.x' // TODO upgrade to 16 when available
                },
                commands: [
                ]
            },
            pre_build: {
                commands: [
                ]
            },
            build: {
                commands: [
                ]
            }
        },
    });
  }
}
