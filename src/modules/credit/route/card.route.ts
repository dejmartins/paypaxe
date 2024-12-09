import { Router } from "express";
import { addCardHandler, getAllCardsHandler } from "../controller/card.controller";
import validate from "../../../shared/middlewares/validateResource";
import { addCardSchema, getAllCardsSchema } from "../schema/card.schema";

const router = Router();

router.post(
    "/accounts/:accountId/cards",
    validate(addCardSchema),
    addCardHandler
);

router.get(
    "/accounts/:accountId/cards",
    validate(getAllCardsSchema),
    getAllCardsHandler
);

export default router;
