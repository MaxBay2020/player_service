import {Entity, Column, OneToMany} from "typeorm"
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

    @Column()
    @IsString()
    battingStatistics: string

    @Column()
    @IsString()
    fieldingStatistics: string

    @Column()
    @IsString()
    pitchingStatistics: string

    @OneToMany(() => User, user => user.team)
    user: User[]

}

export default Team
