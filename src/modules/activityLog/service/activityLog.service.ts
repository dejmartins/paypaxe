import ActivityLogModel, { IActivityLog } from "../model/activityLog.model";
import { AppError } from "../../../shared/utils/customErrors";
import { FetchActivityLogsInput, LogActivityInput } from "../types/activityLogTypes";

export async function logActivity(input: LogActivityInput): Promise<IActivityLog> {
    try {
        const log = await ActivityLogModel.create(input);
        return log;
    } catch (error: any) {
        throw new AppError(error.message, error.statusCode || 500);
    }
}

export async function fetchActivityLogs(input: FetchActivityLogsInput) {
    try {
        const query: any = { accountId: input.accountId };

        if (input.entityType) {
            query.entityType = input.entityType;
        }
        if (input.entityId) {
            query.entityId = input.entityId;
        }

        const logs = await ActivityLogModel.find(query)
            .sort({ timestamp: -1 })
            .skip((input.page - 1) * input.limit)
            .limit(input.limit);

        const totalLogs = await ActivityLogModel.countDocuments(query);

        return {
            logs,
            totalLogs,
            totalPages: Math.ceil(totalLogs / input.limit),
            currentPage: input.page,
        };
    } catch (error: any) {
        throw new AppError(error.message, error.statusCode || 500);
    }
}