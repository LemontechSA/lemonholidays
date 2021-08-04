import { inject } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  name: 'apichile',
  connector: 'rest',
  baseURL: 'https://apis.digital.gob.cl/fl/feriados/',
  crud: false,
  "options": {
    "headers": {
      "content-type": "application/json"
    }
  },
  "operations": [
    {
      "template": {
        "method": "GET",
        "url": "https://apis.digital.gob.cl/fl/feriados/{year}"
      },
      "functions": {
        "HolidaysByYear": ["year"]
      }
    }
  ]
};

export class ApichileDataSource extends juggler.DataSource {
  static dataSourceName = 'apichile';

  constructor(
    @inject('datasources.config.apichile', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
