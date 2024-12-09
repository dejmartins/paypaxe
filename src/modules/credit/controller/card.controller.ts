import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { addCard, getAllCards } from "../service/card.service";
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
