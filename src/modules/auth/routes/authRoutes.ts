import { Router } from 'express';
import passport from 'passport';
import { googleOAuthCallbackHandler } from '../controller/auth.controller';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleOAuthCallbackHandler);

export default router;
