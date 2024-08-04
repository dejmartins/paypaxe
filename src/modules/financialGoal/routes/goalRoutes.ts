import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addFinancialGoalSchema, getGoalsSchema } from "../schema/financialGoal.schema";
import { addGoalHandler, getGoalsHandler } from "../controller/financialGoal.controller";

const router = Router();

router.post('/accounts/:accountId/goals', validate(addFinancialGoalSchema), addGoalHandler);
router.get('/accounts/:accountId/goals', validate(getGoalsSchema), getGoalsHandler);


export default router;
