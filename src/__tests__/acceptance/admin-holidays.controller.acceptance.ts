import { Client, expect } from '@loopback/testlab';
import { LemonholidaysApplication } from '../..';
import { setupApplication } from './test-helper';
import { HolidaysRepository } from '../../repositories/holidays.repository';
import { Holidays } from '../../models';
import { givenApplicationData } from '../helpers/database.helpers';

describe('Acceptance Test AdminHolidaysController', () => {
  let app: LemonholidaysApplication;
  let client: Client;
  let holidaysRepository: HolidaysRepository;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
  });

  before(async () => {
    await givenApplicationRepository();
  });

  beforeEach(async () => {
    await givenEmptyDatabase();
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /admin/holidays', async () => {
    const persistHoliday = await givenHolidaysInstance();
    const result = await client.get('/admin/holidays').expect(200);

    expect(result.body).to.containDeep([persistHoliday]);
  });

  it('invokes GET /admin/holidays/{id} with bad id', async () => {
    await client.get(`/admin/holidays/999999`).expect(404);
  });

  it('invokes GET /admin/holidays/{id}', async () => {
    const persistHoliday = await givenHolidaysInstance();
    const result = await client.get(`/admin/holidays/${persistHoliday.id}`);

    expect(result.body).to.containEql(persistHoliday);
  });

  it('invokes PATCH /admin/holidays/{id}', async () => {
    const data = {
      name: "applications test edit",
      key: "<ke-edit>",
    };
    const persistHoliday = await givenHolidaysInstance();
    await client.patch('/admin/holidays/' + persistHoliday.id).send(data).expect(204);
  });

  it('invokes DELETE /admin/holidays/{id}', async () => {
    const persistHoliday = await givenHolidaysInstance();
    await client.del('/admin/holidays/' + persistHoliday.id).expect(204);
  });

  async function givenApplicationRepository() {
    holidaysRepository = await app.getRepository(HolidaysRepository);
  }

  async function givenHolidaysInstance(holidays?: Partial<Holidays>) {
    return holidaysRepository.create(givenApplicationData(holidays));
  }

  async function givenEmptyDatabase() {
    await holidaysRepository.deleteAll();
  }
});
