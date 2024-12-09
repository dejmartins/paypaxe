import { object, string } from "zod";
import { objectIdValidator } from "../../../shared/utils/validator";

export const optInCreditBuilderSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
});

export const optOutCreditBuilderSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
});