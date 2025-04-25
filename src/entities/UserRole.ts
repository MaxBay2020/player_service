import
{Entity, Column, OneToMany} from 'typeorm'
import User from "./User";
import BaseClass from "./BaseClass";
import {UserRoleEnum} from "../utils/enums";


@Entity()
class UserRole extends BaseClass {

    @Column({
        nullable: true,
        default: ''
    })
    userRoleName: UserRoleEnum

    @OneToMany(() => User, user => user.userRole)
    users: User[]
}

export default UserRole