import IncomeModel from "../../../modules/income/model/income.model"
import { incomeReturnPayload } from "../../utils/fixtures"

jest.mock('../../../modules/income/model/income.model')

describe('Income Service - addIncome', () => {
    describe('given income details are valid', () => {
        it('should add the income linked to the user account type', () => {
            (IncomeModel.create as jest.Mock).mockResolvedValue(incomeReturnPayload);


        })
    })
})