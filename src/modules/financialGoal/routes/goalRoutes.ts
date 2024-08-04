import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addFinancialGoalSchema } from "../schema/financialGoal.schema";

const router = Router();

router.post('/accounts/:accountId/goals', validate(addFinancialGoalSchema));

export default router;
