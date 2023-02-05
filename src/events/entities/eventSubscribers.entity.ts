import {Column, Entity, PrimaryColumn} from "typeorm"

@Entity()
export class EventSubscribers {
    @PrimaryColumn()
    usersId: number

    @PrimaryColumn()
    eventId: number

    @Column({nullable: true})
    jobId: string
}