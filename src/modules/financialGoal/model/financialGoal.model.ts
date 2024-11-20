import { Model, model, Schema, Document, Query } from "mongoose";
import { IAccount } from "../../account/model/account.model";

export interface IFinancialGoal extends Document {
    account: IAccount['_id'];
    title: string;
    type: string;
    category: string;
    targetAmount: number;
    deadline: Date;
    currentProgress: number;
    description?: string;
    priority?: string;
    deadlineNotificationSent: boolean;
    goalAchievedNotificationSent: boolean;
    status: 'completed' | 'ongoing';
    createdAt: Date;
    updatedAt: Date;
}

const financialGoalSchema = new Schema<IFinancialGoal>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['savings', 'investment', 'retirement', 'debtRepayment', 'other'],
            required: true,
            default: 'savings',
        },
        category: {
            type: String,
            default: 'general',
        },
        targetAmount: {
            type: Schema.Types.Number,
            required: true,
            get: (v: number) => parseFloat((v / 100).toFixed(2)),
            set: (v: number) => Math.round(v * 100), // Store in cents
        },
        deadline: {
            type: Date,
            required: true,
        },
        currentProgress: {
            type: Schema.Types.Number,
            required: true,
            default: 0, // Default to zero
            get: (v: number) => parseFloat((v / 100).toFixed(2)),
            set: (v: number) => Math.round(v * 100), // Store in cents
        },
        description: {
            type: String,
        },
        priority: {
            type: String,
            enum: ['high', 'medium', 'low'],
            default: 'medium',
        },
        deadlineNotificationSent: {
            type: Boolean,
            default: false,
        },
        goalAchievedNotificationSent: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['completed', 'ongoing'],
            default: 'ongoing',
        },
    },
    {
        timestamps: true,
        toJSON: {
            getters: true,
            transform: (doc, ret) => {
                ret.deadline = ret.deadline.toISOString().split('T')[0];
                return ret;
            },
        },
    }
);

financialGoalSchema.pre<Query<IFinancialGoal, IFinancialGoal>>('findOneAndUpdate', function (next) {
    const update = this.getUpdate() as Partial<IFinancialGoal>;

    if (update.currentProgress !== undefined && update.targetAmount !== undefined) {
        // Scale down for comparison
        const currentProgress = update.currentProgress / 100;
        const targetAmount = update.targetAmount / 100;

        // Update status based on scaled values
        if (currentProgress >= targetAmount) {
            update.status = 'completed';
        } else {
            update.status = 'ongoing';
        }

        // Apply the updated fields
        this.setUpdate(update);
    }

    next();
});


const FinancialGoalModel: Model<IFinancialGoal> = model<IFinancialGoal>('FinancialGoal', financialGoalSchema);

export default FinancialGoalModel;
