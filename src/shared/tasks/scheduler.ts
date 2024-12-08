import cron from 'node-cron';
import { checkGoalsForNotifications } from '../../modules/notification/service/goal.notification';
import log from '../utils/logger';
import { handleRecurringExpenses } from '../../modules/expense/service/expense.service';
import { incrementProgressForActiveGoals } from '../../modules/financialGoal/service/financialGoal.service';
import { deactivateMonthlyBudgets } from '../../modules/budget/service/budget.service';

cron.schedule('0 0 * * *', async () => {
    await checkGoalsForNotifications();
});

cron.schedule('0 0 * * *', () => {
    handleRecurringExpenses();
});

cron.schedule("* * * * *", async () => {
    await incrementProgressForActiveGoals();
});

cron.schedule("59 23 28-31 * *", async () => {
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    if (now.getDate() === lastDayOfMonth) {
        try {
            log.info("Running monthly budget deactivation cron job.");
            await deactivateMonthlyBudgets();
        } catch (error) {
            log.error("Failed to run budget deactivation cron job:", error);
        }
    }
});

log.info('Scheduler setup complete');
