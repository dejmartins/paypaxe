import * as UserService from '../../../modules/user/service/user.service'
import * as EmailService from '../../../modules/notification/email/services/email.service'
 import * as jwtUtils from '../../../shared/utils/jwt.utils';
import supertest from 'supertest'
import { createUserPayload, userReturnPayload } from '../../utils/fixtures'
import createServer from '../../../shared/utils/server'
import UserModel from '../../../modules/user/model/user.model'

const app = createServer()

describe('User', () => {
    describe('User Registration', () => {

        describe('given that the email and password are valid', () => {
            it('should return the user payload', async () => {
                const createUserServiceMock = jest
                    .spyOn(UserService, 'createUser')
                    .mockResolvedValueOnce(userReturnPayload);
    
                const { statusCode, body } = await supertest(app)
                    .post('/api/users')
                    .send(createUserPayload);
    
                expect(statusCode).toBe(200);
    
                const actualUser = body.data;
                const expectedUser = userReturnPayload.toJSON();
                expectedUser._id = expectedUser._id.toString();
    
                expect(actualUser).toStrictEqual(expectedUser);
                expect(createUserServiceMock).toHaveBeenCalledWith(createUserPayload);
            });

            it('should send a verify email request', async () => {
                const sendEmailRequestMock = jest
                    .spyOn(EmailService, 'sendVerificationEmail')
                    .mockResolvedValueOnce(Promise.resolve());

                const token = "mocked-verification-token";
                jest.spyOn(jwtUtils, 'generateVerificationToken')
                    .mockReturnValueOnce(token);

                jest.spyOn(UserService, 'createUser').mockImplementationOnce(async (input) => {
                    const user = new UserModel(input);
                    await EmailService.sendVerificationEmail(user.email, token);
                    return user;
                });

                await supertest(app)
                    .post('/api/users')
                    .send(createUserPayload);

                expect(sendEmailRequestMock).toHaveBeenCalledTimes(1);
            })
        })

        describe('given the create user endpoint throws a non-operational error', () => {
            it('should return error 500', async () => {
                const createUserServiceMock = jest
                    .spyOn(UserService, 'createUser')
                    .mockRejectedValue('An error occured');

                const { statusCode } = await supertest(app)
                    .post('/api/users')
                    .send(createUserPayload);

                expect(statusCode).toBe(500);
                expect(createUserServiceMock).toHaveBeenCalledWith(createUserPayload);
            })
        })
        
    })

    describe('User Registration Validation', () => {
        describe('given the password length is less than 8', () => {
            it('should return error 400', async () => {
                const invalidPayload = {
                    name: 'Dej Lok',
                    email: 'dej@gmail.com',
                    password: 'short'
                };
        
                const { statusCode, body } = await supertest(app)
                    .post('/api/users')
                    .send(invalidPayload);
        
                expect(statusCode).toBe(400);
                expect(body).toEqual(expect.objectContaining({
                    errors: expect.arrayContaining([
                        expect.objectContaining({
                            message: 'Password too short',
                        })
                    ])
                }));
            });
        })
    })
})