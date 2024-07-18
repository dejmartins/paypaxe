import express from 'express';
import config from '../config/default';
import connect from './shared/utils/connect';
import log from './shared/utils/logger';
import deserializeUser from './shared/middlewares/deserializeUser';
import userRoutes from './modules/user/routes/userRoutes';
import accountRoutes from './modules/account/routes/accountRoutes';
import sessionRoutes from './modules/session/routes/sessionRoutes';
import authRoutes from './modules/auth/routes/authRoutes';
import passport from './modules/auth/strategy/google.strategy';

const port: number = config.port;

const app = express();

app.use(express.json())
app.use(deserializeUser);
app.use(passport.initialize());

app.use('/api', userRoutes)
app.use('/api', accountRoutes)
app.use('/api', sessionRoutes)
app.use('/api/auth', authRoutes)

app.listen(port, async () => {
    log.info(`App is running at http://localhost:${port}`)

    await connect()
})