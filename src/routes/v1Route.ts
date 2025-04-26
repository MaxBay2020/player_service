import { Router } from 'express'
import UserController from "../controller/UserController";

const v1Route = Router()

v1Route.get('/players', UserController.queryAllPlayers)
v1Route.get('/players/:playerId', UserController.queryPlayerByPlayerId)

export default v1Route
