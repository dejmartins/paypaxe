import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { validateAccountTypeAndPlan, validateSubscription } from "../../../shared/middlewares/validateAccount";
import { logSavingsHandler } from "../controller/logSavings.controller";
import { logSavingsSchema } from "../schema/logSavings.schema";

const router = Router();

router.post(
    '/accounts/:accountId/goals/:goalId/savings',
    // validateSubscription,
    // validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(logSavingsSchema),
    logSavingsHandler
);

export default router;
