import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAccount } from '../../account/model/account.model';
import { ICard } from './card.model';

export interface ICreditBuilder extends Document {
    account: IAccount['_id'];
    isOptedIn: boolean;
    aggregateCreditLimit: number;
    aggregateUtilization: number;
    activeCards: ICard['_id'][];
    createdAt: Date;
    updatedAt: Date;
}

const creditBuilderSchema = new Schema<ICreditBuilder>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
            required: true,
        },
        isOptedIn: {
            type: Boolean,
            required: true,
            default: false,
        },
        aggregateCreditLimit: {
            type: Number,
            required: true,
            default: 0,
            get: (v: number) => parseFloat((v / 100).toFixed(2)),
            set: (v: number) => Math.round(v * 100),
        },
        aggregateUtilization: {
            type: Number,
            required: true,
            default: 0,
            get: (v: number) => parseFloat((v / 100).toFixed(2)),
            set: (v: number) => Math.round(v * 100),
        },
        activeCards: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Card',
            },
        ],
    },
    {
        timestamps: true,
        toJSON: {
            getters: true,
            transform: (doc, ret) => {
                ret.aggregateCreditLimit = parseFloat(ret.aggregateCreditLimit.toFixed(2));
                ret.aggregateUtilization = parseFloat(ret.aggregateUtilization.toFixed(2));
                return ret;
            },
        },
    }
);


creditBuilderSchema.pre('save', async function (next) {
    if (!this.isModified('activeCards')) return next();
    const CardModel = mongoose.model<ICard>('Card');
    const cards = await CardModel.find({ _id: { $in: this.activeCards } });

    this.aggregateCreditLimit = cards.reduce((total, card) => total + card.creditLimit, 0);
    this.aggregateUtilization = cards.reduce((total, card) => total + card.utilizationAmount, 0);

    next();
});



const CreditBuilderModel: Model<ICreditBuilder> = mongoose.model<ICreditBuilder>('CreditBuilder', creditBuilderSchema);

export default CreditBuilderModel;
