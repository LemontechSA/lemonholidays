import { inject } from '@loopback/context';
import { get, param } from '@loopback/rest';
import { ApichileService } from '../services';
import { ApiChileTranformerService } from '../services/api-chile-tranformer.service';

export class ApichileController {
  constructor(
    @inject('services.ApichileService') protected apichileService: ApichileService,
    @inject('services.ApiChileTranformerService') protected apiChileTranformerService: ApiChileTranformerService
  ) { }

  @get('/holidays/{year}')
  async HolidaysByYear(@param.path.string('year') year: number): Promise<any> {
    return await this.callApichile(year);
  }
  async callApichile(year: number): Promise<any> {
    const data = await this.apichileService.HolidaysByYear(year);

    return this.apiChileTranformerService.transformer(data);
  }
}
