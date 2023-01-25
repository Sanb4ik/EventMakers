import { RefreshTokens } from "src/auth/entitys/tokens.entity";
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {Events} from "../../events/entities/events.entity";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;


    @OneToOne(() => RefreshTokens,{ nullable: true })
    @JoinColumn()
    token: RefreshTokens

    @OneToMany(() => Events, (Events) => Events.user)
    events: Events[]


}
