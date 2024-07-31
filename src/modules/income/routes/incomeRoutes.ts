import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addIncomeSchema } from "../schema/income.schema";
import { addIncomeHandler } from "../controller/income.controller";

const router = Router();

router.post('/accounts/:accountId/incomes', validate(addIncomeSchema), addIncomeHandler);

export default router;
