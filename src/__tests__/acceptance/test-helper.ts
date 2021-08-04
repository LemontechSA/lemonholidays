import {LemonholidaysApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new LemonholidaysApplication({
    rest: restConfig,
  });

  await app.boot();

  /**
   * Override default config for DataSource for testing
   */
  app.bind('datasources.config.mongoHolidays').to({
    name: 'dbtest',
    connector: 'memory',
    file: './data/dbtest.json'
  });

  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: LemonholidaysApplication;
  client: Client;
}
