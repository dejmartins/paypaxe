import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";

// import { reIssueAccessToken } from "../services/session.service";

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

//     let refreshToken = get(req, "headers.x-refresh");
//     refreshToken = Array.isArray(refreshToken) ? refreshToken[0] : refreshToken;

    if(!accessToken) {
        return next();
    }

    const {decoded, expired} = verifyJwt(accessToken);

    if(decoded) {
        res.locals.user = decoded;
        return next();
    }


//     if (expired && refreshToken){
//         const newAccessToken = await reIssueAccessToken({refreshToken});

//         if(newAccessToken){
//             res.setHeader('x-access-token', newAccessToken);
//         }

//         const result = verifyJwt(newAccessToken);

//         res.locals.user = result.decoded;

//         return next()
//     }

    return next();
}

export default deserializeUser;