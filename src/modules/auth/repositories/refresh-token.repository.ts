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
}
