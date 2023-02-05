import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Users} from "../../users/entities/user.entity";

@Entity()
export class EventEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ type: "date" })
    dateOnly: string;

    @Column({ type: "time"})
    timeOnly: string;

    @Column({nullable: false, default: 1})
    subscribers: number;


    @ManyToOne(() => Users, (user) => user.events)
    user: Users
}