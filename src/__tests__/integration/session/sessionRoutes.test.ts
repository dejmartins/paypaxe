import * as UserService from '../../../modules/user/service/user.service'
import * as SessionService from '../../../modules/session/service/session.service'
import supertest from 'supertest'
import { sessionPayload, userReturnPayload } from '../../utils/fixtures'
import createServer from '../../../shared/utils/server'
import { createUserSessionHandler } from '../../../modules/session/controller/session.controller'
import { lazy } from 'zod'

describe('User', () => {
    describe('User Authentication', () => {

        describe('given the username and password are valid', () => {
            it('should return a signed access and refresh tokens', async () => {
                jest.spyOn(UserService, 'validatePassword')
                    .mockResolvedValue(userReturnPayload)

                jest.spyOn(SessionService, 'createSession')
                    .mockResolvedValue(sessionPayload)

                const req = {
                    get: () => {
                        return 'user agent'
                    },
                    body: {
                        "email": "dej@gmail.com",
                        "password": "pass12345678"
                    }
                }

                const send = jest.fn();

                const res = {
                    send
                }

                // @ts-ignore
                await createUserSessionHandler(req, res);

                expect(send).toHaveBeenCalledWith(expect.objectContaining({
                    data: expect.objectContaining({
                        accessToken: expect.any(String),
                        refreshToken: expect.any(String)
                    })
                }))
            })
        })
    })
})