import { omit } from "lodash";
import UserModel, { IUser, UserInput } from "../model/user.model";
import nodemailer from 'nodemailer'
import config from "../../../../config/default";
import { generateVerificationToken } from "../../../shared/utils/jwt.utils";

export async function createUser(input: UserInput){
    try {
        const user = await UserModel.create(input)
        const token = generateVerificationToken(user);
        await sendVerificationEmail(user.email, token);
        return user;
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

export async function sendVerificationEmail(email: string, token: string){
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.emailUser,
            pass: config.emailPass
        }
    });

    const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: 'Verify your email',
        text: `Please verify your email by clicking the following link: ${config.clientUrl}/verify-email?token=${token}`,
    }

    await transporter.sendMail(mailOptions);
}