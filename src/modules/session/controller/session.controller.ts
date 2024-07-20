import { Request, Response } from "express";
import { validatePassword } from "../../user/service/user.service";
import { createSession, findSessions, updateSession } from "../service/session.service";
import { signJwt } from "../../../shared/utils/jwt.utils";
import config from "../../../../config/default";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { successResponse } from "../../../shared/utils/response";

export const createUserSessionHandler =  asyncHandler(async (req: Request, res: Response) => {
    const user = await validatePassword(req.body);

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

    return res.send(successResponse({ accessToken, refreshToken }, "Session created successfully"))
})

export const getUserSessionsHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = res.locals.user._id;
    const sessions = await findSessions({user: userId, valid: true});
    return res.send(successResponse(sessions));
})

export const deleteSessionHandler = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = res.locals.user.session;
    await updateSession({ _id: sessionId }, { valid: false })
    return res.send(successResponse({
        accessToken: null, refreshToken: null
    }))
})