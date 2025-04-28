
import { Request, Response } from 'express';
import { validate } from 'class-validator';
import {Message, StatusCode} from "../../../utils/enums";
import AppDataSource from "../../../data-source";
import AIController from "../../../controller/AIController";
import axios from "axios";

// mock validate()
jest.mock('class-validator', () => ({
    ...jest.requireActual('class-validator'),
    validate: jest.fn(),
}));

// mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>


describe('AIController - Unit Test', () => {
    let req: Partial<Request>
    let res: Partial<Response>
    let sendMock: jest.Mock

    describe('generate nickname', () => {
        beforeEach(() => {
            sendMock = jest.fn()
            req = { body: {} }
            res = {
                status: jest.fn().mockReturnThis(),
                send: sendMock,
            }
        })

        afterEach(() => {
            jest.restoreAllMocks()
        })

        it('should return 400 if DTO validation fails', async () => {
            req.body = {};

            (validate as jest.Mock).mockResolvedValue([{}])

            await AIController.generateNickname(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(StatusCode.E400)
            expect(sendMock).toHaveBeenCalledWith({
                data: null,
                message: Message.ErrParams,
            })
        })

        it('should return 200 when country is valid', async () => {
            req.body = { country: 'Canada' };

            (validate as jest.Mock).mockResolvedValue([])

            mockedAxios.post.mockResolvedValue({
                data: {
                    content: 'MapleWolf'
                }
            })

            await AIController.generateNickname(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(StatusCode.E200)
            expect(sendMock).toHaveBeenCalledWith({
                data: { nickname: 'MapleWolf' },
                message: Message.OK,
            })
        })


        it('should return 500 if query fails', async () => {
            req.body = { country: 'Canada' }

            mockedAxios.post.mockRejectedValue(new Error('LLM Server Error'))

            await AIController.generateNickname(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(StatusCode.E500)
            expect(sendMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: Message.ServerError,
                })
            )
        })
    })

})
