import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/tokens.type';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './types/jwtPayload.type';
import { RefreshTokens } from './entitys/tokens.entity';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
        @Inject(ConfigService) private config: ConfigService
    ) {}

    async findOneByEmail(email: string){
      const user = await this.usersRepository.findOneBy({email:email})

      return user;
    }

    hashData(data: string){
        return bcrypt.hash(data, 3)
    }

    async signupLocal(dto: AuthDto){ // to registration
      const HashPassword = await this.hashData(dto.password)
      const DoesExist = await this.findOneByEmail(dto.email)

      if (DoesExist){
        throw new UnauthorizedException('user already exists')
      }

      const newUser = await this.usersRepository.save({
          email: dto.email,
          password: HashPassword,
        }
      );

        const tokens = await this.getTokens(newUser.id, newUser.email)
        const HashToken = await this.hashData(tokens.refresh_token);
        newUser.token = HashToken
        await this.usersRepository.save(newUser);
        
        return tokens;
     }

    async signinLocal(dto: AuthDto){ // to come in
      const user = await this.findOneByEmail(dto.email)
      if(!user)
        throw new UnauthorizedException('user does not exists')
      

      const comparePass = bcrypt.compare(dto.password, user.password)
      if (!comparePass)
        throw new UnauthorizedException('invalid password')
      
      const tokens = await this.getTokens(user.id, user.email)
      const HashToken = await this.hashData(tokens.refresh_token);
      user.token = HashToken
      await this.usersRepository.save(user);
      return tokens
    }

    async logout(userId: number){
      const user = await this.usersRepository.findOneBy({id: userId})
      console.log(user.email, user.id)
      if (user && user.token) {
        console.log(user)
        user.token = null
        console.log(user)
        await this.usersRepository.save(user);
      }

      return user
    }

    async refreshTokens(userId: number, rt: string){
      console.log(userId)
      const user = await this.usersRepository.findOneBy({id: userId});

      if (!user || !user.token) throw new ForbiddenException('Access Denied. User not found');
    
      const rtMatches = await bcrypt.compare(rt,user.token);
      // console.log(rt)
      // console.log(user.token, user.id)
      // console.log(rtMatches)
  
      if (!rtMatches) throw new ForbiddenException('Access Denied');
    
      const tokens = await this.getTokens(user.id, user.email);
      const HashToken = await this.hashData(tokens.refresh_token);
      user.token = HashToken
      await this.usersRepository.save(user);
    
      return tokens;
  }
    
    async getTokens(userId: number, email: string): Promise<Tokens> {

      const jwtPayload: JwtPayload = {
          sub: userId,
          email: email,
        };

      // console.log(this.config.get<string>("jwt_access.secret"))
      // console.log(this.config.get<string>("jwt_access.expiresIn"))
      // console.log(this.config.get<string>("jwt_refresh.secret"))
      // console.log(this.config.get<string>("jwt_refresh.expiresIn"))

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
