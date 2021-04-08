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

  async findByCountry(country: string, year?: number) {
    if (!year) {
      year = 2021;
    }
    const first = Date.parse(`${year}-01-01`).toString();
    const last = Date.parse(`${year}-12-31`).toString();
    const result = await this.find({
      where: {
        and: [
          {
            country
          },
          {
            date: {between: [first, last]}
          }
        ]
      }
    })
    return result;
  }
}
