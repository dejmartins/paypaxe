import { model, Model, Schema } from "mongoose";
import { IAccount } from "../../account/model/account.model";

export interface IIncome extends Document {
    account: IAccount['_id'];
    amount: number;
    category: string;
    description: string;
    dateReceived: Date | string;
    isRecurring: boolean;
    frequency?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const incomeSchema = new Schema<IIncome>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account'
        },
        amount: {
            type: Schema.Types.Number,
            required: true,
            get: (v: number) => parseFloat((v / 100).toFixed(2)),
            set: (v: number) => Math.round(v * 100)
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String
        },
        dateReceived: {
            type: Date,
            required: true
        },
        isRecurring: {
            type: Boolean,
            required: true,
            default: false
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
            required: function () {
                return this.isRecurring;
            }
        },
        status: {
            type: String,
            enum: ['active', 'deleted'],
            default: 'active',
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: {
            getters: true,
            transform: (doc, ret) => {
                ret.dateReceived = ret.dateReceived.toISOString().split('T')[0];
                return ret;
            }
        }
    }
)

const IncomeModel: Model<IIncome> = model<IIncome>('Income', incomeSchema);


export default IncomeModel;
