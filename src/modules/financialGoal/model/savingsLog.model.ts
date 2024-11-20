import { Schema, model, Document, Model } from "mongoose";
import { IAccount } from "../../account/model/account.model";
import { IFinancialGoal } from "./financialGoal.model";

export interface ISavingsLog extends Document {
    account: IAccount["_id"];
    goal: IFinancialGoal["_id"];
    amount: number;
    date: Date;
    isRecurring: boolean;
    frequency?: "daily" | "weekly" | "monthly" | "yearly";
    createdAt: Date;
    updatedAt: Date;
}

const savingsLogSchema = new Schema<ISavingsLog>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: "Account",
            required: true,
        },
        goal: {
            type: Schema.Types.ObjectId,
            ref: "FinancialGoal",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            get: (v: number) => parseFloat((v / 100).toFixed(2)),
            set: (v: number) => Math.round(v * 100),
        },
        date: {
            type: Date,
            required: true,
        },
        isRecurring: {
            type: Boolean,
            required: true,
            default: false,
        },
        frequency: {
            type: String,
            enum: ["daily", "weekly", "monthly", "yearly"],
            required: function () {
                return this.isRecurring;
            }
        },
    },
    {
        timestamps: true,
        toJSON: {
            getters: true,
        },
    }
);

const SavingsLogModel: Model<ISavingsLog> = model<ISavingsLog>("SavingsLog", savingsLogSchema);

export default SavingsLogModel;
