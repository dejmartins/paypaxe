import mongoose, { Schema, Document, Model } from "mongoose";
import { IAccount } from "../../account/model/account.model";

export interface IBudget extends Document {
    account: IAccount["_id"];
    budgetAmount: number;
    allocation: {
        needs: number;
        wants: number;
        savings: number;
    };
    remainingAllocation: {
        needs: number;
        wants: number;
        savings: number;
    };
    negativeBalance: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },
        budgetAmount: {
            type: Schema.Types.Number,
            required: true,
            get: (v: number) => parseFloat((v / 100).toFixed(2)),
            set: (v: number) => Math.round(v * 100),
        },
        allocation: {
            needs: {
                type: Schema.Types.Number,
                required: true,
                default: 0,
                get: (v: number) => parseFloat((v / 100).toFixed(2)),
                set: (v: number) => Math.round(v * 100),
            },
            wants: {
                type: Schema.Types.Number,
                required: true,
                default: 0,
                get: (v: number) => parseFloat((v / 100).toFixed(2)),
                set: (v: number) => Math.round(v * 100),
            },
            savings: {
                type: Schema.Types.Number,
                required: true,
                default: 0,
                get: (v: number) => parseFloat((v / 100).toFixed(2)),
                set: (v: number) => Math.round(v * 100),
            },
        },
        remainingAllocation: {
            needs: {
                type: Schema.Types.Number,
                required: true,
                default: 0,
                get: (v: number) => parseFloat((v / 100).toFixed(2)),
                set: (v: number) => Math.round(v * 100),
            },
            wants: {
                type: Schema.Types.Number,
                required: true,
                default: 0,
                get: (v: number) => parseFloat((v / 100).toFixed(2)),
                set: (v: number) => Math.round(v * 100),
            },
            savings: {
                type: Schema.Types.Number,
                required: true,
                default: 0,
                get: (v: number) => parseFloat((v / 100).toFixed(2)),
                set: (v: number) => Math.round(v * 100),
            },
        },
        negativeBalance: {
            type: Schema.Types.Number,
            default: 0,
            get: (v: number) => parseFloat((v / 100).toFixed(2)),
            set: (v: number) => Math.round(v * 100),
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true,
            default: function () {
                const now = new Date();
                return new Date(now.getFullYear(), now.getMonth() + 1, 0);
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            getters: true,
            virtuals: true,
        },
    }
);

// Virtual property for budget balance
budgetSchema.virtual("budgetBalance").get(function () {
    const remainingNeeds = this.remainingAllocation.needs || 0;
    const remainingWants = this.remainingAllocation.wants || 0;
    const remainingSavings = this.remainingAllocation.savings || 0;
    const negativeBalance = this.negativeBalance || 0;

    return (remainingNeeds + remainingWants + remainingSavings - negativeBalance);
});

const BudgetModel: Model<IBudget> = mongoose.model<IBudget>("Budget", budgetSchema);

export default BudgetModel;
