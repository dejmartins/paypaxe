import express from 'express';
import deserializeUser from '../middlewares/deserializeUser';
import userRoutes from '../../modules/user/routes/userRoutes';
import accountRoutes from '../../modules/account/routes/accountRoutes';
import sessionRoutes from '../../modules/session/routes/sessionRoutes';
import incomeRoutes from '../../modules/income/routes/incomeRoutes';
import expenseRoutes from '../../modules/expense/route/expenseRoutes';
import goalRoutes from '../../modules/financialGoal/routes/goalRoutes';
import authRoutes from '../../modules/auth/routes/authRoutes';
import paymentRoutes from '../../modules/payment/routes/paymentRoutes';
import ocrLogRoutes from '../../modules/utility/routes/ocrLogRoutes';
import activityLogRoutes from '../../modules/activityLog/routes/activityLogRoutes';
import budgetRoutes from '../../modules/budget/route/budgetRoutes';
import passport from '../../modules/auth/strategy/google.strategy'; 
import cors from 'cors';
import { generalLimiter } from '../middlewares/rateLimiter';

function createServer() {
    const app = express();

    app.use(cors());

    app.set('trust proxy', 1);
    
    app.use(express.json());
    
    app.use(deserializeUser);

    app.use(passport.initialize());

    app.use('/api', generalLimiter)
    app.use('/api', userRoutes)
    app.use('/api', sessionRoutes)
    app.use('/api', accountRoutes)
    app.use('/api', expenseRoutes)
    app.use('/api', incomeRoutes)
    app.use('/api', goalRoutes)
    app.use('/api', paymentRoutes)
    app.use('/api', ocrLogRoutes)
    app.use('/api', activityLogRoutes)
    app.use('/api', budgetRoutes)
    app.use('/api/auth', authRoutes)

    return app;
}

export default createServer;