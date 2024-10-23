import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addExpenseSchema, exportExpenseSchema, getDeletedExpensesSchema, getRecentExpensesSchema, getTotalExpenseSchema, softDeleteExpenseSchema, updateExpenseSchema } from "../schema/expense.schema";
import { addExpenseHandler, exportExpenseHandler, getDeletedExpensesHandler, getRecentExpensesHandler, getTotalExpenseHandler, softDeleteExpenseHandler, updateExpenseHandler } from "../controller/expense.controller";
import { validateAccountTypeAndPlan, validateSubscription } from "../../../shared/middlewares/validateAccount";

const router = Router();

router.post(
    '/accounts/:accountId/expenses',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(addExpenseSchema), 
    addExpenseHandler
);

router.get(
    '/accounts/:accountId/expenses/total',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(getTotalExpenseSchema), 
    getTotalExpenseHandler
);

router.get(
    '/accounts/:accountId/expenses/recent',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(getRecentExpensesSchema), 
    getRecentExpensesHandler
);

router.patch(
    '/accounts/:accountId/expenses/:expenseId/soft-delete',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(softDeleteExpenseSchema), 
    softDeleteExpenseHandler
);

router.get(
    '/accounts/:accountId/expenses/deleted',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(getDeletedExpensesSchema), 
    getDeletedExpensesHandler
);

router.patch(
    '/accounts/:accountId/expenses/:expenseId',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(updateExpenseSchema), 
    updateExpenseHandler
);

router.get(
    '/accounts/:accountId/expenses/export',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(exportExpenseSchema),
    exportExpenseHandler
);

export default router;
