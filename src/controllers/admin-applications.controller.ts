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
} from '@loopback/rest';
import {Applications} from '../models';
import {ApplicationsRepository} from '../repositories';

export class AdminApplicationsController {
  constructor(
    @repository(ApplicationsRepository)
    public applicationsRepository : ApplicationsRepository,
  ) {}

  @post('/admin/applications')
  @response(200, {
    description: 'Applications model instance',
    content: {'application/json': {schema: getModelSchemaRef(Applications)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Applications, {
            title: 'NewApplications',
            exclude: ['id'],
          }),
        },
      },
    })
    applications: Omit<Applications, 'id'>,
  ): Promise<Applications> {
    return this.applicationsRepository.create(applications);
  }

  @get('/admin/applications/count')
  @response(200, {
    description: 'Applications model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Applications) where?: Where<Applications>,
  ): Promise<Count> {
    return this.applicationsRepository.count(where);
  }

  @get('/admin/applications')
  @response(200, {
    description: 'Array of Applications model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Applications, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Applications) filter?: Filter<Applications>,
  ): Promise<Applications[]> {
    return this.applicationsRepository.find(filter);
  }

  @patch('/admin/applications')
  @response(200, {
    description: 'Applications PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Applications, {partial: true}),
        },
      },
    })
    applications: Applications,
    @param.where(Applications) where?: Where<Applications>,
  ): Promise<Count> {
    return this.applicationsRepository.updateAll(applications, where);
  }

  @get('/admin/applications/{id}')
  @response(200, {
    description: 'Applications model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Applications, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Applications, {exclude: 'where'}) filter?: FilterExcludingWhere<Applications>
  ): Promise<Applications> {
    return this.applicationsRepository.findById(id, filter);
  }

  @patch('/admin/applications/{id}')
  @response(204, {
    description: 'Applications PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Applications, {partial: true}),
        },
      },
    })
    applications: Applications,
  ): Promise<void> {
    await this.applicationsRepository.updateById(id, applications);
  }

  @put('/admin/applications/{id}')
  @response(204, {
    description: 'Applications PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() applications: Applications,
  ): Promise<void> {
    await this.applicationsRepository.replaceById(id, applications);
  }

  @del('/admin/applications/{id}')
  @response(204, {
    description: 'Applications DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.applicationsRepository.deleteById(id);
  }
}
