import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { activateBudgetHandler, customizeBudgetAmountHandler, getActiveBudgetHandler } from "../controller/budget.controller";
import { activateBudgetSchema, customizeBudgetSchema, getActiveBudgetSchema } from "../schema/budget.schema";

const router = Router();

router.post(
    "/accounts/:accountId/budget/activate",
    validate(activateBudgetSchema),
    activateBudgetHandler
);

router.get(
    "/accounts/:accountId/budget/active",
    validate(getActiveBudgetSchema),
    getActiveBudgetHandler
);

router.put(
    "/accounts/:accountId/budget/customize",
    validate(customizeBudgetSchema),
    customizeBudgetAmountHandler
);


export default router;
