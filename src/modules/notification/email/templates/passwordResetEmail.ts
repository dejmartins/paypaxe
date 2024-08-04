import { EmailTemplateParams } from "../types/emailTypes";

export function passwordResetEmailTemplate({token, clientUrl}: EmailTemplateParams): string {
    return `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Reset Your Password</h2>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <a href="${clientUrl}/reset-password?token=${token}" style="color: #1a73e8; text-decoration: none;">
                Reset Password
            </a>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thank you!</p>
        </div>
    `;
}
