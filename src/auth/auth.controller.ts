import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { refreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/local/singup')
    sinupLocal(@Body() dto: AuthDto){
        return this.authService.sinupLocal(dto)
    }

    @Post('/local/singin')
    sininLocal(){
        return this.authService.sininLocal()
    }

    @Post('/logout')
    logout(){
        return this.authService.logout()
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('/refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Req() req: Request){
        const user = req.user;
        return this.authService.refreshTokens(user['id'], user['refresh_token'])
    }
}
