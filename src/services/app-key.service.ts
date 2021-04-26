import { injectable, BindingScope, inject } from '@loopback/core';
import { ApplicationsRepository } from '../repositories/applications.repository';

@injectable({scope: BindingScope.TRANSIENT})
export class AppKeyProvider {
  constructor(
    @inject('repositories.ApplicationsRepository')
    private applicationsRepository: ApplicationsRepository
    ) { }

  async authorize(key: string) {
    const result = await this.applicationsRepository.find({where: {'key': key}});
    if (result.length > 0) {
      return true;
    }
    return false;
  }
}
