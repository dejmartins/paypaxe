import * as UserService from '../../../modules/user/service/user.service';
import UserModel from '../../../modules/user/model/user.model';
import * as EmailService from '../../../modules/email/services/email.service';
import * as jwtUtils from '../../../shared/utils/jwt.utils';
import { createUserPayload, userReturnPayload } from '../../utils/fixtures';

jest.mock('../../../modules/user/model/user.model');
jest.mock('../../../modules/email/services/email.service');
jest.mock('../../../shared/utils/jwt.utils');

describe('UserService - createUser', () => {
    describe('given user valid details', () => {
        it('should create a user, generate token, and send a verification email', async () => {
            (UserModel.create as jest.Mock).mockResolvedValue(userReturnPayload);
    
            const result = await UserService.createUser(createUserPayload);
    
            expect(UserModel.create).toHaveBeenCalledWith(createUserPayload);
            expect(EmailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
            expect(jwtUtils.generateVerificationToken).toHaveBeenCalledTimes(1);
            expect(result).toEqual(userReturnPayload);
        });
    })

    describe('given an error is thrown', () => {
        it('should handle errors', async () => {
            (UserModel.create as jest.Mock).mockRejectedValue(new Error('Error creating user'));
    
            await expect(UserService.createUser(createUserPayload)).rejects.toThrow('Error creating user');
        });
    })

});

describe('UserService - verifyEmail', () => {
    it('should verify a user', async () => {
        const token = 'mocked-token';
        const decodedUser = { _id: 'userId', email: 'dej@gmail.com', verified: false };
        (jwtUtils.verifyJwt as jest.Mock).mockReturnValue({ decoded: decodedUser, expired: false });
        (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(decodedUser);

        await UserService.verifyEmail(token);

        expect(jwtUtils.verifyJwt).toHaveBeenCalledWith(token);
        expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(decodedUser._id, { verified: true });
    });

    it('should handle expired tokens', async () => {
        const token = 'mocked-token';
        (jwtUtils.verifyJwt as jest.Mock).mockReturnValue({ decoded: null, expired: true });

        await expect(UserService.verifyEmail(token)).rejects.toThrow('Invalid or expired token');
    });

    it('should handle already verified users', async () => {
        const token = 'mocked-token';
        const decodedUser = { _id: 'userId', email: 'dej@gmail.com', verified: true };
        (jwtUtils.verifyJwt as jest.Mock).mockReturnValue({ decoded: decodedUser, expired: false });

        await expect(UserService.verifyEmail(token)).rejects.toThrow('User is already verified');
    });
});
