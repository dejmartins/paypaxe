import express from 'express';
import config from '../config/default';
import connect from './utils/connect';

const port: number = config.port;
const app = express();

app.listen(port, async () => {
    console.log("App is running")

    await connect()
})