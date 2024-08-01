import { AppError } from "./customErrors";

type TimeFrame = {
    startDate: string,
    endDate: string
}

export const getTimeFrame = (timePeriod: string, startDate?: string, endDate?: string): TimeFrame => {
    const now = new Date();
    let start, end;

    switch (timePeriod) {
        case 'thisWeek':
            const currentDay = now.getDay();
            const startOfWeek = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
            start = new Date(now.setDate(startOfWeek));
            end = new Date();
            end.setHours(23, 59, 59, 999);
            break;
        case 'lastWeek':
            const lastWeekDay = now.getDay();
            const startOfLastWeek = now.getDate() - lastWeekDay - 6;
            const endOfLastWeek = startOfLastWeek + 6;
            start = new Date(now.setDate(startOfLastWeek));
            end = new Date(now.setDate(endOfLastWeek));
            end.setHours(23, 59, 59, 999);
            break;
        case 'thisMonth':
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date();
            end.setHours(23, 59, 59, 999);
            break;
        case 'lastMonth':
            start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
            break;
        case 'lastTwoMonths':
            start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
            end = new Date();
            end.setHours(23, 59, 59, 999);
            break;
        case 'custom':
            if (!startDate || !endDate) {
                throw new AppError('Start date and end date must be provided for custom time period', 400);
            }
            start = new Date(startDate);
            end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            break;
        default:
            throw new AppError('Invalid time period', 400);
    }

    return { startDate: start.toISOString(), endDate: end.toISOString() };
};