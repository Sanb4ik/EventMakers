import { RefreshTokens } from "src/auth/entitys/tokens.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;
    
    @Column({ nullable: true })
    token: string;

}
