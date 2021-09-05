#! /bin/sh

ECHO "Install dependencies from package.json"
npm install

ECHO "Compile Typescript"
tsc

ECHO "Setup AWS credentials using IAM user with AdministratorAccess"
aws configure

ECHO "Bootstrap CDK for all Stages in Pipeline (Account/Region combinations)"
cdk bootstrap

ECHO "Deploy CDK pipeline to create intial CodeCommit Repository"
cdk deploy CdkPipelineStack 

ECHO "Set project origin to CodeCommit"
git init
git remote add origin https://git-codecommit.us-west-2.amazonaws.com/v1/repos/CdkAppRepo

ECHO "Upload project to CodeCommit Repo"
git add --all
git commit -m "Initial pipeline with alpha and beta stage"
git push --set-upstream origin master

ECHO "Changes will now build and deploy through CodePipeline"