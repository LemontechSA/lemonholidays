import { Getter, inject } from '@loopback/core';
import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import { User, UserCredentials } from '../models';
import { UserCredentialsRepository } from './user-credentials.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {

  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.mongoHolidays') dataSource: juggler.DataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
  ) {
    super(User, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );

  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
