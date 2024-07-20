import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { ISession } from "../model/session.model";
import { AppError } from "../../../shared/utils/customErrors";
import { signJwt, verifyJwt } from "../../../shared/utils/jwt.utils";
import { get } from "lodash";
import { findUser } from "../../user/service/user.service";
import config from "../../../../config/default";

export async function createSession(userId: string, userAgent: string){
    try {
        const session = await SessionModel.create({user: userId, userAgent});
        return session.toJSON();
    } catch (e: any) {
        throw new AppError(e.message, e.statusCode, true);
    }
}

export async function findSessions(query: FilterQuery<ISession>) {
    try {
        return SessionModel.find(query).lean();
    } catch (e: any){
        throw new AppError(e.message, e.statusCode, true);
    }   
}

export async function updateSession(query: FilterQuery<ISession>, update: UpdateQuery<ISession>){
    try {
        return SessionModel.updateOne(query, update);
    } catch (e: any){
        throw new AppError(e.message, e.statusCode, true);
    }  
}

export async function reIssueAccessToken({refreshToken}: {refreshToken: string}){
    const { decoded } = verifyJwt(refreshToken);

    const sessionId = get(decoded, 'session');

    if(!decoded || !sessionId) {
        throw new AppError("Invalid token", 400);
    }

    const session = await SessionModel.findById(sessionId);

    if(!session){
        throw new AppError("No session found", 400);
    }

    if(!session.valid){
        throw new AppError("Session is invalid", 400);
    }

    const user = await findUser({ _id: session.user });

    if(!user) {
        throw new AppError("User not found", 400);
    }

    const accessToken = signJwt(
        {
            ...user,
            session: session._id
        },
        { 
            expiresIn: config.accessTokenTtl 
        }
    );

    return accessToken;

}