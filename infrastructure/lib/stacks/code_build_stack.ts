import * as cdk from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { BuildSpec, LinuxBuildImage, PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import { CodeBuildAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { APP_NAME, EXPORT_CODEBUILD_S3_KEY } from '../constants';

interface CodeBuildStackProps extends cdk.StackProps {
  readonly sourceArtifact: Artifact;
}

export class CodeBuildStack extends Stack {
  public readonly artifactsBucket: Bucket
  public readonly buildArtifact: Artifact

  constructor(scope: Construct, id: string, props: CodeBuildStackProps) {
    super(scope, id, props);
    this.artifactsBucket = new Bucket(this, "S3BucketForPipelineArtifacts", {
      bucketName: APP_NAME.toLowerCase() + "api-artifacts-" + props.env?.account + "-" + props.env?.region
    });

    this.buildArtifact = new Artifact();
    const codeBuildProject = this.createCodeBuildProject(this.artifactsBucket.bucketName)
    const buildAction = new CodeBuildAction({
        actionName: "BuildAction",
        input: props.sourceArtifact,
        project: codeBuildProject,
        outputs: [ this.buildArtifact ]
    });

    // 👇 export myBucket for cross-stack reference
    new cdk.CfnOutput(this, 'CodeBuildS3ObjectKeyExport', {
        value: this.buildArtifact.objectKey,
        description: 'CodeBuild S3 object key',
        exportName: EXPORT_CODEBUILD_S3_KEY,
      });
  }

  // Creating code build project
  private createCodeBuildProject = (artifactsBucket: string): PipelineProject => {
    const codeBuildProject = new PipelineProject(this, 'CodeBuildProject', {
        projectName: `CodeBuild-${APP_NAME}ApiServiceLambda`,
        environment: {
            buildImage: LinuxBuildImage.STANDARD_5_0
        },
        buildSpec: BuildSpec.fromObject(this.getBuildSpecContent(artifactsBucket))
    });

    codeBuildProject.role?.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));
    return codeBuildProject;
  }

  // Creating the build spec content.
  private getBuildSpecContent = (artifactsBucket: string) => {
      return {
          version: '0.2',
          phases: {
              install: {
                  'runtime-versions': {
                    java: 'corretto11'
                  },
                  commands: './gradlew clean build --refresh-dependencies --parallel'
              },
              pre_build: {
                  commands: [
                      'echo build start'
                  ]
              },
              build: {
                  commands: [
                      'echo Build started on `date`',
                      'echo Build started on `date`',
                      'sam build',
                      'export BUCKET='+artifactsBucket,
                      'sam package --s3-bucket $BUCKET --output-template-file output_rx_template.yml',
                      'echo Build completed on `date`'
                  ]
              }
          },
          artifacts: {
              type: 'zip',
              files: [
                  'template.yml',
                  'output_rx_template.yml'
              ]
          }
      }
  }
}
