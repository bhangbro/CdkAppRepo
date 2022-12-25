#! /bin/sh

cd software/

echo "Build NodeJS lambda"
cd lambda-js/
npm run build

echo "Build Kotlin lambda"
cd ../lambda
./gradlew clean build --refresh-dependencies --parallel

echo "Go back to base dir"
cd ../../

echo "Install dependencies from infrastucture/package.json"
cd infrastructure/
npm install

echo "Compile Typescript"
tsc

echo "Setup AWS credentials using IAM user with AdministratorAccess"
aws configure

echo "Bootstrap CDK for all Stages in Pipeline (Account/Region combinations)"
cdk bootstrap

echo "Deploy CDK pipeline to create intial CodeCommit Repository"
cdk deploy CdkPipelineStack 

cd ../

echo "Set project origin to CodeCommit in the region of the CodePipeline"
# aws codecommit create-repository --repository-name CdkAppRepo
git remote add origin https://git-codecommit.us-west-2.amazonaws.com/v1/repos/CdkAppRepo

echo "Upload project to CodeCommit Repo"
git add --all
git commit -m "Initial pipeline with alpha and beta stage"
git push --set-upstream origin master

echo "Changes will now build and deploy through CodePipeline"