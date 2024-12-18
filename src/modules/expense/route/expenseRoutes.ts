import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addExpenseSchema, expenseBreakdownSchema, exportExpenseSchema, getDeletedExpensesSchema, getRecentExpensesSchema, getTotalExpenseSchema, softDeleteExpenseSchema, updateExpenseSchema } from "../schema/expense.schema";
import { addExpenseHandler, exportExpenseHandler, getDeletedExpensesHandler, getExpenseBreakdownHandler, getRecentExpensesHandler, getTotalExpenseHandler, softDeleteExpenseHandler, updateExpenseHandler } from "../controller/expense.controller";
import { validateAccountTypeAndPlan, validateSubscription } from "../../../shared/middlewares/validateAccount";

const router = Router();

router.post(
    '/accounts/:accountId/expenses',
    // validateSubscription,
    // validateAccountTypeAndPlan(['individual', 'family'], 'basic'),
    validate(addExpenseSchema), 
    addExpenseHandler
);

router.get(
    '/accounts/:accountId/expenses/total',
    // validateSubscription,
    // validateAccountTypeAndPlan(['individual', 'family'], 'basic'),
    validate(getTotalExpenseSchema), 
    getTotalExpenseHandler
);

router.get(
    '/accounts/:accountId/expenses/recent',
    // validateSubscription,
    // validateAccountTypeAndPlan(['individual', 'family'], 'basic'),
    validate(getRecentExpensesSchema), 
    getRecentExpensesHandler
);

router.patch(
    '/accounts/:accountId/expenses/:expenseId/soft-delete',
    // validateSubscription,
    // validateAccountTypeAndPlan(['individual', 'family'], 'basic'),
    validate(softDeleteExpenseSchema), 
    softDeleteExpenseHandler
);

router.get(
    '/accounts/:accountId/expenses/deleted',
    // validateSubscription,
    // validateAccountTypeAndPlan(['individual', 'family'], 'basic'),
    validate(getDeletedExpensesSchema), 
    getDeletedExpensesHandler
);

router.patch(
    '/accounts/:accountId/expenses/:expenseId',
    // validateSubscription,
    // validateAccountTypeAndPlan(['individual', 'family'], 'basic'),
    validate(updateExpenseSchema), 
    updateExpenseHandler
);

router.get(
    '/accounts/:accountId/expenses/export',
    // validateSubscription,
    // validateAccountTypeAndPlan(['individual', 'family'], 'basic'),
    validate(exportExpenseSchema),
    exportExpenseHandler
);

router.get(
    "/accounts/:accountId/expense-breakdown",
    validate(expenseBreakdownSchema),
    getExpenseBreakdownHandler
);

export default router;
