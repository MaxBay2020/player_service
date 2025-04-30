import request from 'supertest'
import app from "../../index";
import AppDataSource from "../../data-source";
import User from "../../entities/User";
import {Message, StatusCode} from "../../utils/enums";
import setupTestIntegrationTest from "../../utils/setupIntegrationTest";


describe('User API', () => {
    setupTestIntegrationTest()

    describe('GET - Query all players', () => {
        describe('isAdmin is true', () => {
            const isAdmin = true
            // Response status code should be 200
            it('Response status code should be 200', async () => {
                const res = await request(app)
                    .get(`/v1/players?isAdmin=${isAdmin}`)
                expect(res.status).toBe(StatusCode.E200)

            })

            // Response -> data -> playerList is array, each item should have firstName, lastName, and age
            it('Response -> data -> playerList should be an array, each item should have firstName, lastName, and age', async () => {
                const res = await request(app)
                    .get(`/v1/players?isAdmin=${isAdmin}`)

                // players should be an array
                expect(Array.isArray(res.body.data.playerList)).toBe(true)

                // items in the player list should have firstName, lastName, and age
                res.body.data.playerList.forEach((user: User) => {
                    expect(user).toHaveProperty('firstName')
                    expect(user).toHaveProperty('lastName')
                    expect(user).toHaveProperty('age')
                })
            })

            // Response -> data -> count should be number
            it('Response -> data -> count should be number', async () => {
                const res = await request(app)
                    .get(`/v1/players?isAdmin=${isAdmin}`)

                // count should be number
                expect(typeof res.body.data.count).toBe('number')
            })

            // Response ->  message: 'OK'
            it(`Response ->  message: 'OK'`, async () => {
                const res = await request(app)
                    .get(`/v1/players?isAdmin=${isAdmin}`)
                expect(res.body.message).toBe(Message.OK)
            })
        })

        describe('isAdmin is false', () => {
            const isAdmin = false
            // Response status code should be 200
            it('Response status code should be 200', async () => {
                const res = await request(app)
                    .get(`/v1/players?isAdmin=${isAdmin}`)
                expect(res.status).toBe(StatusCode.E200)
            })

            // Response -> data -> playerList is array, each item should have firstName and age
            it('Response -> data -> playerList should be an array, each item should have firstName and age', async () => {
                const res = await request(app)
                    .get(`/v1/players?isAdmin=${isAdmin}`)

                // players should be an array
                expect(Array.isArray(res.body.data.playerList)).toBe(true)

                // items in the player list should have firstName, lastName, and age
                res.body.data.playerList.forEach((user: User) => {
                    expect(user).toHaveProperty('firstName')
                    expect(user).not.toHaveProperty('lastName')
                    expect(user).toHaveProperty('age')
                })
            })

            // Response -> data -> count should be number
            it('Response -> data -> count should be number', async () => {
                const res = await request(app)
                    .get(`/v1/players?isAdmin=${isAdmin}`)

                // count should be number
                expect(typeof res.body.data.count).toBe('number')
            })

            // Response ->  message: 'OK'
            it(`Response ->  message: 'OK'`, async () => {
                const res = await request(app)
                    .get(`/v1/players?isAdmin=${isAdmin}`)
                expect(res.body.message).toBe(Message.OK)
            })
        })

        describe('isAdmin not exist', () => {
            // Response status code should be 400
            it('Response status code should be 400', async () => {
                const res = await request(app)
                    .get(`/v1/players`)
                expect(res.status).toBe(StatusCode.E400)
            })

            // Response -> data should be null
            it('Response -> data should be null', async () => {
                const res = await request(app)
                    .get(`/v1/players`)
                expect(res.body.data).toBe(null)
            })

            // response should have message: 'Necessary params NOT provided or invalid data'
            it(`Response -> message should be 'Necessary params NOT provided or invalid data'`, async () => {
                const res = await request(app)
                    .get(`/v1/players`)
                expect(res.body.message).toBe(Message.ErrParams)
            })
        })

        describe('isAdmin is neither true nor false', () => {
            // Response status code should be 400
            it('Response status code should be 400', async () => {
                const res = await request(app)
                    .get(`/v1/players?isAdmin=isAdmin`)
                expect(res.status).toBe(StatusCode.E400)

            })

            // Response -> data should be null
            it('Response -> data should be null', async () => {
                const res = await request(app)
                    .get(`/v1/players?isAdmin=isAdmin`)
                expect(res.body.data).toBe(null)
            })

            // response should have message: 'Necessary params NOT provided or invalid data'
            it(`Response -> message should be 'Necessary params NOT provided or invalid data'`, async () => {
                const res = await request(app)
                    .get(`/v1/players?isAdmin=isAdmin`)
                expect(res.body.message).toBe(Message.ErrParams)
            })
        })

        it('Should return 500 when db is lost', async () => {
            const mockQueryBuilder = {
                select: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockRejectedValue(new Error('Simulated DB Error')),
                getCount: jest.fn().mockResolvedValue(0),
            }

            jest.spyOn(AppDataSource.getRepository(User), 'createQueryBuilder')
                .mockReturnValue(mockQueryBuilder as any)

            const res = await request(app).get('/v1/players?isAdmin=true')

            expect(res.status).toBe(StatusCode.E500)
            expect(res.body.message).toBe(Message.ServerError)
        })
    })


    describe('GET - a player by player ID', () => {
        let playerId: string

        beforeEach(async () => {
            const existingPlayer = await AppDataSource.getRepository(User)
                .createQueryBuilder('user')
                .select(['user.id'])
                .getOne()

            if(!existingPlayer){
                playerId = 'fake-id'
            }else{
                playerId = existingPlayer.id
            }
        })

        describe('isAdmin is true', () => {
            const isAdmin = true
            // Response status code should be 200
            it('Response status code should be 200', async () => {
                const res = await request(app)
                    .get(`/v1/players/${playerId}?isAdmin=${isAdmin}`)
                expect(res.status).toBe(StatusCode.E200)

            })

            // Response -> data -> the player should have firstName, lastName, and age
            it('Response -> data -> the player should have firstName, lastName, and age', async () => {
                const res = await request(app)
                    .get(`/v1/players/${playerId}?isAdmin=${isAdmin}`)

                // player should have firstName, lastName, and age
                expect(res.body.data.player).toHaveProperty('firstName')
                expect(res.body.data.player).toHaveProperty('lastName')
                expect(res.body.data.player).toHaveProperty('age')

            })

            // Response ->  message: 'OK'
            it(`Response ->  message: 'OK'`, async () => {
                const res = await request(app)
                    .get(`/v1/players/${playerId}?isAdmin=${isAdmin}`)
                expect(res.body.message).toBe(Message.OK)
            })

            describe('Player ID not exist', () => {
                // Response status code should be 400
                it('Response status code should be 400', async () => {
                    const res = await request(app)
                        .get(`/v1/players/${playerId}`)
                    expect(res.status).toBe(StatusCode.E400)
                })

                // response should have message: 'Necessary params NOT provided or invalid data'
                it(`Response -> message should be 'Necessary params NOT provided or invalid data'`, async () => {
                    const res = await request(app)
                        .get(`/v1/players/${playerId}`)
                    expect(res.body.message).toBe(Message.ErrParams)
                })
            })
        })

        describe('isAdmin is false', () => {
            const isAdmin = false
            // Response status code should be 200
            it('Response status code should be 200', async () => {
                const res = await request(app)
                    .get(`/v1/players/${playerId}?isAdmin=${isAdmin}`)
                expect(res.status).toBe(StatusCode.E200)
            })

            // Response -> data -> the player should have firstName and age
            it('Response -> data -> playerList should be an array, each item should have firstName and age', async () => {
                const res = await request(app)
                    .get(`/v1/players/${playerId}?isAdmin=${isAdmin}`)


                // player should have firstName, lastName, and age
                expect(res.body.data.player).toHaveProperty('firstName')
                expect(res.body.data.player).not.toHaveProperty('lastName')
                expect(res.body.data.player).toHaveProperty('age')
            })

            // Response -> data -> count should be number
            it('Response -> data -> count should be number', async () => {
                const res = await request(app)
                    .get(`/v1/players?isAdmin=${isAdmin}`)

                // count should be number
                expect(typeof res.body.data.count).toBe('number')
            })

            // Response ->  message: 'OK'
            it(`Response ->  message: 'OK'`, async () => {
                const res = await request(app)
                    .get(`/v1/players?isAdmin=${isAdmin}`)
                expect(res.body.message).toBe(Message.OK)
            })
        })

        describe('isAdmin not exist', () => {
            // Response status code should be 400
            it('Response status code should be 400', async () => {
                const res = await request(app)
                    .get(`/v1/players/${playerId}`)
                expect(res.status).toBe(StatusCode.E400)
            })

            // Response -> data should be null
            it('Response -> data should be null', async () => {
                const res = await request(app)
                    .get(`/v1/players`)
                expect(res.body.data).toBe(null)
            })

            // response should have message: 'Necessary params NOT provided or invalid data'
            it(`Response -> message should be 'Necessary params NOT provided or invalid data'`, async () => {
                const res = await request(app)
                    .get(`/v1/players/${playerId}`)
                expect(res.body.message).toBe(Message.ErrParams)
            })
        })

        describe('isAdmin is neither true nor false', () => {
            // Response status code should be 400
            it('Response status code should be 400', async () => {
                const res = await request(app)
                    .get(`/v1/players/${playerId}?isAdmin=isAdmin`)
                expect(res.status).toBe(StatusCode.E400)

            })

            // Response -> data should be null
            it('Response -> data should be null', async () => {
                const res = await request(app)
                    .get(`/v1/players?isAdmin=isAdmin`)
                expect(res.body.data).toBe(null)
            })

            // response should have message: 'Necessary params NOT provided or invalid data'
            it(`Response -> message should be 'Necessary params NOT provided or invalid data'`, async () => {
                const res = await request(app)
                    .get(`/v1/players?isAdmin=isAdmin`)
                expect(res.body.message).toBe(Message.ErrParams)
            })
        })

        it('Should return 500 when db is lost', async () => {
            const mockQueryBuilder = {
                select: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockRejectedValue(new Error('Simulated DB Error')),
                getCount: jest.fn().mockResolvedValue(0),
            }

            jest.spyOn(AppDataSource.getRepository(User), 'createQueryBuilder')
                .mockReturnValue(mockQueryBuilder as any)

            const res = await request(app).get('/v1/players/${playerId}?isAdmin=true')

            expect(res.status).toBe(StatusCode.E500)
            expect(res.body.message).toBe(Message.ServerError)
        })
    })
})

