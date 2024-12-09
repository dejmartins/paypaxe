import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { addCard, deleteCard, editCard, getAllCards, getCard } from "../service/card.service";
import { successResponse } from "../../../shared/utils/response";
import { AddCardInput } from "../types/cardTypes";

export const addCardHandler = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { creditInstitution, creditLimit, utilizationAmount, paymentDueDate } = req.body;

    const card = await addCard({
        accountId,
        creditInstitution,
        creditLimit,
        utilizationAmount,
        paymentDueDate,
    } as AddCardInput);

    return res.json(successResponse(card, "Card added successfully"));
});

export const getAllCardsHandler = asyncHandler( async (req: Request, res: Response) => {
        const { accountId } = req.params;

        const cards = await getAllCards({ accountId });

        return res.json(successResponse(cards, "Cards retrieved successfully"));
    }
);

export const getCardHandler = asyncHandler(async (req: Request, res: Response) => {
        const { accountId, cardId } = req.params;

        const card = await getCard({ accountId, cardId });

        return res.json(successResponse(card, "Card retrieved successfully"));
    }
);

export const editCardHandler = asyncHandler(async (req: Request, res: Response) => {
        const { accountId, cardId } = req.params;
        const updateFields = req.body;

        const updatedCard = await editCard({ accountId, cardId, ...updateFields });

        return res.json(successResponse(updatedCard, "Card updated successfully"));
    }
);

export const deleteCardHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { accountId, cardId } = req.params;

        const deletedCard = await deleteCard({ accountId, cardId });

        return res.json(successResponse(deletedCard, "Card deleted successfully"));
    }
);
