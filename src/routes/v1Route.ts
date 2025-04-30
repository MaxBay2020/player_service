import { Router } from 'express'
import UserController from "../controller/UserController";
import AIController from "../controller/AIController";

const v1Route = Router()

v1Route.get('/players', UserController.queryAllPlayers)
v1Route.get('/players/:playerId', UserController.queryPlayerByPlayerId)
v1Route.post('/players/generate-nickname', AIController.generateNickname)

export default v1Route
