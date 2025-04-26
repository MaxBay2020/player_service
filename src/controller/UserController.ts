import AppDataSource from "../data-source"
import { Request, Response } from "express"
import QueryAllPlayersDTO from "../../DTO/User/QueryAllPlayersDTO";
import {plainToInstance} from "class-transformer"
import {validate} from "class-validator";
import User from "../entities/User";

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
            // const error = new Error<null>(null, StatusCode.E400, Message.ErrParams)
            // res.status(error.statusCode).send({
            //     info: error.info,
            //     message: error.message
            // })

            res.status(400).send({
                message: `query wrong isAdmin: ${req.query.isAdmin}`
            })
            return
        }

        const { isAdmin } = queryAllPlayersDTO


        const fieldsSelected = ['user.firstName']

        if(isAdmin){
            fieldsSelected.push('user.lastName')
        }

        const [playserList, count]: [User[], number] = await Promise.all([
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


        res.status(200).send({
            data: {
                playserList,
                count
            }
        })
        return
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
            // const error = new Error<null>(null, StatusCode.E400, Message.ErrParams)
            // res.status(error.statusCode).send({
            //     info: error.info,
            //     message: error.message
            // })

            res.status(400).send({
                message: `query wrong isAdmin: ${req.query.isAdmin}`
            })
            return
        }

        const { isAdmin } = queryAllPlayersDTO


        const fieldsSelected = ['user.firstName']

        if(isAdmin){
            fieldsSelected.push('user.lastName')
        }

        const player = await AppDataSource.getRepository(User)
                .createQueryBuilder('user')
                .select([
                    ...fieldsSelected,
                    'user.age'
                ])
                .where('user.id = :playerId', { playerId })
                .getOne()


        res.status(200).send({
            data: {
                player
            }
        })
        return
    }

}

export default UserController
