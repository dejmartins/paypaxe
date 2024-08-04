import { Model, model, Schema } from "mongoose";
import { IAccount } from "../../account/model/account.model";

export interface IFinancialGoal extends Document {
    account: IAccount['_id'];
    title: string;
    type: 'savings' | 'investment' | 'retirement' | 'debtRepayment' | 'other';
    targetAmount: number;
    deadline: Date;
    currentProgress: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const financialGoalSchema = new Schema<IFinancialGoal>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account'
        },
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['savings', 'investment', 'retirement', 'debtRepayment', 'other'],
            required: true,
            default: 'savings'
        },
        targetAmount: {
            type: Schema.Types.Number,
            required: true,
            get: (v: number) => parseFloat((v / 100).toFixed(2)),
            set: (v: number) => Math.round(v * 100),
        },
        deadline: {
            type: Date,
            required: true,
        },
        currentProgress: {
            type: Schema.Types.Number,
            required: true,
            get: (v: number) => parseFloat((v / 100).toFixed(2)),
            set: (v: number) => Math.round(v * 100),
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: {
            getters: true,
            transform: (doc, ret) => {
                ret.deadline = ret.deadline.toISOString().split('T')[0];
                return ret;
            }
        }
    }
)

const FinancialGoalModel: Model<IFinancialGoal> = model<IFinancialGoal>('FinancialGoal', financialGoalSchema);

export default FinancialGoalModel;

