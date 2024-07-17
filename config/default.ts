import dotenv from 'dotenv';
import { loadVariables } from 'apitoolz';

dotenv.config();

const DEPLOYMENT_MODE = {
    DEV: 'development',
    PROD: 'production',
    TEST: 'test',
};

const NODE_ENV = process.env.NODE_ENV || DEPLOYMENT_MODE.DEV;

const currentDeployment = {
    isDev: NODE_ENV == DEPLOYMENT_MODE.DEV,
    isProduction: NODE_ENV == DEPLOYMENT_MODE.PROD,
    isTest: NODE_ENV == DEPLOYMENT_MODE.TEST,
};

const constants = loadVariables(
    {
        PORT: {
            required: currentDeployment.isProduction,
            default: () => (currentDeployment.isTest ? 80 : 5000),
            parser: (value: number) => (currentDeployment.isTest ? 0 : value)
        },

        MONGODB_URI: {
            required: !currentDeployment.isTest,
            default: ""
        },

        SALT_WORK_FACTOR: {
            required: !currentDeployment.isTest,
            default: 10,
            parser: (value: number) => (currentDeployment.isDev ? 10 : Number(value))
        },

        PUBLIC_KEY: {
            required: !currentDeployment.isTest,
            default: "",
            parser: (value: string) => (currentDeployment.isTest ? value : value)
        },

        PRIVATE_KEY: {
            required: !currentDeployment.isTest,
            default: "",
            parser: (value: string) => (currentDeployment.isTest ? value : value)
        },

        ACCESS_TOKEN_TTL: {
            required: !currentDeployment.isTest,
            default: '15m',
            parser: (value: string) => (currentDeployment.isDev ? '15m' : value)
        },

        REFRESH_TOKEN_TTL: {
            required: !currentDeployment.isTest,
            default: '1y',
            parser: (value: string) => (currentDeployment.isDev ? '1y' : value)
        },

        VERIFICATION_TOKEN_TTL: {
            required: !currentDeployment.isTest,
            default: '20m',
            parser: (value: string) => (currentDeployment.isDev ? '1h' : value)
        },

        PP_API_KEY: {
            required: !currentDeployment.isTest,
            default: ""
        },

        PP_PK: {
            required: !currentDeployment.isTest,
            default: ""
        },

        PP_SK: {
            required: !currentDeployment.isTest,
            default: ""
        },

        EMAIL_USER: {
            required: !currentDeployment.isTest,
            default: ""
        },

        EMAIL_PASS: {
            required: !currentDeployment.isTest,
            default: ""
        },

        CLIENT_URL: {
            required: !currentDeployment.isTest,
            default: ""
        },
    }
)

export const config = {
    port: constants.PORT,
    db: {
        dbURI: constants.MONGODB_URI!
    },
    saltWorkFactor: constants.SALT_WORK_FACTOR,
    publicKey: constants.PUBLIC_KEY,
    privateKey: constants.PRIVATE_KEY,
    accessTokenTtl: constants.ACCESS_TOKEN_TTL,
    refreshTokenTtl: constants.REFRESH_TOKEN_TTL,
    verificationTokenTtl: constants.VERIFICATION_TOKEN_TTL,
    payPaxeApiKey: constants.PP_API_KEY,
    payPaxeSecretKey: constants.PP_SK,
    payPaxePrivateKey: constants.PP_PK,
    emailUser: constants.EMAIL_USER,
    emailPass: constants.EMAIL_PASS,
    clientUrl: constants.CLIENT_URL
}

export default config;

