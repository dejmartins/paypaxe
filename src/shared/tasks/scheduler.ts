import cron from 'node-cron';
import { checkGoalsForNotifications } from '../../modules/notification/service/goal.notification';
import log from '../utils/logger';

cron.schedule('0 0 * * *', async () => {
    await checkGoalsForNotifications();
});

log.info('Scheduler setup complete');
