import {QueryRunner} from "typeorm";
import AppDataSource from "../data-source";


const setupTestIntegrationTest = () => {
    let queryRunner: QueryRunner

    beforeAll(async () => {
        await AppDataSource.initialize()

    })

    afterAll(async () => {
        await AppDataSource.destroy()
    })

    beforeEach(async () => {
        queryRunner = AppDataSource.createQueryRunner()
        await queryRunner.startTransaction()
    })

    afterEach(async () => {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
    })

    beforeEach(() => {
        jest.restoreAllMocks();
    })
}

export default setupTestIntegrationTest
