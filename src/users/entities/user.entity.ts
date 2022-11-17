import { Refresh_tokens } from "src/auth/entitys/tokens.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(() => Refresh_tokens)
    @JoinColumn()
    refresh_token: string;
}
