import { number, object, string, TypeOf, union } from "zod";
import { objectIdValidator } from "../../../shared/utils/validator";

export const addFinancialGoalSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    body: object({
        title: string({
            required_error: 'Title is required'
        }),
        description: string({
            required_error: 'Description is required'
        }),
        targetAmount: union([number(), string()])
            .refine(value => !isNaN(parseFloat(value as string)), {
                message: 'Must be a valid decimal number',
            })
            .transform(value => parseFloat(value as string))
            .refine(value => value > 0, {
                message: 'Target amount must be greater than zero'
            }),
        currentProgress: union([number(), string()])
            .refine(value => !isNaN(parseFloat(value as string)), {
                message: 'Must be a valid decimal number',
            })
            .transform(value => parseFloat(value as string))
            .refine(value => value >= 0, {
                message: 'Current progress must be greater than or equal to zero'
            }),
        deadline: string({
            required_error: 'Deadline is required'
        }).refine(date => {
            const parsedDate = new Date(date);
            const currentDate = new Date();
            return parsedDate >= currentDate;
        }, {
            message: 'Deadline cannot be in the past'
        }),
        type: string().optional()
    })
});

export const getGoalsSchema = object({
    params: object({
        accountId: objectIdValidator,
    }),
    query: object({
        limit: string().refine(value => !isNaN(parseInt(value)), {
            message: 'Limit must be a valid number',
        }).transform(value => parseInt(value)),
        page: string().refine(value => !isNaN(parseInt(value)), {
            message: 'Page must be a valid number',
        }).transform(value => parseInt(value)),
    })
});

export type AddGoalInput = TypeOf<typeof addFinancialGoalSchema>;
