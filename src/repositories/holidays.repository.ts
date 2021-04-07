import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoHolidaysDataSource} from '../datasources';
import {Holidays, HolidaysRelations} from '../models';

export class HolidaysRepository extends DefaultCrudRepository<
  Holidays,
  typeof Holidays.prototype.id,
  HolidaysRelations
> {
  constructor(
    @inject('datasources.mongoHolidays') dataSource: MongoHolidaysDataSource,
  ) {
    super(Holidays, dataSource);
  }
}
