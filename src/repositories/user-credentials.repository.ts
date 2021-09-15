import { inject } from '@loopback/core';
import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { UserCredentials } from '../models';

export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id
> {
  constructor(@inject('datasources.mongoHolidays') dataSource: juggler.DataSource) {
    super(UserCredentials, dataSource);
  }
}
