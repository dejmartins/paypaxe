import cron from 'node-cron';
import { checkGoalsForNotifications } from '../../modules/notification/service/goal.notification';
import log from '../utils/logger';
import { handleRecurringExpenses } from '../../modules/expense/service/expense.service';

cron.schedule('0 0 * * *', async () => {
    await checkGoalsForNotifications();
});

cron.schedule('0 0 * * *', () => {
    handleRecurringExpenses();
});

log.info('Scheduler setup complete');
