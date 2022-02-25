import { authenticate } from '@loopback/authentication';
import {
  Filter,
  repository
} from '@loopback/repository';
import {
  api,
  getModelSchemaRef, param,
  patch,
  get,
  requestBody,
  response
} from '@loopback/rest';
import { Holidays } from '../models';
import { HolidaysRepository } from '../repositories';

@api({
  basePath: '/admin/holidays',
  paths: {
    '/{id}': {
      get: {
        operationId: 'AdminHolidayController.find',
        'x-operation-name': 'find',
        'x-controller-name': 'AdminHolidayController',
      },
      patch: {
        operationId: 'AdminHolidayController.updateById',
        'x-operation-name': 'updateById',
        'x-controller-name': 'AdminHolidayController',
        parameters: [
          { name: 'id', schema: { type: 'string' } },
        ],
      },
    },
  },
})
export class AdminHolidayController {
  constructor(
    @repository(HolidaysRepository)
    public holidaysRepository: HolidaysRepository,
  ) { }

  @authenticate('jwt')
  @patch('/{id}')
  @response(204, {
    description: 'Admin Holiday PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Holidays, { partial: true, exclude: ['type', 'country', 'createdAt', 'id', 'updatedAt', 'origin'] }),
        },
      },
    })
    holidays: Holidays,
  ): Promise<void> {
    holidays.origin = 'Manual';
    holidays.updatedAt = new Date();
    await this.holidaysRepository.updateById(id, holidays);
  }

  @authenticate('jwt')
  @get('/')
  @response(200, {
    description: 'Array of Holidays model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Holidays, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Holidays) filter?: Filter<Holidays>,
  ): Promise<Holidays[]> {
    return this.holidaysRepository.find(filter);
  }

}
