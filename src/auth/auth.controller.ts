import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { AuthService } from './services/auth.service';
import { SendOTPDto } from './dto/send-otp.dto';
import { OtpService } from './services/otp.service';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from './guards/access-token.guard';
import { AuthTokens } from './types/auth-tokens.type';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './services/token.service';
import { NormalUserGuard } from './guards/normal-user.guard';

@Controller('auth')
@ApiSecurity('apiKey')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService
  ) {}

  @Post('send-otp')
  async sendOtpCode(@Req() req, @Body() body: SendOTPDto) {
    await this.otpService.sendOtp(body.phoneNumber);
    return {
      message: 'Otp code has been sent successfully.'
    };
  }

  @Post('register')
  async registerUser(@Req() req, @Body() body: RegisterDto) {
    await this.authService.registerUser(body);
    return { message: 'Successfully created new user' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req, @Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('hello-world')
  @UseGuards(AccessTokenGuard, NormalUserGuard)
  async helloWorld(@Req() req) {
    return { message: 'success', request: JSON.stringify(req) };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('logout')
  @ApiBearerAuth()
  async logout(@Req() req) {
    const userId = req.user.id;
    const refreshToken = req.headers['authorization'].slice(7);
    await this.authService.logout(userId, refreshToken);
    return {
      message: 'user has signed out successfully.'
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiBearerAuth()
  async refreshTokens(@Req() req): Promise<AuthTokens> {
    const refreshToken = req.headers['authorization'].slice(7);
    return this.tokenService.refreshTokens(refreshToken);
  }
}
