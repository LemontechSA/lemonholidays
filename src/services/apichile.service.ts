import { inject, Provider } from '@loopback/core';
import { getService } from '@loopback/service-proxy';
import { ApichileDataSource } from '../datasources';

export interface ApichileService {
  HolidaysByYear(year: number): Promise<any>;
}

export class ApichileServiceProvider implements Provider<ApichileService> {
  constructor(
    @inject('datasources.apichile')
    protected dataSource: ApichileDataSource = new ApichileDataSource(),
  ) { }

  value(): Promise<ApichileService> {
    return getService(this.dataSource);
  }
}
