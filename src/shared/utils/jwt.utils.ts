import jwt from 'jsonwebtoken'
import config from '../../../config/default'
import { IUser } from '../../modules/user/model/user.model';
import { VerifyTokenInput } from '../../modules/user/types/userTypes';

const privateKey = config.privateKey;
const publicKey = config.publicKey;

export function signJwt(object: Object, options?: jwt.SignOptions | undefined){
    return jwt.sign(object, privateKey, {
        ...(options && options),
        algorithm: 'RS256'
    })
}

export function verifyJwt(token: string){
    try {
        const decoded = jwt.verify(token, publicKey);

        return {
            valid: true,
            expired: false,
            decoded
        }

    } catch(error: any) {
        return {
            valid: false,
            expired: error.message === 'Jwt Expired',
            decoded: null
        }
    }
}

export function generateVerificationToken(user: VerifyTokenInput){
    const payload = { ...user };
    return signJwt(payload, { expiresIn: config.verificationTokenTtl })
}

export function generatePasswordResetToken(user: IUser){
    const payload = { ...user, email: user.email };
    return signJwt(payload, { expiresIn: '15m' })
}