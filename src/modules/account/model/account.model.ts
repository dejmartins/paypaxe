import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '../../user/model/user.model';

export interface IAccount extends Document {
    user: IUser['_id'];
    accountType: 'individual' | 'family' | 'trader' | 'business';
    subscriptionPlan: 'basic' | 'premium';
    subscriptionEndDate: Date;
    netBalance: number;
    createdAt: Date;
    updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        accountType: {
            type: String,
            required: true,
            enum: ['individual', 'family', 'trader', 'business']
        },
        subscriptionPlan: {
            type: String,
            required: true,
            enum: ['basic', 'premium']
        },
        subscriptionEndDate: {
            type: Date
        },
        netBalance: {
            type: Schema.Types.Number,
            required: true,
            default: 0,
            get: (v: number) => parseFloat((v / 100).toFixed(2)),
            set: (v: number) => Math.round(v * 100)
        }
    },
    {
        timestamps: true,
        toJSON: {
            getters: true,
            transform: (doc, ret) => {
                ret.subscriptionEndDate = ret.subscriptionEndDate?.toISOString().split('T')[0];
                return ret;
            }
        }
    }
);

accountSchema.pre<IAccount>('save', function (next) {
    if (this.isNew && this.subscriptionPlan === 'basic') {
        this.subscriptionEndDate = new Date(this.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);
    }
    next();
});

const AccountModel: Model<IAccount> = mongoose.model<IAccount>('Account', accountSchema);

export default AccountModel;
