# Welcome to your CDK TypeScript project!

This is a Blank project for TypeScript development with CDKv2 to deploy multi-stage, cross-region Application via CDK pipeline

The `cdk.json` file tells the CDK Toolkit how to execute your app.

**NOTE: This will create at least 2 KMS keys ($1/month fee per KMS key)**

# Prerequisites
1. Workspace has NPM CLI installed (https://docs.npmjs.com/cli/v7/configuring-npm/install)
2. Workspace has Git CLI installed (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
3. Workspace has AWS CLI installed (https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
4. Workspace has CDK CLI installed (https://docs.aws.amazon.com/cdk/latest/guide/cli.html)
5. You have an AWS account
6. You have an IAM user with required permissions (AdministratorAccess will give all required permissions)
    - **Save the access key + secret access key**
7. You have created Git credentials on AWS using IAM (https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-gc.html)
    - This is used to link your local workspace to the CodeCommit repository that will manage your application/pipeline

# Initial Setup
1. Ensure you have installed all the prerequisites mentioned above
2. Go to `lib/config/stack_config.ts`
3. Set `DEFAULT_STACK_ACCOUNT` to your 12 digit AWS account number
4. Set `DEFAULT_STACK_REGION` to the AWS region to deploy the root pipeline 
	- This region will be where the CodePipeline/CDKPipeline will be managed, and where the Alpha stage will be hosted
    - **us-west-2** is selected by default since it is a cheaper region to host
5. Set `BETA_STACK_REGION` to the AWS region to deploy the BETA stage of the pipeline
	- **MUST BE DIFFERENT THAN VALUE IN `DEFAULT_STACK_REGION` to avoid duplicate resources**
	- **us-east-1** set by default to avoid collision with **us-west-2**, and since it is another cheaper region to host in
6. Deploy pipeline
    - On Unix machines, run `./deploy_pipeline.sh`
    - On Windows machines, run `./deploy_pipeline.bat`

## Making Changes
1. After the `deploy_pipeline` script has been executed, your workspace should be linked to a CodeCommit repository, **CdkAppRepo**, or whatever repo you reconfigure this to be called
2. Make any code changes locally, and commit + push them to via Git CLI
3. The changes will build and deploy through a CodePipeline which should manage all changes

### Commands
1. `tsc` This will compile your Typescript code to verify your changes work
2. `npm install` will install any new dependencies defined in `package.json`

## Special Files
* `bin/cdk_app.ts` Root file of the CDK app initialization
* `lib/constants.ts` File with constants used in the package
  * `CODE_COMMIT_REPO_NAME` the name of the repository you want to store in CodeCommit
    * **NOTE: Changes to this will require changes to the `deploy_pipeline` scripts**
* `lib/config/stack_config.ts` File with configurations for Pipeline stages
  * `STACK_CONFIGS` in `lib/config/stack_config.ts` define all AWS accounts/regions for stages in the CDKPipeline
* `deploy_pipeline.bat` is executable to deploy CDK stack(s)
* `test/` contains all the tests for the .ts files defining the stacks
* `package.json` Where all the application dependencies are defined

