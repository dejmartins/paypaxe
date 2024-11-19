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
    isRecurring: boolean;
    frequency?: string;
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
            set: (v: number) => Math.round(v * 100), // Store in cents
        },
        deadline: {
            type: Date,
            required: true,
        },
        currentProgress: {
            type: Schema.Types.Number,
            required: true,
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
        isRecurring: {
            type: Boolean,
            default: false,
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
            required: function () {
                return this.isRecurring;
            },
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
    }
);

// Pre-save middleware to automatically update status
financialGoalSchema.pre<IFinancialGoal>('save', function (next) {
    if (this.currentProgress >= this.targetAmount) {
        this.status = 'completed';
    } else {
        this.status = 'ongoing';
    }
    next();
});

// Pre-update middleware to handle status changes during updates
financialGoalSchema.pre<Query<IFinancialGoal, IFinancialGoal>>('findOneAndUpdate', function (next) {
    const update = this.getUpdate() as Partial<IFinancialGoal>;
    if (update.currentProgress !== undefined && update.targetAmount !== undefined) {
        if (update.currentProgress >= update.targetAmount) {
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
