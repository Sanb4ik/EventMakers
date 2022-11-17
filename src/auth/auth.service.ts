import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './types/jwtPayload.type';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(User) private usersRepository: Repository<User>,
        ) {}

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
   
    async refreshTokens(userId: number, rt: string): Promise<Tokens> {
        const user = await this.usersRepository.findOne({
          where: {
            id: userId,
          },
        });

        if (!user || !user.refresh_token) throw new ForbiddenException('Access Denied');
    
        const rtMatches = await bcrypt.compare(user.refresh_token, rt);
        if (!rtMatches) throw new ForbiddenException('Access Denied');
    
        const tokens = await this.getTokens(user.id, user.name);
        await this.updateRtHash(user.id, tokens.refresh_token);
    
        return tokens;
      }
    
      async updateRtHash(userId: number, rt: string): Promise<void> {
        const hash = await bcrypt.hash(rt,10);
        const user = await this.usersRepository.findOne({where: {id: userId}});
        user.refresh_token = hash;
        await this.usersRepository.save(user);
    
      }
    
      async getTokens(userId: number, email: string): Promise<Tokens> {
        const jwtPayload: JwtPayload = {
          sub: userId,
          email: email,
        };
    
        const [at, rt] = await Promise.all([
          this.jwtService.signAsync(jwtPayload, {
            secret: 'AT_SECRET',
            expiresIn: '15m',
          }),
          this.jwtService.signAsync(jwtPayload, {
            secret: 'RT_SECRET',
            expiresIn: '7d',
          }),
        ]);
    
        return {
          access_token: at,
          refresh_token: rt,
        };
      }
}
