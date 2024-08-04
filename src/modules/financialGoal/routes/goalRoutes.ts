import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addFinancialGoalSchema } from "../schema/financialGoal.schema";
import { addGoalHandler } from "../controller/financialGoal.controller";

const router = Router();

router.post('/accounts/:accountId/goals', validate(addFinancialGoalSchema), addGoalHandler);

export default router;
