# Welcome to your CDK TypeScript project!

This is a Blank project for TypeScript development with CDKv2 to deploy multi-stage, cross-region Application via CDK pipeline.

The `inafrstracuture/cdk.json` file tells the CDK Toolkit how to execute your app.

## What is CDK?

The AWS Cloud Development Kit is a programatic way to define CloudFormation Resources. This allows you to compile and validate the AWS resources you create via tests.
  - When you "build" your CDK project (in `infrastructure/`), it generates all the CloudFormation templates (.yaml or .json files). 
  - When you "synthesize" your CDK project, it creates the base resources in all the AWS account(s)/region(s) required to deploy the resources you defined in your CDK project.
  - When you "deploy" your CDK project, it creates all the resources defined in your CDK code (in `infrastructure/`)

# Project structure
- `infrastructure/` (AWS CDK cloud infrastructure definitions - TypeScript)
- `software/` (Code for business logic)
    - `lambda/` (Kotlin code to be used in a Java lambda function defined in `infrastructure/`)
    - `lambda-js/` (NodeJS code to be used in a NodeJS lambda function defined in `infrastructure/`)

# Setup
## Prerequisites
1. Workspace has NPM CLI installed (https://docs.npmjs.com/cli/v7/configuring-npm/install)
2. Workspace has Git CLI installed (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
3. Workspace has AWS CLI installed (https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
4. Workspace has CDK CLI installed (https://docs.aws.amazon.com/cdk/latest/guide/cli.html)
5. You have an AWS account
6. You have an IAM user with required permissions (AdministratorAccess will give all required permissions)
    - An IAM user provides credentials that don't need to be refreshed (versus an IAM role which does)
    - **Save the access key + secret access key**
7. You have created Git credentials on AWS using IAM (https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-gc.html)
    - This is used to link your local workspace to the CodeCommit repository that will manage your application/pipeline

## CDK Setup (project in infrastucture/)
1. Ensure you have installed all the prerequisites mentioned above
1. Go to `lib/config/stack_config.ts`
1. Set `DEFAULT_STACK_ACCOUNT` to your 12 digit AWS account number
1. Set `DEFAULT_STACK_REGION` to the AWS region to deploy the root pipeline
	- This region will be where the CodePipeline/CDKPipeline will be managed, and where the Alpha stage will be hosted
    - **us-west-2** is selected by default since it is a cheap region to host
1. Set `ALPHA_STACK_REGION` to the AWS region to deploy the ALPHA stage of the pipeline
	- **MUST BE DIFFERENT THAN VALUE IN `DEFAULT_STACK_REGION` to avoid duplicate resources**
	- **us-east-1** set by default
1. Set `BETA_STACK_REGION` to the AWS region to deploy the BETA stage of the pipeline
	- **MUST BE DIFFERENT THAN VALUE IN `DEFAULT_STACK_REGION` and `ALPHA_STACK_REGION` to avoid duplicate resources**
	- **us-east-2** set by default
1. If this is the first time deploying, you need to clear your git remote to be able to configure it to the AWS CodeCommit repo
    - run `./clear_git_remote.sh`
1. Deploy pipeline
    - On Unix machines, run `./deploy_pipeline.sh`
    - On Windows machines, run `./deploy_pipeline.bat` (no longer maintained)
    - These scripts do the following:
        - Create a Git repo in CodeCommit
        - Build and synthesize the CDK resources
        - Create

## Making Changes
1. After the `deploy_pipeline` script has been executed, your workspace should be linked to a CodeCommit repository, **CdkAppRepo**, or whatever repo you reconfigure this to be called
2. Make any code changes locally, and commit + push them to via Git CLI
3. The changes will build and deploy through a CodePipeline which should manage all changes

### Commands
1. `tsc` This will compile your Typescript code to verify your changes work
2. `npm install` will install any new dependencies defined in `package.json`

## Special Files
* `clear_git_remote.sh` is executable to clear the git repo these files are connected to
* `deploy_pipeline.sh` is executable to deploy CDK stack(s)
* `infrastructure/`
  * `bin/cdk_app.ts` Root file of the CDK app initialization
  * `lib/constants.ts` File with constants used in the package
    * `CODE_COMMIT_REPO_NAME` the name of the repository you want to store in CodeCommit
      * **NOTE: Changes to this will require changes to the `deploy_pipeline` scripts**
  * `lib/config/stack_config.ts` File with configurations for Pipeline stages
    * `STACK_CONFIGS` in `lib/config/stack_config.ts` define all AWS accounts/regions for stages in the CDKPipeline
  * `test/` contains all the tests for the .ts files defining the stacks
  * `package.json` Where all the application dependencies are defined

