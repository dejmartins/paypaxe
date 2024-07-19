import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { createUserHandler, 
    requestPasswordResetHandler, 
    resendVerificationEmailHandler,  
    resetPasswordHandler, 
    verifyEmailHandler } from "../controller/user.controller";
import { createUserSchema, 
    resendVerificationEmailSchema, 
    requestResetPasswordSchema, 
    verifyEmailSchema, 
    resetPasswordSchema} from "../schema/user.schema";
import { createUserLimiter, emailLimiter } from "../../../shared/middlewares/rateLimiter";

const router = Router();

router.post('/users', createUserLimiter, validate(createUserSchema), createUserHandler);
router.get('/verify-email', validate(verifyEmailSchema), verifyEmailHandler);
router.post('/resend-verification-email', emailLimiter, validate(resendVerificationEmailSchema), resendVerificationEmailHandler);
router.post('/request-password-reset', emailLimiter, validate(requestResetPasswordSchema), requestPasswordResetHandler);
router.post('/reset-password', validate(resetPasswordSchema), resetPasswordHandler);

export default router;