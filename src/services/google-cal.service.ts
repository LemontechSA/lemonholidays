import { injectable, BindingScope, inject } from '@loopback/core';
import { google } from 'googleapis';
import { CountriesRepository } from '../repositories';


@injectable({ scope: BindingScope.TRANSIENT })
export class GoogleCalProvider {
  constructor(
    @inject('repositories.CountriesRepository')
    private countriesRepository: CountriesRepository
  ) { }

  async holidayEvents(year: number, country: string) {
    const calendar = google.calendar('v3');
    const apiKey = process.env.API_KEY_GOOGLE ?? ''
    const auth = google.auth.fromAPIKey(apiKey);
    google.options({ auth });
    const timeMax = `${year}-12-31T23:59:59Z`;
    const timeMin = `${year}-01-01T00:00:00Z`;
    const countries = await this.countriesRepository.findOne({
      where: {
        and: [
          {
            code: country
          },
        ]
      }
    });
    const calendarId = `es.${countries?.googleCode ?? country}#holiday@group.v.calendar.google.com`;
    const list = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
    });
    return list;
  }
}
