import nodemailer from 'nodemailer';
import config from '../../../../../config/default';
import { verificationEmailTemplate } from '../templates/verificationEmail';
import { passwordResetEmailTemplate } from '../templates/passwordResetEmail';
import { paymentFailureEmailTemplate, subscriptionConfirmationEmailTemplate } from '../templates/subscriptionStatusEmail';

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

export async function sendSubscriptionConfirmationEmail(email: string, plan: string, numberOfMonths: number) {
    const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: 'Subscription Successful',
        html: subscriptionConfirmationEmailTemplate({
            plan,
            numberOfMonths,
            clientUrl: config.clientUrl,
        }),
    };

    await transporter.sendMail(mailOptions);
}

export async function sendPaymentFailureEmail(email: string, reference: string) {
    const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: 'Payment Failed',
        html: paymentFailureEmailTemplate({
            reference,
            clientUrl: config.clientUrl,
        }),
    };

    await transporter.sendMail(mailOptions);
}
