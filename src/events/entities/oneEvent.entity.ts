
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OneEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ type: 'date' })
    dateOnly: string;

    @Column({ type: 'time' })
    timeOnly: string;
}