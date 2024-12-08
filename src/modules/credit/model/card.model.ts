import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAccount } from '../../account/model/account.model';

export interface ICard extends Document {
    account: IAccount['_id'];
    creditInstitution: string;
    creditLimit: number;
    utilizationAmount: number;
    paymentDueDate: string;
    cardNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}

const cardSchema = new Schema<ICard>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
            required: true,
        },
        creditInstitution: {
            type: String,
            required: true,
        },
        creditLimit: {
            type: Schema.Types.Number,
            required: true,
            get: (v: number) => parseFloat((v / 100).toFixed(2)),
            set: (v: number) => Math.round(v * 100),
        },
        utilizationAmount: {
            type: Schema.Types.Number,
            default: 0,
            required: true,
            get: (v: number) => parseFloat((v / 100).toFixed(2)),
            set: (v: number) => Math.round(v * 100),
        },
        paymentDueDate: {
            type: String,
            required: true, // "YYYY-MM-DD"
        },
        cardNumber: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: {
            getters: true,
            transform: (doc, ret) => {
                ret.creditLimit = ret.creditLimit.toFixed(2);
                ret.utilizationAmount = ret.utilizationAmount.toFixed(2);
                return ret;
            },
        },
    }
);

const CardModel: Model<ICard> = mongoose.model<ICard>('Card', cardSchema);

export default CardModel;
