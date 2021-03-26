import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {google} from 'googleapis';

@injectable({scope: BindingScope.TRANSIENT})
export class GoogleCalProvider {
  constructor() {}

  async holidayEvents(year: number, country: string) {
    const calendar = google.calendar('v3');
    const apiKey = process.env.GOOGLE_API_KEY ?? ''
    const auth = google.auth.fromAPIKey(apiKey);
    google.options({auth});
    const timeMax = `${year}-12-31T23:59:59Z`;
    const timeMin = `${year}-01-01T00:00:00Z`;
    const calendarId = `es.${country}#holiday@group.v.calendar.google.com`;
    const list = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
    });
    return list;
  }
}
