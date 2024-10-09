import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addExpenseSchema, getRecentExpensesSchema, getTotalExpenseSchema } from "../schema/expense.schema";
import { addExpenseHandler, getDeletedExpensesHandler, getRecentExpensesHandler, getTotalExpenseHandler, softDeleteExpenseHandler } from "../controller/expense.controller";
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
    '/accounts/:accountId/expenses/:expenseId',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'),
    // validate(getRecentExpensesSchema), 
    softDeleteExpenseHandler
);

router.get(
    '/accounts/:accountId/expenses/deleted',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'),
    // validate(getRecentExpensesSchema), 
    getDeletedExpensesHandler
);

export default router;
