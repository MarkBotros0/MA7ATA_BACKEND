import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { BlacklistedRefreshToken } from '../entities/blacklisted-refresh-token.entity';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { Cron } from '@nestjs/schedule';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class BlacklistTokenService {
  constructor(
    @InjectRepository(BlacklistedRefreshToken)
    private readonly blacklistRepository: Repository<BlacklistedRefreshToken>,
    private readonly usersService: UsersService
  ) {}

  async hashData(data: string): Promise<string> {
    return argon2.hash(data);
  }

  async addToken(token: string, userId: number): Promise<void> {
    const user: User = await this.usersService.findOneById(userId);

    await this.blacklistRepository.save({
      token: await this.hashData(token),
      user
    });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const userId: number = this.extractUserIdClaimFromJwt(token);

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

  private extractUserIdClaimFromJwt(token): number {
    const payload = jwt.decode(token);
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token');
    }
    return Number(payload.sub);
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
