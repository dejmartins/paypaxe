import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addExpenseSchema, getRecentExpensesSchema, getTotalExpenseSchema } from "../schema/expense.schema";
import { addExpenseHandler, getRecentExpensesHandler, getTotalExpenseHandler } from "../controller/expense.controller";

const router = Router();

router.post('/accounts/:accountId/expenses', validate(addExpenseSchema), addExpenseHandler);
router.get('/accounts/:accountId/expenses/total', validate(getTotalExpenseSchema), getTotalExpenseHandler);
router.get('/accounts/:accountId/expenses/recent', validate(getRecentExpensesSchema), getRecentExpensesHandler);

export default router;
