import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoHolidaysDataSource} from '../datasources';
import {Countries, CountriesRelations} from '../models';

export class CountriesRepository extends DefaultCrudRepository<
  Countries,
  typeof Countries.prototype.id,
  CountriesRelations
> {
  constructor(
    @inject('datasources.mongoHolidays') dataSource: MongoHolidaysDataSource,
  ) {
    super(Countries, dataSource);
  }
}
