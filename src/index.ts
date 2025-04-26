import express, {Express, NextFunction, Request, Response} from 'express'
import bodyParser from 'body-parser'
import AppDataSource from "./data-source";
import cors from "cors";
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import indexRoute from "./routes/indexRoute";



const app: Express = express()
dotenv.config()
app.use(cookieParser())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
}))

// routes
app.use('/', indexRoute)


// error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({
        message: 'Internal Server Error',
    });
});


const startServer = async () => {

    try {
        await AppDataSource.initialize()
    }catch(e){
        console.log(e.message)
    }




    const port = Number(process.env.PORT) || 8000
    app.listen(port, () => {
        console.log(`SERVER IS RUNNING at http://localhost:${port}!`)
    })
}

// only run server when this file is running directly
// in testing mode, it will NOT run startServer() function
if (require.main === module) {
    startServer()
}


export default app