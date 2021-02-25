import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Countries, CountriesRelations} from '../models';

export class CountriesRepository extends DefaultCrudRepository<
  Countries,
  typeof Countries.prototype.id,
  CountriesRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Countries, dataSource);
  }
}
