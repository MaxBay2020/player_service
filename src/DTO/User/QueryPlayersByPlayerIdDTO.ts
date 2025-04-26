
import {IsBoolean, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";

class QueryPlayersByPlayerIdDTO {
    constructor(isAdmin: boolean, playerId: string) {
        this.isAdmin = isAdmin
        this.playerId = playerId
    }

    @IsBoolean()
    @Transform(({ value }) => {
        if(value.toLowerCase() === 'true')
            return true
        if(value.toLowerCase() === 'false')
            return false
        return value
    })
    isAdmin: boolean

    @IsString()
    playerId: string

}

export default QueryPlayersByPlayerIdDTO
