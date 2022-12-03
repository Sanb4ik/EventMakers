import { Users } from "src/users/entities/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RefreshTokens {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    refreshToken: string;
}
