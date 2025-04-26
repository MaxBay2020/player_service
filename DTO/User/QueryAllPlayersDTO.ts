
import {IsBoolean} from "class-validator";
import {Transform, Type} from "class-transformer";

class QueryAllPlayersDTO {
    constructor(isAdmin: boolean) {
        this.isAdmin = isAdmin
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

}

export default QueryAllPlayersDTO
