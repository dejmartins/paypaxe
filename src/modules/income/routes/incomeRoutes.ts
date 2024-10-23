import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addIncomeSchema, exportIncomeSchema, getDeletedIncomesSchema, getRecentIncomesSchema, getTotalIncomeSchema, softDeleteIncomeSchema, updateIncomeSchema } from "../schema/income.schema";
import { addIncomeHandler, exportIncomeHandler, getDeletedIncomesHandler, getRecentIncomesHandler, getTotalIncomeHandler, softDeleteIncomeHandler, updateIncomeHandler } from "../controller/income.controller";
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

router.patch(
    '/accounts/:accountId/incomes/:incomeId/soft-delete',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(softDeleteIncomeSchema), 
    softDeleteIncomeHandler
);

router.get(
    '/accounts/:accountId/incomes/deleted',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(getDeletedIncomesSchema),
    getDeletedIncomesHandler
);

router.patch(
    '/accounts/:accountId/incomes/:incomeId',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(updateIncomeSchema), 
    updateIncomeHandler
);

router.get(
    '/accounts/:accountId/incomes/export',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(exportIncomeSchema),
    exportIncomeHandler
);

export default router;
