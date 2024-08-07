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