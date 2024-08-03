import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addExpenseSchema } from "../schema/expense.schema";
import { addExpenseHandler } from "../controller/expense.controller";

const router = Router();

router.post('/accounts/:accountId/expenses', validate(addExpenseSchema), addExpenseHandler);

export default router;
