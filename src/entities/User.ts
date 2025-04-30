import {Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable} from "typeorm"
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
        nullable: true,
        unique: true
    })
    @IsString()
    @IsEmail()
    email: string

    @Column({
        nullable: true
    })
    @IsString()
    password: string

    @ManyToOne(() => UserRole, userRole => userRole.users)
    userRole: UserRole

    @ManyToMany(() => User, user => user.players)
    @JoinTable()
    managers: User[]

    @ManyToMany(() => User, user => user.managers)
    players: User[]

    @ManyToMany(() => Team, team => team.users)
    @JoinTable()
    teams: Team[]

}

export default User
