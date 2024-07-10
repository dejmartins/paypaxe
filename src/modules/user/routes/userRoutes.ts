import { Router } from "express";
import { createUserHandler } from "../controller/user.controller";
import validate from "../../../shared/middlewares/validateResource";
import { createUserSchema } from "../schema/user.schema";

const router = Router();

router.post('/users', validate(createUserSchema), createUserHandler);

export default router;