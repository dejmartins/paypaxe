import express from 'express';
import deserializeUser from '../middlewares/deserializeUser';
import userRoutes from '../../modules/user/routes/userRoutes';
import accountRoutes from '../../modules/account/routes/accountRoutes';
import sessionRoutes from '../../modules/session/routes/sessionRoutes';
import incomeRoutes from '../../modules/income/routes/incomeRoutes';
import expenseRoutes from '../../modules/expense/route/expenseRoutes';
import authRoutes from '../../modules/auth/routes/authRoutes';
import passport from '../../modules/auth/strategy/google.strategy';
import { generalLimiter } from '../middlewares/rateLimiter';

function createServer() {
    const app = express();
    
    app.use(express.json());
    
    app.use(deserializeUser);

    app.use(passport.initialize());

    app.use('/api', generalLimiter)
    app.use('/api', userRoutes)
    app.use('/api', sessionRoutes)
    app.use('/api', accountRoutes)
    app.use('/api', expenseRoutes)
    app.use('/api', incomeRoutes)
    app.use('/api/auth', authRoutes)

    return app;
}

export default createServer;