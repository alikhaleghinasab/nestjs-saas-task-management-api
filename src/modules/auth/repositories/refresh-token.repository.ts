import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '@auth/entities/refresh-token.entity';
import { UpsertRefreshTokenParams } from '@auth/interfaces/upsert-refresh-token.interface';

export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repo: Repository<RefreshToken>,
  ) {}

  async upsertRefreshTokenByUser(
    data: UpsertRefreshTokenParams,
  ): Promise<RefreshToken> {
    await this.repo.upsert(this.repo.create(data), ['userId']);
    return await this.repo.findOneBy({ userId: data.userId });
  }

  async getRefreshTokenByJti(jti: string): Promise<RefreshToken | null> {
    return await this.repo.findOneBy({ jti });
  }

  async deleteRefreshTokenByJti(jti: string): Promise<boolean> {
    return (await this.repo.delete({ jti })).affected > 0;
  }
}
