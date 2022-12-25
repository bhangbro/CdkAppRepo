import { StageType } from "./stack_config";

export enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    ERROR = "ERROR",
}

export interface LambdaEnvVariableConfig {
    // TODO define any data types Lambda environment variables for you app here
    // These variables are accessible within your lambda function and can be used to pass stage specific data
    //  Example: 
    //      if you have a testing database for alpha and a separate one for beta,
    //      you could pass the hostname for the test database into alpha 
    readonly appName: string;
    readonly stage: string;
    readonly logLevel: LogLevel;
}

export const API_LAMBDA_ENV_VARIABLE_CONFIG_ALPHA: LambdaEnvVariableConfig = {
    appName: 'MY_FIRST_CDK_APP',
    stage: 'ALPHA',
    logLevel: LogLevel.DEBUG,
}

export const API_LAMBDA_ENV_VARIABLE_CONFIG_BETA: LambdaEnvVariableConfig = {
    appName: 'MY_FIRST_CDK_APP',
    stage: 'BETA',
    logLevel: LogLevel.INFO,
}

export const API_LAMBDA_ENV_VARIABLE_CONFIG_PROD: LambdaEnvVariableConfig = {
    appName: 'MY_FIRST_CDK_APP',
    stage: 'PROD',
    logLevel: LogLevel.INFO,
}

export const API_LAMBDA_ENV_VARIABLE_CONFIGS: Record<string, LambdaEnvVariableConfig> = {
    [StageType.ALPHA]: API_LAMBDA_ENV_VARIABLE_CONFIG_ALPHA,
    [StageType.BETA]: API_LAMBDA_ENV_VARIABLE_CONFIG_BETA,
    [StageType.PROD]: API_LAMBDA_ENV_VARIABLE_CONFIG_PROD,
};
