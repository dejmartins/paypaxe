import { Request, Response } from "express";
import log from "../../../shared/utils/logger";
import { createUser, sendVerificationEmail } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";
import { omit } from "lodash";
import { generateVerificationToken, verifyJwt } from "../../../shared/utils/jwt.utils";
import UserModel, { IUser } from "../model/user.model";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput['body']>, res: Response){
    try{
        const user = await createUser(req.body);
        return res.send(omit(user.toJSON(), "password"));
    }catch(e: any){
        log.error(e)
        return res.status(409).send(e.message)
    }
}

export async function verifyEmail(req: Request, res: Response) {
    const token = req.query.token as string;

    if (!token) {
        return res.status(400).send('Verification token is required');
    }

    try {
        const { decoded } = verifyJwt(token);

        if (!decoded || typeof decoded === 'string') {
            return res.status(400).send('Invalid or expired token');
        }

        const user = decoded as IUser;

        if (user.verified) {
            return res.status(400).send('User is already verified');
        }

        user.verified = true;

        await UserModel.findByIdAndUpdate(user._id, { verified: true });

        return res.send('Email verified successfully');

    } catch (error: any) {
        return res.status(400).send('Invalid or expired token');
    }
}

export async function resendVerificationEmail(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email is required');
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(404).send('User not found');
    }

    if (user.verified) {
        return res.status(400).send('User is already verified');
    }

    const token = generateVerificationToken(user);
    await sendVerificationEmail(user.email, token);

    return res.send('Verification email sent');
}