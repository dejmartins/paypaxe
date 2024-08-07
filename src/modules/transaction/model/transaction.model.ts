import { Schema, model, Document } from "mongoose";
import { IAccount } from "../../account/model/account.model";
import { IUser } from "../../user/model/user.model";

interface ITransaction extends Document {
    user: IUser['email'];
    account: IAccount['_id'];
    amount: number;
    status: 'pending' | 'success' | 'failed';
    reference: string;
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
    user: {
        type: String,
        ref: 'User',
        required: true,
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        required: true,
    },
    reference: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const TransactionModel = model<ITransaction>('Transaction', transactionSchema);

export default TransactionModel;
