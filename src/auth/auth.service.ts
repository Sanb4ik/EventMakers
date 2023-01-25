import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './types';
import { ConfigService } from '@nestjs/config';
import {RefreshTokens} from "./entitys/tokens.entity";


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
        @InjectRepository(RefreshTokens) private tokensRepository: Repository<RefreshTokens>,
        @Inject(ConfigService) private config: ConfigService
    ) {}

    hashData(data: string){
        return bcrypt.hash(data, 3)
    }

    async signupLocal(dto: AuthDto){ // to registration
      const HashPassword = await this.hashData(dto.password)

      const user = await this.usersRepository.findOneBy({
              email:dto.email
      })
        console.log(user)

      if (user){
        throw new UnauthorizedException('user already exists')
      }

      const refreshToken = await this.tokensRepository.save({refreshToken: ""})

      const newUser = await this.usersRepository.save({
          email: dto.email,
          password: HashPassword,
          token: refreshToken
        }
      );

        const tokens = await this.getTokens(newUser.id, newUser.email)
        const rt_hash = await this.hashData(tokens.refresh_token);
        await this.tokensRepository.update(refreshToken, {refreshToken: rt_hash});
        
        return tokens;
     }

    async signInLocal(dto: AuthDto){ // to come in
      const user = await this.usersRepository.findOne({
          relations:{
              token: true
          },
          where:{
              email:dto.email
          }
      })

      if(!user)
        throw new UnauthorizedException('user does not exists')
      

      const comparePass = bcrypt.compare(dto.password, user.password)
      if (!comparePass)
        throw new UnauthorizedException('invalid password')
      
      const tokens = await this.getTokens(user.id, user.email)
      const rt_Hash = await this.hashData(tokens.refresh_token)
      await this.tokensRepository.update(user.token, {refreshToken: rt_Hash});
      return tokens
    }

    async logout(userId: number){

      const user = await this.usersRepository.findOne({
          relations:{
              token:true,
          },
          where:{
              id:userId
          }
      })

      console.log(user.email, user.id)

      if (user && user.token) {
        await this.tokensRepository.update(user.token,{refreshToken: ""});
      }

      return user
    }

    async refreshTokens(userId: number, rt: string){
      console.log(userId)
      const user = await this.usersRepository.findOne({
          relations:{
              token:true,
          },
          where:{
              id:userId
          }
      })

        console.log(user)

      if (!user || !user.token) throw new ForbiddenException('Access Denied. User not found');
    
      const rtMatches = await bcrypt.compare(rt,user.token.refreshToken);
      // console.log(rt)
      // console.log(user.token, user.id)
      // console.log(rtMatches)
  
      if (!rtMatches) throw new ForbiddenException('Access Denied');
    
      const tokens = await this.getTokens(user.id, user.email);
      const rt_hash = await this.hashData(tokens.refresh_token);
      await this.tokensRepository.update(user.token, {refreshToken: rt_hash});
    
      return tokens;
  }
    
    async getTokens(userId: number, email: string): Promise<Tokens> {

      const jwtPayload: JwtPayload = {
          sub: userId,
          email: email,
        };


      const [at, rt] = await Promise.all([
        this.jwtService.signAsync(jwtPayload, {
          secret: this.config.get<string>("jwt_access.secret"),
          expiresIn: this.config.get<string>("jwt_access.expiresIn")
        }),
        this.jwtService.signAsync(jwtPayload, {
          secret: this.config.get<string>("jwt_refresh.secret"),
          expiresIn: this.config.get<string>("jwt_refresh.expiresIn"),
        }),
      ]);
    
      return {
        access_token: at,
        refresh_token: rt,
      };
    }
}
