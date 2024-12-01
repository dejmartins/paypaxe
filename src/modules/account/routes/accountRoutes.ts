import { Router } from "express";
import { createAccountHandler, getNetBalanceHandler } from "../controller/account.controller";
import validate from "../../../shared/middlewares/validateResource";
import { createAccountSchema, getNetBalanceSchema } from "../schema/account.schema";

const router = Router();

router.post(
    '/accounts',
    validate(createAccountSchema),
    createAccountHandler
);

router.get(
    '/accounts/:accountId/net-balance',
    validate(getNetBalanceSchema),
    getNetBalanceHandler
);

export default router;