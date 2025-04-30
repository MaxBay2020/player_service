import { setSeederFactory } from "typeorm-extension";
import Team from "../../entities/Team";


export default setSeederFactory (Team, async faker => {

    const team = Team.create({
        name: faker.company.name(),
        battingStatistics: '0',
        fieldingStatistics: '0',
        pitchingStatistics: '0'
    })
    return team
})
