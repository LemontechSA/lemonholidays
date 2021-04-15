import {repository} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  response,
  api,
} from '@loopback/rest';
import {Holidays} from '../models';
import {HolidaysRepository} from '../repositories';

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
          {name: 'year', schema: {type: 'number'}, in: 'query'}
        ],
      },
    },
  },
})
export class HolidaysController {
  constructor(
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
    @param.path.string('country') country: string,
    @param.query.number('year') year?: number,
  ): Promise<Holidays[]> {
    return this.holidaysRepository.findByCountry(country, year);
  }
}
