import * as UserService from '../../../modules/user/service/user.service';
import UserModel from '../../../modules/user/model/user.model';
import * as EmailService from '../../../modules/email/services/email.service';
import * as jwtUtils from '../../../shared/utils/jwt.utils';
import { createUserPayload, userId, userReturnPayload } from '../../utils/fixtures';
import { AppError } from '../../../shared/utils/customErrors';

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

describe('UserService - resendVerificationEmail', () => {
    describe('given user exists and is not verified', () => {
        it('should send a verification email', async () => {
            const email = 'dej@gmail.com';
            const user = {
                _id: userId,
                email,
                name: 'Dej Lok',
                verified: false
            };

            (UserModel.findOne as jest.Mock).mockResolvedValue(user);
            (jwtUtils.generateVerificationToken as jest.Mock).mockReturnValue('token');
            (EmailService.sendVerificationEmail as jest.Mock).mockResolvedValue(Promise.resolve());

            await UserService.resendVerificationEmail(email);

            expect(UserModel.findOne).toHaveBeenCalledWith({ email });
            expect(jwtUtils.generateVerificationToken).toHaveBeenCalledWith({
                _id: user._id,
                email: user.email,
                name: user.name,
                verified: user.verified
            });
            expect(EmailService.sendVerificationEmail).toHaveBeenCalledWith(user.email, 'token');
        })
    })

    describe('given user does not exist', () => {
        it('should throw an error', async () => {
            const email = 'dej@gmail.com';

            await expect(UserService.resendVerificationEmail(email))
            .rejects
            .toThrow(new AppError('User not found', 400));
        })
    })

    describe('given user is already verified', () => {
        it('should throw an error', async () => {
            const email = 'dej@gmail.com';
            const user = {
                _id: userId,
                email,
                name: 'Dej Lok',
                verified: true
            };

            (UserModel.findOne as jest.Mock).mockResolvedValue(user);
            
            await expect(UserService.resendVerificationEmail(email))
            .rejects
            .toThrow(new AppError('User is already verified', 400))
        })
    })
})
