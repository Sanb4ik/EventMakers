import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Refresh_tokens {
    @PrimaryColumn()
    id: number;

    @Column()
    refresh_token: string;
}
