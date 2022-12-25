import * as cdk from 'aws-cdk-lib';
import {Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { APP_NAME } from '../constants';
import { API_LAMBDA_ENV_VARIABLE_CONFIGS, LambdaEnvVariableConfig } from '../config/lambda_config';
import { AppStackConfig } from '../config/stack_config';

interface AppStackProps extends cdk.StageProps {
  stackConfig: AppStackConfig
}

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);
    const stageStackLambdaEnvConfig = API_LAMBDA_ENV_VARIABLE_CONFIGS[props.stackConfig.stageType];

    new sqs.Queue(this, 'AppQueue', {
      queueName: "AppQueue"
    });

    // Get the build artifacts from software/lambda-js from the CodePipeline object in /lib/stacks/pipeline_stack.ts 
    let lambdaJsCode = Code.fromAsset("../software/lambda-js/dist/lambda.zip");
    // Get the build artifacts from software/lambda from the CodePipeline object in /lib/stacks/pipeline_stack.ts
    let lambdaJavaCode = Code.fromAsset("../software/lambda/app/build/libs/app-1.0.0-lambda.jar");


    // This uses the build artifacts software/lambda-js to create a JavaScript Lambda
    // NOTE: you can create another Lambda with the same code if you define a separate handler in the lambda-js code
    const lambdaJs1 = this.getJSLambdaFn(
      'MY_FIRST_JAVASCRIPT_LAMBDA',
      'src/index.testHandler', // First handler with its own logic
      lambdaJsCode,
      stageStackLambdaEnvConfig
    );
    const lambdaJs2 = this.getJSLambdaFn(
      'MY_SECOND_JAVASCRIPT_LAMBDA',
      'src/index.anotherTestHandler', // Second handler with its own logic in the same code
      lambdaJsCode,
      stageStackLambdaEnvConfig
    );

    // This uses the build artifacts software/lambda from the CodePipeline object in /lib/stacks/pipeline_stack.ts 
    //  to create a Kotlin/Java Lambda (Code is in Kotlin, compiled into Java bytecode, so usable by Java Lambda)
    const lambdaJava = this.getJavaLambdaFn(
      'MY_FIRST_JAVA_LAMBDA',
      'io.mycdkapp.frameworks.lambda.handlers.TestHandler::handleRequest',
      lambdaJavaCode,
      stageStackLambdaEnvConfig
    );
  }

  getJSLambdaFn(
    name: string,
    handler: string,
    apiCode: Code,
    lambdaEnvConfig: LambdaEnvVariableConfig,
    memorySize?: number | undefined,
    timeoutSeconds?: number | undefined,
  ): Function {
    return new Function(this, `${APP_NAME}${name}`, {
      functionName: name,
      memorySize: memorySize || 384,
      timeout: cdk.Duration.seconds(timeoutSeconds || 10),
      runtime: Runtime.NODEJS_14_X,
      handler: handler,
      code: apiCode,
      environment: {
        // Each environment variable you defined in LambdaEnvVariableConfig must be converted to a string and passed here into Lambda function
        APP_NAME: lambdaEnvConfig.appName,
        STAGE: lambdaEnvConfig.stage,
        LOG_LEVEL: lambdaEnvConfig.logLevel
      }
    });
  }

  getJavaLambdaFn(
    name: string,
    handler: string,
    apiCode: Code,
    lambdaEnvConfig: LambdaEnvVariableConfig,
    memorySize?: number | undefined,
    timeoutSeconds?: number | undefined,
  ): Function {
    return new Function(this, `${APP_NAME}${name}`, {
      functionName: name,
      memorySize: memorySize || 512,  // Higher memory size (RAM) because the JVM uses more resources than NodeJS
      timeout: cdk.Duration.seconds(timeoutSeconds || 15), // Longer timeout than NodeJS because the JVM has a long startup time
      runtime: Runtime.JAVA_11,
      handler: handler,
      code: apiCode,
      environment: {
        // Each environment variable you defined in LambdaEnvVariableConfig must be converted to a string and passed here into Lambda function
        APP_NAME: lambdaEnvConfig.appName,
        STAGE: lambdaEnvConfig.stage,
        LOG_LEVEL: lambdaEnvConfig.logLevel
      }
    });
  }
}
