import { Router } from 'express'
import v1Route from "./v1Route";

const indexRoute = Router()

indexRoute.use('/v1', v1Route)

export default indexRoute
