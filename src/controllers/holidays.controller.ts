import {repository} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  response,
  api,
} from '@loopback/rest';
import { inject } from '@loopback/context';
import {Holidays} from '../models';
import {HolidaysRepository} from '../repositories';
import {AppKeyProvider} from '../services/app-key.service';

@api({
  basePath: '/holidays',
  paths: {
    '/{country}': {
      get: {
        operationId: 'HolidaysController.find',
        'x-operation-name': 'find',
        'x-controller-name': 'HolidaysController',
        parameters: [
          {name: 'country', schema: {type: 'string'}},
          {name: 'year', schema: {type: 'number'}, in: 'query'},
          {name: 'appKey', schema: {type: 'string'}, in: 'header'},
        ],
      },
    },
  },
})
export class HolidaysController {
  constructor(
    @inject('services.AppKeyProvider') private appKeyProvider: AppKeyProvider,
    @repository(HolidaysRepository)
    public holidaysRepository : HolidaysRepository,
  ) {}

  @get('/{country}')
  @response(200, {
    description: 'Array of Holidays model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Holidays, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.header.string('appKey') appKey: string,
    @param.path.string('country') country: string,
    @param.query.number('year') year?: number,
  ): Promise<Holidays[]> {
    const authorized = await this.appKeyProvider.authorize(appKey);
    if (!authorized) {
      throw new Error("Unauthorized");
    }
    return this.holidaysRepository.findByCountry(country, year);
  }
}
