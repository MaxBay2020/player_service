import {IsNotEmpty, IsString} from "class-validator";

class GenerateNicknameDTO {
    constructor(country: string) {
        this.country = country
    }

    @IsString()
    @IsNotEmpty()
    country: string
}

export default GenerateNicknameDTO
