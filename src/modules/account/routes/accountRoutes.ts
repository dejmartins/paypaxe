import { Router } from "express";
import { createAccountHandler, customizeUtilizationThresholdHandler, getNetBalanceHandler, updateAllocationRuleHandler } from "../controller/account.controller";
import validate from "../../../shared/middlewares/validateResource";
import { createAccountSchema, customizeUtilizationThresholdSchema, getNetBalanceSchema, updateAllocationRuleSchema } from "../schema/account.schema";

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

router.patch(
    "/accounts/:accountId/utilization-threshold",
    validate(customizeUtilizationThresholdSchema),
    customizeUtilizationThresholdHandler
);

export default router;