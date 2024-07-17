import { Router } from "express";
import { createUserHandler, resendVerificationEmail, verifyEmail } from "../controller/user.controller";
import validate from "../../../shared/middlewares/validateResource";
import { createUserSchema } from "../schema/user.schema";

const router = Router();

router.post('/users', validate(createUserSchema), createUserHandler);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification-email', resendVerificationEmail);

export default router;