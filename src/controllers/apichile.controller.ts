import { inject } from '@loopback/context';
import { get, param } from '@loopback/rest';
import { ApichileService } from '../services';

export class ApichileController {
  constructor(@inject('services.ApichileService') protected apichileService: ApichileService) { }

  @get('/holidays/{year}')
  async HolidaysByYear(@param.path.string('year') year: number): Promise<any> {
    return await this.callApichile(year);
  }
  async callApichile(year: number): Promise<any> {
    return await this.apichileService.HolidaysByYear(year);
  }

}
