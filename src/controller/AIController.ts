import {Request, Response} from "express"
import Log, {Message, StatusCode} from "../utils/enums";
import axios from "axios";
import {cleanNickname, systemPrompt} from "../utils/utils";
import GenerateNicknameDTO from "../DTO/AI/GenerateNicknameDTO";
import {validate} from "class-validator";

class AIController {
    /***
     * generate nickname for a player based on country passed in
     * @param req
     * @param res
     */
    static generateNickname = async (req: Request, res: Response): Promise<void> => {
        const { country } = req.body

        try{

            // DTO validation
            const createNicknameDTO = new GenerateNicknameDTO(country)
            const errors = await validate(createNicknameDTO)

            // if not pass validation of DTO
            if (errors.length > 0) {
                const log = new Log<null>(null, StatusCode.E400, Message.ErrParams)
                res.status(log.statusCode).send({
                    data: log.data,
                    message: log.message
                })

                return
            }

            const userPrompt = `Suggest a cool player nickname for a player from ${country}.`

            const response = await axios.post('http://localhost:8001/chat', {
                system: systemPrompt,
                user: userPrompt
            })

            const nickname = cleanNickname(response.data.content)

            const log = new Log<{}>({ nickname }, StatusCode.E200, Message.OK)
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
}

export default  AIController
