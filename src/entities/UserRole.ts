import
{Entity, Column, OneToMany} from 'typeorm'
import User from "./User";
import BaseClass from "./BaseClass";
import {UserRoleEnum} from "../utils/enums";


@Entity()
class UserRole extends BaseClass {

    @Column({
        type: 'enum',
        enum: UserRoleEnum,
        unique: true,
        nullable: true,
        default: null
    })
    name: UserRoleEnum | null

    @OneToMany(() => User, user => user.userRole)
    users: User[]
}

export default UserRole