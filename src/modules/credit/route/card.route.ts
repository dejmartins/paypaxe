import { Router } from "express";
import { addCardHandler, deleteCardHandler, editCardHandler, getAllCardsHandler, getCardHandler } from "../controller/card.controller";
import validate from "../../../shared/middlewares/validateResource";
import { addCardSchema, deleteCardSchema, editCardSchema, getAllCardsSchema, getCardSchema } from "../schema/card.schema";

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

router.delete(
    "/accounts/:accountId/cards/:cardId",
    validate(deleteCardSchema),
    deleteCardHandler
);

export default router;
