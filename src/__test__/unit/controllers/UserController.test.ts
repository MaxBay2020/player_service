
import { Request, Response } from 'express';
import { validate } from 'class-validator';
import UserController from "../../../controller/UserController";
import {Message, StatusCode} from "../../../utils/enums";
import AppDataSource from "../../../data-source";

// mock validate()
jest.mock('class-validator', () => ({
    ...jest.requireActual('class-validator'),
    validate: jest.fn(),
}));

// mock getRepository()
jest.mock('../../../data-source', () => ({
    // its a ES module
    __esModule: true,
    default: {
        getRepository: jest.fn(),
    },
}))

// mock queryBuilder
const mockQueryBuilder = () => {
    const qb: any = {
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
        getCount: jest.fn(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
    }
    return qb
}

describe('UserController - Unit Test', () => {
    let req: Partial<Request>
    let res: Partial<Response>
    let sendMock: jest.Mock

    describe('queryAllPlayers', () => {
        beforeEach(() => {
            sendMock = jest.fn()
            req = { query: {} }
            res = {
                status: jest.fn().mockReturnThis(),
                send: sendMock,
            }
        })

        afterEach(() => {
            jest.restoreAllMocks()
        })

        it('should return 400 if DTO validation fails', async () => {
            (validate as jest.Mock).mockResolvedValue([{}])

            await UserController.queryAllPlayers(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(StatusCode.E400)
            expect(sendMock).toHaveBeenCalledWith({
                data: null,
                message: Message.ErrParams,
            })
        })

        it('should return 200 with correct fields when isAdmin=true', async () => {
            req.query = { isAdmin: 'true' };
            (validate as jest.Mock).mockResolvedValue([])

            const qb = mockQueryBuilder();

            (AppDataSource.getRepository as jest.Mock).mockReturnValue({
                createQueryBuilder: jest.fn()
                    .mockReturnValueOnce(qb)
                    .mockReturnValueOnce(qb),
            })

            qb.getMany.mockResolvedValue([
                { firstName: 'John', lastName: 'Doe', age: 30 },
            ])
            qb.getCount.mockResolvedValue(1)

            await UserController.queryAllPlayers(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(StatusCode.E200)
            expect(sendMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        playerList: expect.any(Array),
                        count: 1,
                    }),
                    message: Message.OK,
                })
            )
        })

        it('should return 200 with correct fields when isAdmin=false', async () => {
            req.query = { isAdmin: 'false' };
            (validate as jest.Mock).mockResolvedValue([])

            const qb = mockQueryBuilder();

            (AppDataSource.getRepository as jest.Mock).mockReturnValue({
                createQueryBuilder: jest.fn()
                    .mockReturnValueOnce(qb)
                    .mockReturnValueOnce(qb),
            })

            qb.getMany.mockResolvedValue([
                { firstName: 'John', age: 30 },
            ])
            qb.getCount.mockResolvedValue(1)

            await UserController.queryAllPlayers(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(StatusCode.E200)
            expect(sendMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        playerList: expect.any(Array),
                        count: 1,
                    }),
                    message: Message.OK,
                })
            )
        })

        it('should return 500 if query fails', async () => {
            req.query = { isAdmin: 'true' };
            (validate as jest.Mock).mockResolvedValue([])

            const qb = mockQueryBuilder();

            (AppDataSource.getRepository as jest.Mock).mockReturnValue({
                createQueryBuilder: jest.fn()
                    .mockReturnValueOnce(qb)
                    .mockReturnValueOnce(qb),
            })

            qb.getMany.mockRejectedValue(new Error('DB error'))

            await UserController.queryAllPlayers(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(StatusCode.E500)
            expect(sendMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: Message.ServerError,
                })
            )
        })
    })

    describe('queryPlayerByPlayerId', () => {
        beforeEach(() => {
            sendMock = jest.fn();
            req = { params: {}, query: {} }
            res = {
                status: jest.fn().mockReturnThis(),
                send: sendMock,
            }
        })

        afterEach(() => {
            jest.restoreAllMocks()
        })

        it('should return 400 if DTO validation fails', async () => {
            req.params = { playerId: 'fake-id' };
            (validate as jest.Mock).mockResolvedValue([{}])

            await UserController.queryPlayerByPlayerId(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(StatusCode.E400)
            expect(sendMock).toHaveBeenCalledWith({
                data: null,
                message: Message.ErrParams,
            })
        })

        it('should return 200 with correct fields when isAdmin=true', async () => {
            req.params = { playerId: 'player-id-123' }
            req.query = { isAdmin: 'true' };
            (validate as jest.Mock).mockResolvedValue([])

            const qb = mockQueryBuilder();

            (AppDataSource.getRepository as jest.Mock).mockReturnValue({
                createQueryBuilder: jest.fn().mockReturnValue(qb)
            })

            qb.getOne.mockResolvedValue({
                firstName: 'John',
                lastName: 'Doe',
                age: 25,
            })


            await UserController.queryPlayerByPlayerId(req as Request, res as Response)

            expect(qb.select).toHaveBeenCalledWith(
                expect.arrayContaining(['user.firstName', 'user.lastName', 'user.age'])
            )
            expect(res.status).toHaveBeenCalledWith(StatusCode.E200)
        })

        it('should return 200 with correct fields when isAdmin=false', async () => {
            req.params = { playerId: 'player-id-123' }
            req.query = { isAdmin: 'false' };
            (validate as jest.Mock).mockResolvedValue([])

            const qb = mockQueryBuilder();
            qb.getOne.mockResolvedValue({
                firstName: 'John',
                age: 25,
            });

            (AppDataSource.getRepository as jest.Mock).mockReturnValue({
                createQueryBuilder: jest.fn().mockReturnValue(qb),
            })

            await UserController.queryPlayerByPlayerId(req as Request, res as Response)

            expect(qb.select).toHaveBeenCalledWith(
                expect.arrayContaining(['user.firstName', 'user.age'])
            )
            expect(res.status).toHaveBeenCalledWith(StatusCode.E200)
        })

        it('should return 200 with correct player data', async () => {
            req.params = { playerId: 'player-id-123' }
            req.query = { isAdmin: 'true' };
            (validate as jest.Mock).mockResolvedValue([])

            const qb = mockQueryBuilder()
            qb.getOne.mockResolvedValue({
                firstName: 'John',
                lastName: 'Doe',
                age: 22,
            });

            (AppDataSource.getRepository as jest.Mock).mockReturnValue({
                createQueryBuilder: jest.fn().mockReturnValue(qb),
            })

            await UserController.queryPlayerByPlayerId(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(StatusCode.E200)
            expect(sendMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        player: expect.any(Object),
                    }),
                    message: Message.OK,
                })
            )
        })

        it('should return 500 when DB query fails', async () => {
            req.params = { playerId: 'player-id-123' }
            req.query = { isAdmin: 'true' };
            (validate as jest.Mock).mockResolvedValue([])

            const qb = mockQueryBuilder();

            (AppDataSource.getRepository as jest.Mock).mockReturnValue({
                createQueryBuilder: jest.fn().mockReturnValue(qb),
            })
            qb.getOne.mockRejectedValue(new Error('DB Error'))

            await UserController.queryPlayerByPlayerId(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(StatusCode.E500)
            expect(sendMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: Message.ServerError,
                })
            )
        })
    })

})
