import AppDataSource from "../data-source"
import {Request, Response} from "express"
import QueryAllPlayersDTO from "../DTO/User/QueryAllPlayersDTO";
import {plainToInstance} from "class-transformer"
import {validate} from "class-validator";
import User from "../entities/User";
import Log, {Message, StatusCode} from "../utils/enums";

class UserController {

    /***
     * query all players based on isAdmin in query
     * @param req
     * @param res
     */
    static queryAllPlayers = async (req: Request, res: Response): Promise<void> => {

        // DTO validation
        const queryAllPlayersDTO = plainToInstance(QueryAllPlayersDTO, req.query)

        const errors = await validate(queryAllPlayersDTO)

        // if not pass validation of DTO
        if (errors.length > 0) {
            const log = new Log<null>(null, StatusCode.E400, Message.ErrParams)
            res.status(log.statusCode).send({
                data: log.data,
                message: log.message
            })

            return
        }

        const { isAdmin } = queryAllPlayersDTO


        const fieldsSelected = ['user.firstName']

        if(isAdmin){
            fieldsSelected.push('user.lastName')
        }

        try{
            const [playerList, count]: [User[], number] = await Promise.all([
                AppDataSource.getRepository(User)
                    .createQueryBuilder('user')
                    .select([
                        ...fieldsSelected,
                        'user.age'
                    ])
                    .getMany(),
                AppDataSource.getRepository(User)
                    .createQueryBuilder('user')
                    .getCount(),
            ])


            const log = new Log<{}>({ playerList, count }, StatusCode.E200, Message.OK)
            res.status(log.statusCode).send({
                data: log.data,
                message: log.message
            })
            return
        }catch (e) {
            console.log(e.message)
            const log = new Log<{}>(e, StatusCode.E500, Message.ServerError)
            res.status(log.statusCode).send({
                data: log.data,
                message: log.message
            })
            return
        }
    }

    /***
     * query player based on isAdmin in query
     * @param req
     * @param res
     */
    static queryPlayerByPlayerId = async (req: Request, res: Response): Promise<void> => {

        const { playerId } = req.params

        // DTO validation
        const queryAllPlayersDTO = plainToInstance(QueryAllPlayersDTO, {
            ...req.query,
            playerId
        })

        const errors = await validate(queryAllPlayersDTO)

        // if not pass validation of DTO
        if (errors.length > 0) {
            const log = new Log<null>(null, StatusCode.E400, Message.ErrParams)
            res.status(log.statusCode).send({
                data: log.data,
                message: log.message
            })

            return
        }

        const { isAdmin } = queryAllPlayersDTO


        const fieldsSelected = ['user.firstName']

        if(isAdmin){
            fieldsSelected.push('user.lastName')
        }

        try{
            const player = await AppDataSource.getRepository(User)
                .createQueryBuilder('user')
                .select([
                    ...fieldsSelected,
                    'user.age'
                ])
                .where('user.id = :playerId', { playerId })
                .getOne()


            const log = new Log<{}>({ player }, StatusCode.E200, Message.OK)
            res.status(log.statusCode).send({
                data: log.data,
                message: log.message
            })
            return
        }catch (e){
            console.log(e.message)
            const log = new Log<{}>(e, StatusCode.E500, Message.ServerError)
            res.status(log.statusCode).send({
                data: log.data,
                message: log.message
            })
            return
        }
    }

}

export default UserController
