import { Client, expect } from '@loopback/testlab';
import { LemonholidaysApplication } from '../..';
import { setupApplication } from './test-helper';
import { HolidaysRepository } from '../../repositories/holidays.repository';
import { Holidays } from '../../models';
import { givenHolidayData } from '../helpers/database.helpers';

describe('Acceptance Test AdminHolidaysController', () => {
  let app: LemonholidaysApplication;
  let client: Client;
  let holidaysRepository: HolidaysRepository;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
  });

  before(async () => {
    await givenHolidayRepository();
  });

  beforeEach(async () => {
    await givenEmptyDatabase();
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /admin/holidays', async () => {
    const holidays = [];

    for (let index = 0; index < 3; index++) {
      const currentHoliday = await givenHolidayInstance();
      holidays.push(currentHoliday);
    }

    const rootHoliday = holidays[0];
    holidays.splice(0, 1);
    rootHoliday.data = holidays;

    const result = await client.get('/admin/holidays').expect(200);
    expect(result).to.be.eql([rootHoliday]);
  });

  it('invokes GET /admin/holidays/{id} with bad id', async () => {
    await client.get(`/admin/holidays/999999`).expect(404);
  });

  it('invokes GET /admin/holidays/{id}', async () => {
    const persistHoliday = await givenHolidayInstance();
    const result = await client.get(`/admin/holidays/${persistHoliday.id}`);

    expect(result.body).to.containEql(persistHoliday);
  });

  it('invokes PATCH /admin/holidays/{id}', async () => {
    const data = {
      name: "Test-test",
    };
    const persistHoliday = await givenHolidayInstance();
    await client.patch('/admin/holidays/' + persistHoliday.id).send(data).expect(204);
  });

  async function givenHolidayRepository() {
    holidaysRepository = await app.getRepository(HolidaysRepository);
  }

  async function givenHolidayInstance(holidays?: Partial<Holidays>) {
    return holidaysRepository.create(givenHolidayData(holidays));
  }

  async function givenEmptyDatabase() {
    await holidaysRepository.deleteAll();
  }
});
