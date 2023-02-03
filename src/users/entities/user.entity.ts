import { RefreshTokens } from "src/auth/entitys/tokens.entity";
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {EventEntity} from "../../events/entities/event.entity";

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

    @OneToMany(() => EventEntity, (event) => event.user)
    events: EventEntity[]
}
