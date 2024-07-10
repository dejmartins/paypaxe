import { Router } from "express";
import { createAccountHandler } from "../controller/account.controller";
import validate from "../../../shared/middlewares/validateResource";
import { createAccountSchema } from "../schema/account.schema";

const router = Router();

router.post('/accounts', validate(createAccountSchema), createAccountHandler);

export default router;