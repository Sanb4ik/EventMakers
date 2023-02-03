import { Entity, PrimaryColumn } from "typeorm"

@Entity({name: 'uuuu'})
export class EventSubscribers {
    @PrimaryColumn()
    usersId: number

    @PrimaryColumn()
    eventId: number
}