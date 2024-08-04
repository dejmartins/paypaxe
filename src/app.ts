import config from '../config/default';
import connect from './shared/utils/connect';
import log from './shared/utils/logger';
import errorHandler from './shared/middlewares/errorHandler';
import createServer from './shared/utils/server';
import '../src/shared/tasks/scheduler'

const port: number = config.port;

const app = createServer();

app.use(errorHandler)

app.listen(port, async () => {
    log.info(`App is running at http://localhost:${port}`)

    await connect()
})