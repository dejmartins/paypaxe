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

const router = Router();

router.post('/users', validate(createUserSchema), createUserHandler);
router.get('/verify-email', validate(verifyEmailSchema), verifyEmailHandler);
router.post('/resend-verification-email', validate(resendVerificationEmailSchema), resendVerificationEmailHandler);
router.post('/request-password-reset', validate(requestResetPasswordSchema), requestPasswordResetHandler);
router.post('/reset-password', validate(resetPasswordSchema), resetPasswordHandler);

export default router;