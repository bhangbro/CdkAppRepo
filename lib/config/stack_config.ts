export class StackConfig {
    readonly #stackName: string;
    readonly #account: string;
    readonly #region: string;

    constructor(accountId: string, awsRegion: string, stackName?: string | null) {
        if (stackName == null) {
            this.#stackName = accountId + "_" + awsRegion;
        } else {
            this.#stackName = stackName;
        }
        this.#account = accountId;
        this.#region = awsRegion;
    }

    get stackName() {
        return this.#stackName;
    }

    get account() {
        return this.#account;
    }

    get region() {
        return this.#region;
    }
}

export interface IStackConfig {
    readonly stackName: string;
    readonly account: string;
    readonly region: string;
}

export const DEFAULT_STACK_ACCOUNT = "754366521541";
export const DEFAULT_STACK_REGION = "us-west-2";
export const BETA_STACK_REGION = "us-east-1";

// Stack config used to create pipeline
export const PIPELINE_STACK_CONFIG: StackConfig = new StackConfig(DEFAULT_STACK_ACCOUNT, DEFAULT_STACK_REGION);

// Stacks configs used to deploy resources regionally via a CodePipeline
export const STACK_CONFIGS: StackConfig[] = [
    PIPELINE_STACK_CONFIG,
  new StackConfig(DEFAULT_STACK_ACCOUNT, BETA_STACK_REGION)
];