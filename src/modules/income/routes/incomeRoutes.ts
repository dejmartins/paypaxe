import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addIncomeSchema, exportIncomeSchema, getDeletedIncomesSchema, getRecentIncomesSchema, getTotalIncomeSchema, incomeBreakdownSchema, softDeleteIncomeSchema, updateIncomeSchema } from "../schema/income.schema";
import { addIncomeHandler, exportIncomeHandler, getDeletedIncomesHandler, getIncomeBreakdownHandler, getRecentIncomesHandler, getTotalIncomeHandler, softDeleteIncomeHandler, updateIncomeHandler } from "../controller/income.controller";
import { validateAccountTypeAndPlan, validateSubscription } from "../../../shared/middlewares/validateAccount";

const router = Router();

router.post(
    '/accounts/:accountId/incomes', 
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], ['basic', 'premium']),
    validate(addIncomeSchema), 
    addIncomeHandler
);

router.get(
    '/accounts/:accountId/incomes/total',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], ['basic', 'premium']), 
    validate(getTotalIncomeSchema), 
    getTotalIncomeHandler
);

router.get(
    '/accounts/:accountId/incomes/recent',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], ['basic', 'premium']), 
    validate(getRecentIncomesSchema), 
    getRecentIncomesHandler
);

router.patch(
    '/accounts/:accountId/incomes/:incomeId/soft-delete',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], ['basic', 'premium']),
    validate(softDeleteIncomeSchema), 
    softDeleteIncomeHandler
);

router.get(
    '/accounts/:accountId/incomes/deleted',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], ['basic', 'premium']),
    validate(getDeletedIncomesSchema),
    getDeletedIncomesHandler
);

router.patch(
    '/accounts/:accountId/incomes/:incomeId',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], ['basic', 'premium']),
    validate(updateIncomeSchema), 
    updateIncomeHandler
);

router.get(
    '/accounts/:accountId/incomes/export',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], ['basic', 'premium']),
    validate(exportIncomeSchema),
    exportIncomeHandler
);

router.get(
    '/accounts/:accountId/breakdown',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], ['basic', 'premium']),
    validate(incomeBreakdownSchema),
    getIncomeBreakdownHandler
);

export default router;
