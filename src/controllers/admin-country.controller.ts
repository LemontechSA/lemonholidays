import { authenticate } from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  api,
} from '@loopback/rest';
import { Countries } from '../models';
import { CountriesRepository } from '../repositories';

@api({
  basePath: '/admin/countries',
  paths: {
    '/': {
      post: {
        operationId: 'CountryController.create',
        'x-operation-name': 'create',
        'x-controller-name': 'CountryController',
      },
      get: {
        operationId: 'CountryController.find',
        'x-operation-name': 'find',
        'x-controller-name': 'CountryController',
      },
      patch: {
        operationId: 'CountryController.updateAll',
        'x-operation-name': 'updateAll',
        'x-controller-name': 'CountryController',
      }
    },
    '/count': {
      get: {
        operationId: 'CountryController.count',
        'x-operation-name': 'count',
        'x-controller-name': 'CountryController',
      }
    },
    '{id}': {
      get: {
        operationId: 'HolidaysController.findById',
        'x-operation-name': 'findById',
        'x-controller-name': 'HolidaysController',
        parameters: [
          { name: 'id', schema: { type: 'string' } },
        ],
      },
      patch: {
        operationId: 'CountryController.count',
        'x-operation-name': 'count',
        'x-controller-name': 'CountryController',
        parameters: [
          { name: 'id', schema: { type: 'string' } },
        ],
      },
      put: {
        operationId: 'CountryController.count',
        'x-operation-name': 'count',
        'x-controller-name': 'CountryController',
        parameters: [
          { name: 'id', schema: { type: 'string' } },
        ],
      },
      del: {
        operationId: 'CountryController.count',
        'x-operation-name': 'count',
        'x-controller-name': 'CountryController',
        parameters: [
          { name: 'id', schema: { type: 'string' } },
        ],
      },
    },
  },
})
export class CountryController {
  constructor(
    @repository(CountriesRepository)
    public countriesRepository: CountriesRepository,
  ) { }

  @authenticate('jwt')
  @post('/')
  @response(200, {
    description: 'Countries model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Countries) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Countries, {
            title: 'NewCountries',
            exclude: ['id'],
          }),
        },
      },
    })
    countries: Omit<Countries, 'id'>,
  ): Promise<Countries> {
    return this.countriesRepository.create(countries);
  }

  @authenticate('jwt')
  @get('/count')
  @response(200, {
    description: 'Countries model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Countries) where?: Where<Countries>,
  ): Promise<Count> {
    return this.countriesRepository.count(where);
  }

  @authenticate('jwt')
  @get('/')
  @response(200, {
    description: 'Array of Countries model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Countries, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Countries) filter?: Filter<Countries>,
  ): Promise<Countries[]> {
    return this.countriesRepository.find(filter);
  }

  @authenticate('jwt')
  @patch('/')
  @response(200, {
    description: 'Countries PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Countries, { partial: true }),
        },
      },
    })
    countries: Countries,
    @param.where(Countries) where?: Where<Countries>,
  ): Promise<Count> {
    return this.countriesRepository.updateAll(countries, where);
  }

  @authenticate('jwt')
  @get('/{id}')
  @response(200, {
    description: 'Countries model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Countries, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Countries, { exclude: 'where' }) filter?: FilterExcludingWhere<Countries>
  ): Promise<Countries> {
    return this.countriesRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/{id}')
  @response(204, {
    description: 'Countries PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Countries, { partial: true }),
        },
      },
    })
    countries: Countries,
  ): Promise<void> {
    await this.countriesRepository.updateById(id, countries);
  }

  @authenticate('jwt')
  @put('/{id}')
  @response(204, {
    description: 'Countries PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() countries: Countries,
  ): Promise<void> {
    await this.countriesRepository.replaceById(id, countries);
  }

  @authenticate('jwt')
  @del('/{id}')
  @response(204, {
    description: 'Countries DELETE success',
  })
  async deleteById(
    @param.path.string('id') id: string
  ): Promise<void> {
    await this.countriesRepository.deleteById(id);
  }
}
