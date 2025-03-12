import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto, CreateUserDto } from "src/users/users.dto";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller ('auth')
export class AuthController {
    constructor (private readonly authService: AuthService){}

    @ApiOperation({summary: 'Sign up'})
    @ApiBody({type: CreateUserDto})
    @Post('signup')
    async signUp(@Body() user: CreateUserDto) {
        return await this.authService.signUp(user);
    }

    @ApiOperation({summary: 'Sign in'})
    @ApiBody({type: LoginUserDto})
    @Post('signin')
    async SignIn(@Body() credentials : LoginUserDto){
        const { email , password } = credentials;
        return await this.authService.SignIn(email, password);
    }
}