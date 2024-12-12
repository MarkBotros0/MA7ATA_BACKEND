import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { AuthTokens } from '../types/auth-tokens.type';
import { RegisterDto } from '../dto/register.dto';
import { OtpService } from './otp.service';
import { TokenService } from './token.service';
import { UserView } from '../../users/views/user.view';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  private readonly API_KEY: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService
  ) {
    this.API_KEY = process.env.API_KEY;
  }

  async registerUser(authDto: RegisterDto): Promise<{ tokens: AuthTokens }> {
    const otpMatches: boolean = await this.otpService.verifyOtp(authDto);
    if (!otpMatches) {
      throw new BadRequestException('OTP provided is not correct');
    }

    // TODO search for user in old db by email
    // TODO if found create legacy user with progress

    const newUser: User = await this.usersService.create(authDto.phoneNumber, {
      email: authDto.email
    });

    console.log(newUser);

    const tokens: AuthTokens = await this.tokenService.getTokens(
      newUser.id,
      newUser.phoneNumber
    );
    return { tokens };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const isOtpVerified = await this.otpService.verifyOtp(loginDto);
    if (!isOtpVerified) throw new BadRequestException('Otp is incorrect');

    const user: User = await this.usersService.findOneByPhoneNumber(
      loginDto.phoneNumber
    );

    const tokens: AuthTokens = await this.tokenService.getTokens(
      user.id,
      user.phoneNumber
    );
    return { tokens, user: new UserView(user).render() };
  }

  validateApiKey(apiKey: string): boolean {
    return apiKey == this.API_KEY;
  }

  async logout(userId: number, refreshToken: any): Promise<void> {
    const user: User = await this.usersService.findOneById(userId);
    await this.tokenService.addTokenToBlacklist(refreshToken, user.id);
  }
}
