import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        type: String,
        example: "sasha@gmail.com",
    })
    @IsEmail()
    email:string;

    @ApiProperty({
        type: String,
        example: "qwerty1234",
    })
    @IsNotEmpty()
    @IsString()
    password:string;
}
