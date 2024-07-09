import express from 'express';
import config from '../config/default';
import connect from './shared/utils/connect';
import log from './shared/utils/logger';
import routes from './routes';

const port: number = config.port;
const app = express();

app.listen(port, async () => {
    log.info(`App is running at http://localhost:${port}`)

    await connect()

    routes(app);
})