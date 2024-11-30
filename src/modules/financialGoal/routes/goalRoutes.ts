import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { addFinancialGoalSchema, calculateSavingsSchema, deleteFinancialGoalSchema, getGoalByIdSchema, getGoalsSchema, getTotalCurrentProgressSchema, transferFromNetBalanceSchema, transferFundsSchema, updateFinancialGoalSchema, updatePauseStatusSchema } from "../schema/financialGoal.schema";
import { validateAccountTypeAndPlan, validateSubscription } from "../../../shared/middlewares/validateAccount";
import { calculateSavingsAmountHandler, createFinancialGoalHandler, getFinancialGoalsHandler, getFinancialGoalHandler, getTotalCurrentProgressHandler, updateGoalHandler, deleteFinancialGoalHandler, transferFundsHandler, updatePauseStatusHandler, transferFromNetBalanceHandler } from "../controller/financialGoal.controller";

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
    getFinancialGoalsHandler
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
    getFinancialGoalHandler
);

router.post(
    "/accounts/:accountId/goals/calculate",
    validate(calculateSavingsSchema),
    calculateSavingsAmountHandler
);

router.put(
    '/accounts/:accountId/goals/:goalId',
    // validateSubscription,
    // validateAccountTypeAndPlan(['individual'], 'basic'), 
    validate(updateFinancialGoalSchema), 
    updateGoalHandler
);

router.patch(
    "/accounts/:accountId/goals/:goalId/delete",
    // validateSubscription,
    // validateAccountTypeAndPlan(["individual"], "basic"),
    validate(deleteFinancialGoalSchema),
    deleteFinancialGoalHandler
);

router.post(
    "/accounts/:accountId/goals/transfer",
    validate(transferFundsSchema),
    transferFundsHandler
);

router.post(
    "/accounts/:accountId/goals/:goalId/transfer-from-net-balance",
    validate(transferFromNetBalanceSchema),
    transferFromNetBalanceHandler
);

router.patch(
    '/accounts/:accountId/goals/:goalId/pause-status',
    // validateSubscription,
    // validateAccountTypeAndPlan(['individual'], 'basic'),
    validate(updatePauseStatusSchema),
    updatePauseStatusHandler
);


export default router;
