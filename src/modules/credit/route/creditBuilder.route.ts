import { Router } from "express";
import { optInCreditBuilderHandler, optOutCreditBuilderHandler } from "../controller/creditBuilder.controller";
import validate from "../../../shared/middlewares/validateResource";
import { optInCreditBuilderSchema, optOutCreditBuilderSchema } from "../schema/creditBuilder.schema";

const router = Router();

router.post(
    "/accounts/:accountId/credit-builder/opt-in",
    validate(optInCreditBuilderSchema),
    optInCreditBuilderHandler
);

router.post(
    "/accounts/:accountId/credit-builder/opt-out",
    validate(optOutCreditBuilderSchema),
    optOutCreditBuilderHandler
);

export default router;
