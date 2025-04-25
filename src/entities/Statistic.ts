
import {Column} from "typeorm"
import { IsString} from "class-validator";
import BaseClass from "./BaseClass";

class Statistic extends BaseClass{
    @Column()
    @IsString()
    battingStatistics: string

    @Column()
    @IsString()
    fieldingStatistics: string

    @Column()
    @IsString()
    pitchingStatistics: string

}

export default Statistic