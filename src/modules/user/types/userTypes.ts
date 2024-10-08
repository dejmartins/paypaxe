export interface UserInput {
    email: string;
    name: string;
    password: string;
    country: string;
}

export type ResetPasswordInput = {
    email: string;
    password: string | undefined;
}

export type VerificationTokenInput = {
    _id: string,
    name: string,
    verified: boolean
    email: string;
}

export type PasswordTokenInput = {
    _id: string,
}