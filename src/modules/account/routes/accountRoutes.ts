import { Router } from "express";
import { createAccountHandler, getNetBalanceHandler, updateAllocationRuleHandler } from "../controller/account.controller";
import validate from "../../../shared/middlewares/validateResource";
import { createAccountSchema, getNetBalanceSchema, updateAllocationRuleSchema } from "../schema/account.schema";

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

router.put(
    "/accounts/:accountId/allocation-rule",
    validate(updateAllocationRuleSchema),
    updateAllocationRuleHandler     
);

export default router;