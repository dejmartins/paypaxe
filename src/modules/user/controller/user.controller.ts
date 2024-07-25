import { Request, Response } from "express";
import { createUser, requestPasswordReset, resendVerificationEmail, resetPassword, verifyEmail } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";
import { omit } from "lodash";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { successResponse } from "../../../shared/utils/response";

export const createUserHandler = asyncHandler(async (req: Request<{}, {}, CreateUserInput['body']>, res: Response) => {
    const user = await createUser(req.body);
    return res.json(successResponse(omit(user.toJSON(), "password"), 'User created successfully'));
});

export const verifyEmailHandler = asyncHandler(async (req: Request, res: Response) => {
    const token = req.query.token as string;
    await verifyEmail(token);
    return res.json(successResponse({}, 'Email verified successfully'));
});

export const resendVerificationEmailHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await resendVerificationEmail(email);
    return res.json(successResponse({}, 'Verification email sent'));
});

export const requestPasswordResetHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await requestPasswordReset(email);
    return res.json(successResponse({}, 'Password reset email sent'));
});

export const resetPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    await resetPassword(token, newPassword);
    return res.json(successResponse({}, 'Password reset successfully'));
});