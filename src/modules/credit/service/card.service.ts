import CardModel from "../model/card.model";
import { AddCardInput } from "../types/cardTypes";
import { AppError } from "../../../shared/utils/customErrors";
import log from "../../../shared/utils/logger";
import { findOne } from "./creditBuilder.service";

export async function addCard(input: AddCardInput) {
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
}
