import { inject } from '@loopback/context';
import { get, param } from '@loopback/rest';
import { GoogleCalProvider } from '../services';

export class GoogleController {
  constructor(@inject('services.GoogleCalProvider') private googleCal: GoogleCalProvider) { 
    this.googleCal = new GoogleCalProvider(); 
  }

  @get('/google/{country}/{year}')
  async getEventList(@param.path.string('year') year: number, @param.path.string('country') country: string): Promise<any> {
   const eventList = await this.googleCal.holidayEvents(year, country);
   return eventList.data;
  }
}
