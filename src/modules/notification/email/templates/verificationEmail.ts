import { EmailTemplateParams } from "../types/emailTypes";

export function verificationEmailTemplate({token, clientUrl}: EmailTemplateParams): string {
    return `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Verify Your Email</h2>
            <p>Thank you for registering. Please verify your email by clicking the link below:</p>
            <a href="${clientUrl}/verify-email?token=${token}" style="color: #1a73e8; text-decoration: none;">
                Verify Email
            </a>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thank you!</p>
        </div>
    `;
}
