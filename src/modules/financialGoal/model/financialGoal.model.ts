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

const FinancialGoalModel: Model<IFinancialGoal> = model<IFinancialGoal>('FinancialGoal', financialGoalSchema);

export default FinancialGoalModel;

