import {Entity, Column, ManyToOne, OneToMany} from "typeorm"
import {IsEmail, IsNumber, IsString, Max, Min} from "class-validator";
import Statistic from "./Statistic";
import UserRole from "./UserRole";
import Team from "./Team";

@Entity()
class User extends Statistic{
    @Column()
    @IsString()
    firstName: string

    @Column()
    @IsString()
    lastName: string

    @Column()
    @IsNumber()
    @Min(18)
    @Max(99)
    age: number

    @Column({
        unique: true
    })
    @IsString()
    @IsEmail()
    email: string

    @Column({
        nullable: false
    })
    @IsString()
    password: string

    @ManyToOne(() => UserRole, userRole => userRole.users)
    userRole: UserRole

    @ManyToOne(() => User, user => user.players)
    manager: User

    @OneToMany(() => User, user => user.manager)
    players: User[]

    @ManyToOne(() => Team, team => team.user)
    team: Team

}

export default User
