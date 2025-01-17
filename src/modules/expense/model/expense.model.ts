import { model, Model, Schema, Document } from "mongoose";
import { IAccount } from "../../account/model/account.model";

export interface IExpense extends Document {
    account: IAccount['_id'];
    amount: number;
    category: string;
    description: string;
    date: Date;
    isRecurring: boolean;
    frequency?: string;
    expenseSource: 'creditCard' | 'netBalance';
    expenseType: 'cash' | 'debitCard' | 'creditCard' | 'linkedCreditCard';
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
            required: true,
        },
        amount: {
            type: Schema.Types.Number,
            required: true,
            get: (v: number) => parseFloat((v / 100).toFixed(2)),
            set: (v: number) => Math.round(v * 100),
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
            default: "",
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
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
            required: function () {
                return this.isRecurring;
            },
        },
        expenseSource: {
            type: String,
            enum: ['creditCard', 'netBalance'],
            required: true,
            default: 'netBalance',
        },
        expenseType: {
            type: String,
            enum: ['cash', 'debitCard', 'creditCard', 'linkedCreditCard'],
            required: true,
            default: 'cash',
        },
        status: {
            type: String,
            enum: ['active', 'deleted'],
            default: 'active',
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            getters: true,
            transform: (doc, ret) => {
                ret.date = ret.date.toISOString().split('T')[0];
                return ret;
            },
        },
    }
);

const ExpenseModel: Model<IExpense> = model<IExpense>('Expense', expenseSchema);

export default ExpenseModel;
