import { authenticate } from '@loopback/authentication';
import {
  repository
} from '@loopback/repository';
import {
  api,
  getModelSchemaRef, param,
  patch,
  get,
  requestBody,
  response,
  del,
  post
} from '@loopback/rest';
import { Holidays } from '../models';
import { HolidaysRepository } from '../repositories';

@api({
  basePath: '/admin/holidays',
  paths: {
    '/': {
      post: {
        operationId: 'AdminHolidayController.create',
        'x-operation-name': 'create',
        'x-controller-name': 'AdminHolidayController',
      }
    },
    '/{country}': {
      get: {
        operationId: 'AdminHolidayController.find',
        'x-operation-name': 'find',
        'x-controller-name': 'AdminHolidayController',
        parameters: [
          { name: 'country', schema: { type: 'string' } },
          { name: 'year', schema: { type: 'number' }, in: 'query' },
        ],
      },
    },
    '/{id}': {
      del: {
        operationId: 'AdminHolidayController.deleteById',
        'x-operation-name': 'deleteById',
        'x-controller-name': 'AdminHolidayController',
        parameters: [
          { name: 'id', schema: { type: 'string' } },
        ],
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
  @post('/')
  @response(201, {
    description: 'Holidays model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Holidays) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Holidays, {
            title: 'NewHoliday',
            exclude: ['id'],
          }),
        },
      },
    })
    holidays: Omit<Holidays, 'id'>,
  ): Promise<Holidays> {
    return this.holidaysRepository.create(holidays);
  }

  @authenticate('jwt')
  @patch('/{id}')
  @response(200, {
    description: 'Admin Holiday PATCH success',
    content: { 'application/json': { schema: getModelSchemaRef(Holidays) } },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Holidays, {
            partial: true, exclude: [
              'id',
              'type',
              'country',
              'createdAt',
              'updatedAt',
              'origin'
            ]
          }),
        },
      },
    })
    holiday: Holidays,
  ): Promise<Holidays> {
    holiday.origin = 'Manual';
    holiday.updatedAt = new Date();
    await this.holidaysRepository.updateById(id, holiday);
    return holiday;
  }

  @authenticate('jwt')
  @del('/{id}')
  @response(204, {
    description: 'Admin Holiday DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    return this.holidaysRepository.disableById(id);
  }

  @authenticate('jwt')
  @get('/{country}')
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
    @param.path.string('country') country: string,
    @param.query.number('year') year?: number,
  ): Promise<Holidays[]> {
    return this.holidaysRepository.findByCountry(country, year);
  }

}
