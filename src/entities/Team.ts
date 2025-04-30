import {Entity, Column, OneToMany, ManyToMany} from "typeorm"
import {IsString} from "class-validator";
import Statistic from "./Statistic";
import User from "./User";

@Entity()
class Team extends Statistic{
    @Column({
        unique: true
    })
    @IsString()
    name: string

    @ManyToMany(() => User, user => user.teams)
    users: User[]

}

export default Team
