import { object, string, number, optional, union, literal } from "zod";
import { objectIdValidator } from "../../../shared/utils/validator";

export const getActivityLogsSchema = object({
    params: object({
        entityId: objectIdValidator,
    }),
    query: object({
        accountId: objectIdValidator,
        entityType: optional(union([
            literal("financialGoal"),
            literal("account"),
            literal("expense"),
            literal("income"),
            literal("card"),
            literal("other"),
        ])),
        limit: optional(
            string().refine((value) => !isNaN(parseInt(value)), {
                message: "Limit must be a valid number",
            }).transform((value) => parseInt(value))
        ),
        page: optional(
            string().refine((value) => !isNaN(parseInt(value)), {
                message: "Page must be a valid number",
            }).transform((value) => parseInt(value))
        ),
    }),
});
