import { Router } from "express";
import validate from "../../../shared/middlewares/validateResource";
import { activateBudgetHandler } from "../controller/budget.controller";
import { activateBudgetSchema } from "../schema/budget.schema";

const router = Router();

router.post(
    "/accounts/:accountId/budget/activate",
    validate(activateBudgetSchema),
    activateBudgetHandler
);

export default router;
