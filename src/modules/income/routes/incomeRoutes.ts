import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addIncomeSchema, getTotalIncomeSchema } from "../schema/income.schema";
import { addIncomeHandler, getTotalIncomeHandler } from "../controller/income.controller";

const router = Router();

router.post('/accounts/:accountId/incomes', validate(addIncomeSchema), addIncomeHandler);
router.get('/accounts/:accountId/incomes/total', validate(getTotalIncomeSchema), getTotalIncomeHandler);

export default router;
