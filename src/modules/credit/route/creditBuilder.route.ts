import { Router } from "express";
import { checkOptInStatusHandler, optInCreditBuilderHandler, optOutCreditBuilderHandler } from "../controller/creditBuilder.controller";
import validate from "../../../shared/middlewares/validateResource";
import { checkOptInStatusSchema, optInCreditBuilderSchema, optOutCreditBuilderSchema } from "../schema/creditBuilder.schema";

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

router.get(
    "/accounts/:accountId/credit-builder/status",
    validate(checkOptInStatusSchema),
    checkOptInStatusHandler
);

export default router;
