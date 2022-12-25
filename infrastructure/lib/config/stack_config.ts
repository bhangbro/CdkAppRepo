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

export enum StageType {
    ALPHA = "ALPHA",
    BETA = "BETA",
    PROD = "PROD",
}

export class AppStackConfig extends StackConfig {
    readonly #stageType: StageType;

    constructor(accountId: string, awsRegion: string, stageType: StageType, stackName?: string | null) {
        super(accountId, awsRegion, stackName)
        this.#stageType = stageType;
    }
    
    get stageType() {
        return this.#stageType;
    }

    isAlpha() {
        return this.#stageType == StageType.ALPHA;
    }

    isBeta() {
        return this.#stageType == StageType.BETA;
    }
    
    isProd() {
        return this.#stageType == StageType.PROD;
    }
}

export const DEFAULT_STACK_ACCOUNT = "567435782255";
export const DEFAULT_STACK_REGION = "us-west-2"; // OREGON
export const ALPHA_STACK_REGION = "us-east-1"; // OHIO
export const BETA_STACK_REGION = "us-east-2"; // VIRGINIA
// export const PROD_STACK_REGION = "us-west-2";

// Stack config used to create pipeline
export const PIPELINE_STACK_CONFIG: StackConfig = new StackConfig(DEFAULT_STACK_ACCOUNT, DEFAULT_STACK_REGION);

// Stacks configs used to deploy resources regionally via a CodePipeline
export const STACK_CONFIGS: AppStackConfig[] = [
    // Alpha stack
    new AppStackConfig(DEFAULT_STACK_ACCOUNT, ALPHA_STACK_REGION, StageType.ALPHA),
    // Beta stack
    new AppStackConfig(DEFAULT_STACK_ACCOUNT, BETA_STACK_REGION, StageType.BETA),
    // Prod stack (or stacks if you want to create more than 1)
    // new AppStackConfig(DEFAULT_STACK_ACCOUNT, PROD_STACK_REGION, StageType.PROD, BASE_WEB_DOMAIN)
];
