export interface LogActivityInput {
    entityType: string;
    entityId: string | any;
    accountId: string;
    action: string;
    details: string;
    userId?: string;
}

export interface FetchActivityLogsInput {
    entityType?: string;
    entityId?: string;
    accountId: string;
    page: number;
    limit: number;
}