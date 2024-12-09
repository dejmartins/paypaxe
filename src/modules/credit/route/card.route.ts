import { Router } from "express";
import { addCardHandler } from "../controller/card.controller";
import validate from "../../../shared/middlewares/validateResource";
import { addCardSchema } from "../schema/card.schema";

const router = Router();

router.post(
    "/accounts/:accountId/cards",
    validate(addCardSchema),
    addCardHandler
);

export default router;
