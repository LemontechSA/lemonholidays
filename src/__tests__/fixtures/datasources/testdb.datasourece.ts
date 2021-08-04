import {juggler} from '@loopback/repository';

export const testdb: juggler.DataSource = new juggler.DataSource({
  name: 'dbtest',
  connector: 'memory',
  file: './data/dbtest.json'
});
