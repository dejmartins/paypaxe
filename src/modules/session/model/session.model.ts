import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '../../user/model/user.model';

export interface ISession extends Document {
    user: IUser['_id'];
    valid: boolean;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        valid: {
            type: Boolean,
            default: true
        },
        userAgent: {
            type: String
        }
    }, 
    { 
        timestamps: true
    }
);

const SessionModel: Model<ISession> = mongoose.model<ISession>('Session', sessionSchema);

export default SessionModel;
