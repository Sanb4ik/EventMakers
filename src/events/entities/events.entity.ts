import {
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn, ManyToOne,
} from "typeorm"
import { OneEvent } from "./oneEvent.entity"
import { Users } from "../../users/entities/user.entity"

@Entity()
export class Events {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => OneEvent)
    @JoinColumn()
    event: OneEvent

    @ManyToOne(() => Users, (user) => user.events)
    user: Users
}