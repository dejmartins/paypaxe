import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addFinancialGoalSchema, getGoalByIdSchema, getGoalsSchema, getTotalCurrentProgressSchema, updateFinancialGoalSchema } from "../schema/financialGoal.schema";
import { validateAccountTypeAndPlan, validateSubscription } from "../../../shared/middlewares/validateAccount";
import { createFinancialGoalHandler, getFinancialGoalByIdHandler, getFinancialGoalHandler, getTotalCurrentProgressHandler } from "../controller/financialGoal.controller";

const router = Router();

router.post(
    '/accounts/:accountId/goals',
    // validateSubscription, 
    // validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(addFinancialGoalSchema), 
    createFinancialGoalHandler
);

router.get(
    '/accounts/:accountId/goals',
    // validateSubscription,
    // validateAccountTypeAndPlan(['individual'], 'basic'), 
    validate(getGoalsSchema), 
    getFinancialGoalHandler
);

router.get(
    "/accounts/:accountId/goals/total-progress",
    // validateSubscription,
    // validateAccountTypeAndPlan(["individual"], "basic"),
    validate(getTotalCurrentProgressSchema),
    getTotalCurrentProgressHandler
);

router.get(
    '/accounts/:accountId/goals/:goalId',
    // validateSubscription,
    // validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(getGoalByIdSchema),
    getFinancialGoalByIdHandler
);

// router.put(
//     '/accounts/:accountId/goals/:goalId',
//     validateSubscription,
//     validateAccountTypeAndPlan(['individual'], 'basic'), 
//     validate(updateFinancialGoalSchema), 
//     updateGoalHandler
// );


export default router;
