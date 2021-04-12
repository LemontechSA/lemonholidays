import { inject } from '@loopback/context';
import { get, param } from '@loopback/rest';
import { GoogleCalProvider } from '../services';
import { GoogleApiTransformerService } from '../services/google-api-transformer.service';

export class GoogleController {
  constructor(
    @inject('services.GoogleCalProvider') private googleCal: GoogleCalProvider,
    @inject('services.GoogleApiTransformerService') private googleApiTransformerService: GoogleApiTransformerService
  ) {}

  @get('/google/{country}/{year}')
  async getEventList(@param.path.string('year') year: number, @param.path.string('country') country: string): Promise<any> {
   const eventList = await this.googleCal.holidayEvents(year, country);
   return this.googleApiTransformerService.transformer(eventList.data, country);
   // return eventList.data;
  }
}
