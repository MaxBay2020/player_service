import request from 'supertest'
import app from "../../index";
import {Message, StatusCode} from "../../utils/enums";

jest.setTimeout(20000)

describe('AI APIs', () => {
    describe('GET /v1/players/generate-nickname', () => {
        it('Should return 200', async () => {
            const res = await request(app)
                .post('/v1/players/generate-nickname')
                .send({
                    country: 'Canada'
                })

            expect(res.status).toBe(StatusCode.E200)
        })

        it('Should return a nickname from Canada', async () => {
            const res = await request(app)
                .post('/v1/players/generate-nickname')
                .send({
                    country: 'Canada'
                })

            expect(res.body.data.nickname).toBeDefined()
            expect(typeof res.body.data.nickname).toBe('string')
        })


        it('Should return 400 when country is missing', async () => {
            const res = await request(app)
                .post('/v1/players/generate-nickname')
                .send({})

            expect(res.status).toBe(StatusCode.E400)
            expect(res.body.data).toBe(null)
            expect(res.body.message).toBe(Message.ErrParams)
        })

        it('Should return 400 when country is NOT a string', async () => {
            const res = await request(app)
                .post('/v1/players/generate-nickname')
                .send({
                    country: true
                })

            expect(res.status).toBe(StatusCode.E400)
            expect(res.body.data).toBe(null)
            expect(res.body.message).toBe(Message.ErrParams)
        })
    })
})

