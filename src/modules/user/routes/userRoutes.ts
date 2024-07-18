import { Router } from "express";
import { createUserHandler, requestPasswordResetHandler, resetPassword } from "../controller/user.controller";
import validate from "../../../shared/middlewares/validateResource";
import { createUserSchema } from "../schema/user.schema";

const router = Router();

router.post('/users', validate(createUserSchema), createUserHandler);
router.post('/request-password-reset', requestPasswordResetHandler);
router.post('/reset-password', resetPassword);

export default router;