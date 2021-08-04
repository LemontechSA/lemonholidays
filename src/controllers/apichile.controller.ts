import { inject } from '@loopback/context';
import { get, param } from '@loopback/rest';
import { Holidays } from '../models';
import { ApichileService } from '../services';
import { ApiChileTranformerService } from '../services/api-chile-tranformer.service';

export class ApichileController {
  constructor(
    @inject('services.ApichileService') protected apichileService: ApichileService,
    @inject('services.ApiChileTranformerService') protected apiChileTranformerService: ApiChileTranformerService
  ) { }

  @get('/chile/{year}')
  async holidaysByYear(@param.path.string('year') year: number): Promise<Holidays[]> {
    return this.callApichile(year);
  }
  async callApichile(year: number): Promise<Holidays[]> {
    const data = await this.apichileService.holidaysByYear(year);

    return this.apiChileTranformerService.transformer(data);
  }
}
