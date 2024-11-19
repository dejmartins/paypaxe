import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addFinancialGoalSchema, getGoalsSchema, updateFinancialGoalSchema } from "../schema/financialGoal.schema";
import { validateAccountTypeAndPlan, validateSubscription } from "../../../shared/middlewares/validateAccount";
import { createFinancialGoalHandler, getFinancialGoalHandler } from "../controller/financialGoal.controller";

const router = Router();

router.post(
    '/accounts/:accountId/goals',
    validateSubscription, 
    validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(addFinancialGoalSchema), 
    createFinancialGoalHandler
);

router.get(
    '/accounts/:accountId/goals',
    validateSubscription,
    validateAccountTypeAndPlan(['individual'], 'basic'), 
    validate(getGoalsSchema), 
    getFinancialGoalHandler
);

// router.put(
//     '/accounts/:accountId/goals/:goalId',
//     validateSubscription,
//     validateAccountTypeAndPlan(['individual'], 'basic'), 
//     validate(updateFinancialGoalSchema), 
//     updateGoalHandler
// );


export default router;
