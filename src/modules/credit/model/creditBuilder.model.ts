import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAccount } from '../../account/model/account.model';

export interface ICreditBuilder extends Document {
    account: IAccount['_id'];
    isOptedIn: boolean;
    aggregateCreditLimit: number;
    aggregateUtilization: number;
    activeCards: string[];
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


creditBuilderSchema.post('save', async function (creditBuilder) {
    const CreditBuilderModel = mongoose.model<ICreditBuilder>('CreditBuilder');
    await CreditBuilderModel.findByIdAndUpdate(creditBuilder._id, { $set: {} });
});

const CreditBuilderModel: Model<ICreditBuilder> = mongoose.model<ICreditBuilder>('CreditBuilder', creditBuilderSchema);

export default CreditBuilderModel;
