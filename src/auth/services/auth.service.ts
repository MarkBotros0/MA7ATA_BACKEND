import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { OtpService } from './otp.service';
import { TokenService } from './token.service';
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

  async registerUser(authDto: RegisterDto): Promise<User> {
    const otpMatches: boolean = await this.otpService.verifyOtp(authDto);
    if (!otpMatches) {
      throw new BadRequestException('OTP provided is not correct');
    }

    // TODO search for user in old db by email
    // TODO if found create legacy user with progress

    return await this.usersService.create(authDto.phoneNumber, {
      email: authDto.email
    });
  }

  async login(loginDto: LoginDto): Promise<User> {
    const isOtpVerified = await this.otpService.verifyOtp(loginDto);
    if (!isOtpVerified) throw new BadRequestException('Otp is incorrect');

    return await this.usersService.findOneByPhoneNumber(loginDto.phoneNumber);
  }

  validateApiKey(apiKey: string): boolean {
    return apiKey == this.API_KEY;
  }

  async logout(refreshToken: any): Promise<void> {
    await this.tokenService.addTokenToBlacklist(refreshToken);
  }
}
