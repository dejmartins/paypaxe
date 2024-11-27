import { Model, model, Schema, Document, Query } from "mongoose";
import { IAccount } from "../../account/model/account.model";

export interface IFinancialGoal extends Document {
    account: IAccount['_id'];
    title: string;
    type: string;
    category: string;
    targetAmount: number;
    startDate?: Date;
    deadline: Date;
    currentProgress: number;
    description?: string;
    priority?: string;
    amount?: number;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    isRecurring: boolean;
    preferredTime?: string;
    deadlineNotificationSent: boolean;
    goalAchievedNotificationSent: boolean;
    status: 'completed' | 'ongoing';
    deletionStatus: 'active' | 'deleted';
    pauseStatus: string;
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
            set: (v: number) => Math.round(v * 100),
        },
        startDate: {
            type: Date,
            required: true
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
            set: (v: number) => Math.round(v * 100),
        },
        description: {
            type: String,
        },
        priority: {
            type: String,
            enum: ['high', 'medium', 'low'],
            default: 'medium',
        },
        amount: {
            type: Schema.Types.Number,
            default: 0,
            get: (v: number) => parseFloat((v / 100).toFixed(2)),
            set: (v: number) => Math.round(v * 100),
        },
        isRecurring: {
            type: Boolean,
            default: false,
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
            required: function () {
                return this.isRecurring;
            }
        },
        preferredTime: {
            type: String,
            default: () => new Date().toISOString().split('T')[1].slice(0, 5),
            required: function () {
                return this.isRecurring;
            }
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
        deletionStatus: {
            type: String,
            enum: ['active', 'deleted'],
            default: 'active',
        },
        pauseStatus: {
            type: String,
            enum: ['paused', 'active'],
            default: 'active',
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
        const currentProgress = update.currentProgress / 100;
        const targetAmount = update.targetAmount / 100;

        if (currentProgress >= targetAmount) {
            update.status = 'completed';
        } else {
            update.status = 'ongoing';
        }

        this.setUpdate(update);
    }

    next();
});


const FinancialGoalModel: Model<IFinancialGoal> = model<IFinancialGoal>('FinancialGoal', financialGoalSchema);

export default FinancialGoalModel;
