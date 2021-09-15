import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoHolidaysDataSource} from '../datasources';
import {Applications} from '../models';

export class ApplicationsRepository extends DefaultCrudRepository<
  Applications,
  typeof Applications.prototype.id
> {
  constructor(
    @inject('datasources.mongoHolidays') dataSource: MongoHolidaysDataSource,
  ) {
    super(Applications, dataSource);
  }
}
