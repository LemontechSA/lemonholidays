import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef, param,
  patch,
  requestBody,
  response
} from '@loopback/rest';
import {Holidays} from '../models';
import {HolidaysRepository} from '../repositories';


export class AdminHolidayController {
  constructor(
    @repository(HolidaysRepository)
    public holidaysRepository : HolidaysRepository,
  ) {}

  @patch('/admin/holidays/{id}')
  @response(204, {
    description: 'Admin Holiday PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Holidays, {partial: true,exclude:['type','country','createdAt','id','updatedAt','origin']}),
        },
      },
    })
    holidays: Holidays,
  ): Promise<void> {
    holidays.origin = 'manual';
    holidays.updatedAt = new Date().toString();
    await this.holidaysRepository.updateById(id, holidays);
  }

}
