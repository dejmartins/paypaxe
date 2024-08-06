import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addFinancialGoalSchema, getGoalsSchema, updateFinancialGoalSchema } from "../schema/financialGoal.schema";
import { addGoalHandler, getGoalsHandler, updateGoalHandler } from "../controller/financialGoal.controller";

const router = Router();

router.post('/accounts/:accountId/goals', validate(addFinancialGoalSchema), addGoalHandler);
router.get('/accounts/:accountId/goals', validate(getGoalsSchema), getGoalsHandler);
router.put('/accounts/:accountId/goals/:goalId', validate(updateFinancialGoalSchema), updateGoalHandler);


export default router;
