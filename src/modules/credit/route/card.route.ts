import { Router } from "express";
import { addCardHandler, editCardHandler, getAllCardsHandler, getCardHandler } from "../controller/card.controller";
import validate from "../../../shared/middlewares/validateResource";
import { addCardSchema, editCardSchema, getAllCardsSchema, getCardSchema } from "../schema/card.schema";

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

router.get(
    "/accounts/:accountId/cards/:cardId",
    validate(getCardSchema),
    getCardHandler
);

router.put(
    "/accounts/:accountId/cards/:cardId",
    validate(editCardSchema),
    editCardHandler
);

export default router;
