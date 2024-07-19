import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '../../user/model/user.model';

export interface IAccount extends Document {
    user: IUser['_id'];
    accountType: 'individual' | 'family' | 'trader' | 'business';
    subscriptionPlan: 'basic' | 'premium';
    trialEndDate: Date;
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
        trialEndDate: {
            type: Date
        }
    }, 
    { 
        timestamps: true
    }
);

accountSchema.pre<IAccount>('save', function(next) {
    if (this.isNew && this.subscriptionPlan === 'basic') {
        this.trialEndDate = new Date(this.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);
    }
    next();
});

const AccountModel: Model<IAccount> = mongoose.model<IAccount>('Account', accountSchema);

export default AccountModel;
