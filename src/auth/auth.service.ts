import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    hashData(data: string){
        return bcrypt.hash(data, 10)
    }
    
    async sinupLocal(dto: AuthDto){
        const hash = await this.hashData(dto.password)
        const newUser = this.usersService.create({
            email: dto.email,
            hash
        });
    }
    sininLocal(){}
    logout(){}
    refreshTokens(){}
}
