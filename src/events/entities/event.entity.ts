import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Users} from "../../users/entities/user.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class EventEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty({
        type: Number,
        description: "Event id in postgres"
        }
    )
    id: number;

    @ApiProperty({
        type: String,
        example: "Nestjs",
    })
    @Column()
    title: string;

    @ApiProperty({
        type: String,
        example: "is a framework for building efficient, scalable Node.js server-side applications.",
    })
    @Column()
    description: string;

    @ApiProperty({
        type: String,
        example: '2023-02-08',
    })
    @Column({ type: "date" })
    dateOnly: string;

    @ApiProperty({
        type: String,
        example: "10:30",
    })
    @Column({ type: "time"})
    timeOnly: string;

    @ApiProperty({
        type: Number,
        description: "Users who subscribed on the event",
        example: 17,
    })
    @Column({nullable: false, default: 1})
    subscribers: number;

    @ApiProperty({
        type: Number,
        description: "User who created the event",
        example: 7,
    })
    @ManyToOne(() => Users, (user) => user.events)
    user: Users
}