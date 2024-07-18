import { omit } from "lodash";
import UserModel, { IUser } from "../model/user.model";
import { PasswordTokenInput, UserInput } from "../types/userTypes";
import { generatePasswordResetToken, generateVerificationToken, verifyJwt } from "../../../shared/utils/jwt.utils";
import { sendPasswordResetEmail, sendVerificationEmail } from "../../email/services/email.service";

export async function createUser(input: UserInput){
    try {
        const user = await UserModel.create(input)
        const token = generateVerificationToken({
            _id: user._id as string,
            email: user.email,
            name: user.name,
            verified: user.verified
        });
        await sendVerificationEmail(user.email, token);
        return user;
    } catch (e: any){
        throw new Error(e)
    }
}

export async function verifyEmail(token: string){
    try {
        const { decoded, expired } = verifyJwt(token);


        if (expired) {
            throw new Error('Invalid or expired token');
        }

        if (!decoded) {
            throw new Error('Invalid token');
        }

        const user = decoded as IUser;

        if (user.verified) {
            throw new Error('User is already verified');
        }

        user.verified = true;

        await UserModel.findByIdAndUpdate(user._id, { verified: true });

    } catch (e: any){
        throw new Error(e)
    }
}

export async function resendVerificationEmail(email: string){
    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        if (user.verified) {
            throw new Error('User is already verified');
        }

        const token = generateVerificationToken({
            _id: user._id as string,
            email: user.email,
            name: user.name,
            verified: user.verified
        });
        await sendVerificationEmail(user.email, token);

    } catch (e: any){
        throw new Error(e)
    }
}

export async function validatePassword({email, password}: {email: string, password: string}){
    const user = await UserModel.findOne({ email });

    if(!user){
        return false;
    }

    const isValid = await user.comparePassword(password);

    if(!isValid) {
        return false;
    }

    return omit(user.toJSON(), "password");
}

export async function requestPasswordReset(email: string) {
    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new Error('User not found');
    }

    const token = generatePasswordResetToken({ _id: user._id as string });
    await sendPasswordResetEmail(user.email, token);
}

export async function resetPassword(token: string, password: string) {
    const { decoded, expired } = verifyJwt(token);

    if (expired) {
        throw new Error('Token expired');
    }

    if (!decoded) {
        throw new Error('Invalid token');
    }

    const userId = (decoded as any)._id;
    const user = await UserModel.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    user.password = password;

    await user.save();
}