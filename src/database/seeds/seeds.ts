import {Seeder, SeederFactoryManager} from "typeorm-extension";
import {DataSource} from "typeorm";
import User from "../../entities/User";
import Team from "../../entities/Team";
import UserRole from "../../entities/UserRole";
import {UserRoleEnum} from "../../utils/enums";


export default class Seed implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {


        const users = await factoryManager.get(User).saveMany(10)
        const teams = await factoryManager.get(Team).saveMany(3)
        const roles = [UserRoleEnum.ADMIN, UserRoleEnum.PLAYER]

        await Promise.all(roles.map(role => {
            const newRole = UserRole.create({
                name: role
            })
            return newRole.save()
        }))

    }
}