import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addIncomeSchema, getRecentIncomesSchema, getTotalIncomeSchema } from "../schema/income.schema";
import { addIncomeHandler, getRecentIncomesHandler, getTotalIncomeHandler } from "../controller/income.controller";

const router = Router();

router.post('/accounts/:accountId/incomes', validate(addIncomeSchema), addIncomeHandler);
router.get('/accounts/:accountId/incomes/total', validate(getTotalIncomeSchema), getTotalIncomeHandler);
router.get('/accounts/:accountId/incomes/recent', validate(getRecentIncomesSchema), getRecentIncomesHandler);

export default router;
