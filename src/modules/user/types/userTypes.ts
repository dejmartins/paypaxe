export interface UserInput {
    email: string;
    name: string;
    password: string;
}

export type ResetPasswordInput = {
    email: string;
    password: string | undefined;
}

export type VerifyTokenInput = {
    _id: string,
    name: string,
    verified: boolean
    email: string;
}