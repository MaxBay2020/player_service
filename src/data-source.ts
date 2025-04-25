import "reflect-metadata"
import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123456root",
    database: "Tangentia",
    synchronize: false,
    logging: false,
    entities: [],
    migrations: [],
    subscribers: [],
})

export default AppDataSource
