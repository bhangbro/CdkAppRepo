ECHO Install dependencies from package.json
CALL npm install

ECHO Compile Typescript
CALL tsc

ECHO Setup AWS credentials using IAM user with AdministratorAccess
CALL aws configure

ECHO Bootstrap CDK for all Stages in Pipeline (Account/Region combinations)
CALL cdk bootstrap

ECHO Deploy CDK pipeline to create intial CodeCommit Repository
CALL cdk deploy CdkPipelineStack 

ECHO Set project origin to CodeCommit
CALL git init
CALL git remote add origin https://git-codecommit.us-west-2.amazonaws.com/v1/repos/CdkAppRepo

ECHO Upload project to CodeCommit Repo
CALL git add --all
CALL git commit -m "Initial pipeline with alpha and beta stage"
CALL git push --set-upstream origin master

ECHO Changes will now build and deploy through CodePipeline