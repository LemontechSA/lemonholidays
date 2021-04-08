import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  response,
} from '@loopback/rest';
import {Holidays} from '../models';
import {HolidaysRepository} from '../repositories';

export class HolidaysController {
  constructor(
    @repository(HolidaysRepository)
    public holidaysRepository : HolidaysRepository,
  ) {}

  @get('/holidays/{country}')
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
