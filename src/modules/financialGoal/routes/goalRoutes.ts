import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addFinancialGoalSchema, getGoalsSchema, updateFinancialGoalSchema } from "../schema/financialGoal.schema";
import { addGoalHandler, getGoalsHandler, updateGoalHandler } from "../controller/financialGoal.controller";
import { validateAccountTypeAndPlan } from "../../../shared/middlewares/validateAccount";

const router = Router();

router.post(
    '/accounts/:accountId/goals', 
    validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(addFinancialGoalSchema), 
    addGoalHandler
);

router.get(
    '/accounts/:accountId/goals',
    validateAccountTypeAndPlan(['individual'], 'basic'), 
    validate(getGoalsSchema), 
    getGoalsHandler
);

router.put(
    '/accounts/:accountId/goals/:goalId',
    validateAccountTypeAndPlan(['individual'], 'basic'), 
    validate(updateFinancialGoalSchema), 
    updateGoalHandler
);


export default router;
