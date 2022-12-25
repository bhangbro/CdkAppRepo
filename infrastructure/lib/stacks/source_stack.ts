import * as cdk from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { CodeCommitSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { APP_NAME, CODE_COMMIT_API_REPO_NAME } from '../constants';

interface SourceStackProps extends cdk.StageProps {
  readonly sourceArtifact: Artifact;
}

export class SourceStack extends Stack {
  constructor(scope: Construct, id: string, props: SourceStackProps) {
    super(scope, id, props);

    //Source Stage
    const sourceAction = new CodeCommitSourceAction({
        actionName: "Source",
        repository: Repository.fromRepositoryName(
            this,
            `CodeCommitRepository${APP_NAME}ApiService`,
            CODE_COMMIT_API_REPO_NAME
        ),
        branch: 'master',
        output: props.sourceArtifact,
    });
  }
}
