import { omit } from "lodash";
import UserModel, { IUser } from "../model/user.model";
import { UserInput } from "../types/userTypes";
import { generatePasswordResetToken, generateVerificationToken, verifyJwt } from "../../../shared/utils/jwt.utils";
import { sendPasswordResetEmail, sendVerificationEmail } from "../../notification/email/services/email.service";
import { AppError } from "../../../shared/utils/customErrors";
import log from "../../../shared/utils/logger";
import { FilterQuery } from "mongoose";

export async function createUser(input: UserInput): Promise<IUser> {
    try {
        const existingUser = await UserModel.findOne({ email: input.email });

        if (existingUser) {
            throw new AppError("User with this email already exists.", 409);
        }

        const user = await UserModel.create(input);
        const token = generateVerificationToken({
            _id: user._id as string,
            email: user.email,
            name: user.name,
            verified: user.verified
        });
        await sendVerificationEmail(user.email, token);
        log.info(`User created with ID: ${user._id}`);
        return user;
    } catch (e: any) {
        log.error(`Error creating user: ${e.message}`);
        throw new AppError(e.message, e.statusCode, e.stack);
    }
}

export async function verifyEmail(token: string): Promise<void> {
    try {
        const { decoded, expired } = verifyJwt(token);

        if (expired || !decoded) {
            throw new AppError('Invalid or expired token', 400);
        }

        const user = decoded as IUser;

        if (user.verified) {
            throw new AppError('User is already verified', 400);
        }

        await UserModel.findByIdAndUpdate(user._id, { verified: true });
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode, e.stack);
    }
}

export async function resendVerificationEmail(email: string): Promise<void> {
    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new AppError('User not found', 400);
        }

        if (user.verified) {
            throw new AppError('User is already verified', 400);
        }

        const token = generateVerificationToken({
            _id: user._id as string,
            email: user.email,
            name: user.name,
            verified: user.verified
        });
        await sendVerificationEmail(user.email, token);

    } catch (e: any) {
        throw new AppError(e.message, e.statusCode, e.stack);
    }
}

export async function validatePassword({ email, password }: { email: string, password: string }): Promise<Partial<IUser>> {
    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new AppError('User not found', 400);
        }

        const isValid = await user.comparePassword(password);

        if (!isValid) {
            throw new AppError('Invalid Password Match', 400);
        }

        return omit(user.toJSON(), "password");
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode, e.stack);
    }
}

export async function requestPasswordReset(email: string): Promise<void> {
    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new AppError('User not found', 400);
        }

        const token = generatePasswordResetToken({ _id: user._id as string });
        await sendPasswordResetEmail(user.email, token);
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode, e.stack);
    }
}

export async function resetPassword(token: string, password: string): Promise<void> {
    try {
        const { decoded, expired } = verifyJwt(token);

        if (expired) {
            throw new AppError('Token expired', 400);
        }

        if (!decoded) {
            throw new AppError('Invalid token', 400);
        }

        const userId = (decoded as any)._id;
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new AppError('User not found', 400);
        }

        user.password = password;

        await user.save();
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode, e.stack);
    }
}

export async function findUser(query: FilterQuery<IUser>){
    try {
        return UserModel.findOne(query).lean();
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode, e.stack);
    }
}