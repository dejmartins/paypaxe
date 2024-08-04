import nodemailer from 'nodemailer';
import config from '../../../../../config/default';
import { verificationEmailTemplate } from '../templates/verificationEmail';
import { passwordResetEmailTemplate } from '../templates/passwordResetEmail';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.emailUser,
        pass: config.emailPass,
    },
});

export async function sendVerificationEmail(email: string, token: string) {
    const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: 'Email Verification',
        html: verificationEmailTemplate({token, clientUrl: config.clientUrl})
    };

    await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, token: string) {
    const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: 'Password Reset',
        html: passwordResetEmailTemplate({token, clientUrl: config.clientUrl})
    };

    await transporter.sendMail(mailOptions);
}

export async function sendEmailNotification(to: string, subject: string, message: string) {
    const mailOptions = {
        from: config.emailUser,
        to,
        subject,
        text: message
    };

    await transporter.sendMail(mailOptions);
}
