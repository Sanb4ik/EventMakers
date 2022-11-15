import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/local/singup')
    sinupLocal(@Body() dto: AuthDto){
        this.authService.sinupLocal(dto)
    }

    @Post('/local/singin')
    sininLocal(){
        this.authService.sininLocal()
    }

    @Post('/logout')
    logout(){
        this.authService.logout()
    }

    @Post('/refresh')
    refreshTokens(){
        this.authService.refreshTokens()
    }
}
