import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addIncomeSchema, getRecentIncomesSchema, getTotalIncomeSchema } from "../schema/income.schema";
import { addIncomeHandler, getRecentIncomesHandler, getTotalIncomeHandler } from "../controller/income.controller";
import { validateAccountTypeAndPlan, validateSubscription } from "../../../shared/middlewares/validateAccount";

const router = Router();

router.post(
    '/accounts/:accountId/incomes', 
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(addIncomeSchema), 
    addIncomeHandler
);

router.get(
    '/accounts/:accountId/incomes/total',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'), 
    validate(getTotalIncomeSchema), 
    getTotalIncomeHandler
);

router.get(
    '/accounts/:accountId/incomes/recent',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'), 
    validate(getRecentIncomesSchema), 
    getRecentIncomesHandler
);

export default router;
