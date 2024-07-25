import * as UserService from '../../../modules/user/service/user.service'
import supertest from 'supertest'
import { createUserPayload, userReturnPayload } from '../../utils/fixtures'
import createServer from '../../../shared/utils/server'

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
})