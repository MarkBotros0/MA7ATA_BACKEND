import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlacklistTokenService } from '../services/blacklist-token.service';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly blacklistService: BlacklistTokenService) {
    super();
  }

  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.get('Authorization')?.replace('Bearer', '').trim();
    return await this.blacklistService.isTokenBlacklisted(token);
  }
}
