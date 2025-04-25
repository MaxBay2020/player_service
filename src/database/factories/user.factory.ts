import { setSeederFactory } from "typeorm-extension";
import bcrypt from "bcrypt";
import User from "../../entities/User";


export default setSeederFactory (User, async faker => {
    const hashedPassword = await bcrypt.hashSync('123123', Number(process.env.PASSWORD_SALT_ROUNDS))

    const user = User.create({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number.int({ min: 18, max: 99 }),
        email: faker.internet.email(),
        password: hashedPassword,
        battingStatistics: '0',
        fieldingStatistics: '0',
        pitchingStatistics: '0'
    })
    return user
})
