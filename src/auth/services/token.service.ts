import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { BlacklistedRefreshToken } from '../entities/blacklisted-refresh-token.entity';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { Cron } from '@nestjs/schedule';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwt.payload';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthTokens } from '../types/auth-tokens.type';

@Injectable()
export class TokenService {
  private readonly accessTokenExpireAfter: string;
  private readonly refreshTokenExpireAfter: string;

  constructor(
    @InjectRepository(BlacklistedRefreshToken)
    private readonly blacklistRepository: Repository<BlacklistedRefreshToken>,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {
    this.accessTokenExpireAfter = process.env.ACCESS_TOKEN_EXPIRE_AFTER;
    this.refreshTokenExpireAfter = process.env.REFRESH_TOKEN_EXPIRE_AFTER;
  }

  async hashData(data: string): Promise<string> {
    return argon2.hash(data);
  }

  private async generateAccessToken(
    userId: number,
    phoneNumber: string
  ): Promise<string> {
    const payload: JwtPayload = { sub: userId, phoneNumber: phoneNumber };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.accessTokenExpireAfter
    });
  }

  private async generateRefreshToken(
    userId: number,
    phoneNumber: string
  ): Promise<string> {
    const payload: JwtPayload = { sub: userId, phoneNumber: phoneNumber };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.refreshTokenExpireAfter
    });
  }
  s;
  async addTokenToBlacklist(token: string, userId: number): Promise<void> {
    const user: User = await this.usersService.findOneById(userId);
    await this.blacklistRepository.save({
      token: await this.hashData(token),
      user
    });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const userId: number = this.extractUserIdClaimFromToken(token);

    const blacklistedTokens: BlacklistedRefreshToken[] =
      await this.blacklistRepository.find({
        where: { user: { id: userId } }
      });

    for (const blacklisted of blacklistedTokens) {
      const isMatch = await argon2.verify(blacklisted.token, token);
      if (isMatch) {
        return true;
      }
    }
    return false;
  }

  extractUserIdClaimFromToken(token: string): number {
    const payload = jwt.decode(token);
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token');
    }
    return Number(payload.sub);
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const userId: number = this.extractUserIdClaimFromToken(refreshToken);
    const user: User = await this.usersService.findOneById(userId);

    await this.addTokenToBlacklist(refreshToken, user.id);
    return await this.getTokens(user.id, user.phoneNumber);
  }

  async getTokens(userId: number, phoneNumber: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(userId, phoneNumber),
      this.generateRefreshToken(userId, phoneNumber)
    ]);
    return {
      accessToken,
      refreshToken
    };
  }

  @Cron('0 0 * * *')
  private async removeExpiredTokens(): Promise<void> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    await this.blacklistRepository.delete({
      expiredAt: LessThan(sevenDaysAgo)
    });
  }
}
