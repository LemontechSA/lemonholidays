import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'mongoHolidays',
  connector: 'mongodb',
  url: process.env.MONGO_URL,
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASS,
  database: process.env.MONGO_DB,
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongoHolidaysDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongoHolidays';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongoHolidays', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
