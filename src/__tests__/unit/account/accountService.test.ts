import AccountModel from "../../../modules/account/model/account.model"
import { accountReturnPayload, createAccountPayload } from "../../utils/fixtures"

jest.mock('../../../modules/account/model/account.model')

describe('AccountService - createAccount', () => {
    describe('given userId and valid account details', () => {
        it('should create an account', async () => {
            (AccountModel.create as jest.Mock).mockResolvedValue(accountReturnPayload);

            const result = await AccountModel.create(createAccountPayload);

            expect(result).toEqual(accountReturnPayload);
            expect(AccountModel.create).toHaveBeenCalledWith(createAccountPayload);
        })
    })
})