import CardModel from "../model/card.model";
import { AddCardInput, GetAllCardsInput } from "../types/cardTypes";
import { AppError } from "../../../shared/utils/customErrors";
import log from "../../../shared/utils/logger";
import { findOne } from "./creditBuilder.service";

export async function addCard(input: AddCardInput) {
    try {
        const { accountId, creditInstitution, creditLimit, utilizationAmount, paymentDueDate } = input;
    
        const creditBuilder = await findOne(accountId);
        if (!creditBuilder) {
            throw new AppError("Credit Builder is not active for this account", 400);
        }
    
        const card = await CardModel.create({
            account: accountId,
            creditInstitution,
            creditLimit,
            utilizationAmount,
            paymentDueDate,
        });
    
        creditBuilder.aggregateCreditLimit += creditLimit;
        creditBuilder.aggregateUtilization += utilizationAmount;
        creditBuilder.activeCards.push(card._id);
    
        await creditBuilder.save();
    
        log.info(`Card added successfully for account ID: ${accountId}`);
    
        return card;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}

export async function getAllCards(input: GetAllCardsInput) {
    const { accountId } = input;

    try {
        const cards = await CardModel.find({ account: accountId });

        if (!cards.length) {
            throw new AppError("No cards found for this account.", 404);
        }

        return cards;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}
