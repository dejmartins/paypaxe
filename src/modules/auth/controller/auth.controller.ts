import { Request, Response } from 'express';
import { createSession } from '../../session/service/session.service';
import { signJwt } from '../../../shared/utils/jwt.utils';
import config from '../../../../config/default';

export async function googleOAuthCallbackHandler(req: Request, res: Response) {
    // @ts-ignore
    const { user, isNewUser } = req.user;

    if (isNewUser) {
      return res.json({ user });
    }

    const session = await createSession(user._id, req.get('user-agent') || '');

    const accessToken = signJwt(
        {
            ...user,
            session: session._id
        },
        { 
            expiresIn: config.accessTokenTtl 
        }
    );

    const refreshToken = signJwt(
        {
            ...user,
            session: session._id
        },
        { 
            expiresIn: config.refreshTokenTtl 
        }
    );

    return res.json({ accessToken, refreshToken });
}