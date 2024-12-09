import CardModel from "../model/card.model";
import { AddCardInput, DeleteCardInput, EditCardInput, GetAllCardsInput, GetCardInput } from "../types/cardTypes";
import { AppError } from "../../../shared/utils/customErrors";
import log from "../../../shared/utils/logger";
import { findOne, updateCreditBuilderAfterCardDeletion } from "./creditBuilder.service";
import { logActivity } from "../../activityLog/service/activityLog.service";

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

        await logActivity({
            entityId: card._id,
            accountId,
            entityType: "card",
            action: "add",
            details: `Card added for '${creditInstitution}' with a credit limit of ${creditLimit}.`,
        });
    
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

export async function getCard(input: GetCardInput) {
    const { accountId, cardId } = input;

    try {
        const card = await CardModel.findOne({ _id: cardId, account: accountId });

        if (!card) {
            throw new AppError("Card not found for this account.", 404);
        }

        return card;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}

export async function editCard(input: EditCardInput) {
    const { accountId, cardId, ...updateFields } = input;

    try {
        const card = await CardModel.findOneAndUpdate(
            { _id: cardId, account: accountId },
            { $set: updateFields },
            { new: true }
        );

        if (!card) {
            throw new AppError("Card not found or update failed.", 404);
        }

        await logActivity({
            entityId: cardId,
            accountId,
            entityType: "card",
            action: "edit",
            details: `Card updated for card ID '${cardId}'.`,
        });

        return card;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}

export async function deleteCard(input: DeleteCardInput) {
    const { accountId, cardId } = input;

    try {
        const card = await CardModel.findOneAndDelete({ _id: cardId, account: accountId });

        if (!card) {
            throw new AppError("Card not found or deletion failed.", 404);
        }

        await updateCreditBuilderAfterCardDeletion(
            accountId,
            cardId,
            card.creditLimit || 0,
            card.utilizationAmount || 0
        );

        await logActivity({
            entityId: cardId,
            accountId,
            entityType: "card",
            action: "delete",
            details: `Card with ID '${cardId}' deleted. Credit limit was ${card.creditLimit}.`,
        });

        return card;
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode || 500);
    }
}
