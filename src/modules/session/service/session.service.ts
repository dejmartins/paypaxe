import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { ISession } from "../model/session.model";
import { AppError } from "../../../shared/utils/customErrors";

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

// export async function updateSession(query: FilterQuery<ISession>, update: UpdateQuery<ISession>){
//     return SessionModel.updateOne(query, update);
// }

// export async function reIssueAccessToken({refreshToken}: {refreshToken: string}){
//     const { decoded } = verifyJwt(refreshToken);

//     if(!decoded || !get(decoded, 'session')) {
//         throw new Error("Invalid token or id not found.");
//     }

//     const session = await SessionModel.findById(get(decoded, 'session'));

//     if(!session || !session.valid){
//         throw new Error("No session found or session is invalid");
//     }

//     const user = await findUser({ _id: session.user });

//     if(!user) {
//         throw new Error("User not found.");
//     }

//     const accessToken = signJwt(
//         {
//             ...user,
//             session: (await session)._id
//         },
//         { 
//             expiresIn: config.accessTokenTtl 
//         }
//     );

//     return accessToken;

// }