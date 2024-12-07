import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { activateBudgetHandler, getActiveBudgetHandler } from "../controller/budget.controller";
import { activateBudgetSchema, getActiveBudgetSchema } from "../schema/budget.schema";

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

export default router;
