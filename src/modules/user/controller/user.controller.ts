import { Request, Response } from "express";
import log from "../../../shared/utils/logger";
import { createUser, requestPasswordReset, resendVerificationEmail, resetPassword, verifyEmail } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";
import { omit } from "lodash";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput['body']>, res: Response){
    try{
        const user = await createUser(req.body);
        return res.send(omit(user.toJSON(), "password"));
    }catch(e: any){
        log.error(e)
        return res.status(409).send(e.message)
    }
}

export async function verifyEmailHandler(req: Request, res: Response) {
    try {
        const token = req.query.token as string;
        await verifyEmail(token);
        return res.send('Email verified successfully');
    } catch (error: any) {
        return res.status(409).send(error.message);
    }
}

export async function resendVerificationEmailHandler(req: Request, res: Response) {
    try {
        const { email } = req.body;
        await resendVerificationEmail(email);
        return res.send('Verification email sent');
    } catch(error: any){
        return res.status(409).send(error.message);
    }
}

export async function requestPasswordResetHandler(req: Request, res: Response) {
    const { email } = req.body;

    requestPasswordReset(email);

    return res.send('Password reset email sent');
}

export async function resetPasswordHandler(req: Request, res: Response) {
    const { token, newPassword } = req.body;

    await resetPassword(token, newPassword);

    return res.send('Password reset successfully');
}