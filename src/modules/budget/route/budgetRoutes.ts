import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { activateBudgetHandler, customizeBudgetAmountHandler, getActiveBudgetHandler } from "../controller/budget.controller";
import { activateBudgetSchema, customizeBudgetSchema, getActiveBudgetSchema } from "../schema/budget.schema";
import { validateAccountTypeAndPlan, validateSubscription } from "../../../shared/middlewares/validateAccount";

const router = Router();

router.post(
    "/accounts/:accountId/budget/activate",
    validate(activateBudgetSchema),
    validateSubscription, 
    validateAccountTypeAndPlan(['individual'], ['basic', 'premium']),
    activateBudgetHandler
);

router.get(
    "/accounts/:accountId/budget/active",
    validate(getActiveBudgetSchema),
    validateSubscription, 
    validateAccountTypeAndPlan(['individual'], ['basic', 'premium']),
    getActiveBudgetHandler
);

router.put(
    "/accounts/:accountId/budget/customize",
    validate(customizeBudgetSchema),
    validateSubscription, 
    validateAccountTypeAndPlan(['individual'], ['basic', 'premium']),
    customizeBudgetAmountHandler
);


export default router;
