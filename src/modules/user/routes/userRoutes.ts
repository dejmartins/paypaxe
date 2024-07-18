import { Router } from "express";
import { createUserHandler, requestPasswordResetHandler, resendVerificationEmail, resetPassword, verifyEmail } from "../controller/user.controller";
import validate from "../../../shared/middlewares/validateResource";
import { createUserSchema } from "../schema/user.schema";

const router = Router();

router.post('/users', validate(createUserSchema), createUserHandler);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification-email', resendVerificationEmail);
router.post('/request-password-reset', requestPasswordResetHandler);
router.post('/reset-password', resetPassword);

export default router;