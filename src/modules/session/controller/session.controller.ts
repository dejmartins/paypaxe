import { Request, Response } from "express";
import { validatePassword } from "../../user/service/user.service";
import { createSession, findSessions } from "../service/session.service";
import { signJwt } from "../../../shared/utils/jwt.utils";
import config from "../../../../config/default";

export async function createUserSessionHandler(req: Request, res: Response){
    const user = await validatePassword(req.body);

    if(!user) {
        return res.status(401).send("Invalid email or password");
    }

    // @ts-ignore
    const session = await createSession(user._id, req.get("user-agent") || "");

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

    return res.send({ accessToken, refreshToken })
}

export async function getUserSessionsHandler(req: Request, res: Response){
    const userId = res.locals.user._id;

    const sessions = await findSessions({user: userId, valid: true});

    return res.send(sessions);
}