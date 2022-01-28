import { expect } from '@loopback/testlab';
import { LemonholidaysApplication } from '../..';
import { setupApplication } from './test-helper';
import { HolidaysRepository } from '../../repositories/holidays.repository';
import { CountriesRepository } from '../../repositories/countries.repository';
import { Countries, Holidays } from '../../models';
import { givenCountryData, givenHolidayData } from '../helpers/database.helpers';

describe('Acceptance Test HolidaysRepository', () => {
  let app: LemonholidaysApplication;
  let holidaysRepository: HolidaysRepository;
  let countriesRepository: CountriesRepository;

  before('setupApplication', async () => {
    ({ app } = await setupApplication());
  });

  before(async () => {
    await givenHolidayRepository();
    await givenCountryRepository();
  });

  afterEach(async () => {
    await givenEmptyDatabase();
  });

  after(async () => {
    await app.stop();
  });

  it('invokes function createOrUpdate', async () => {
    const country:Partial<Countries> = {
      name: 'Perú',
      code: "pe",
      origin: "Google",
      googleCode: "pe"
    };
    const holiday:Partial<Holidays> = {
      name: "Feriado Test Pe",
      date: new Date('2021-12-13'),
      type: "Civil",
      origin: "Google",
      country: "pe",
      active: true,
      createdAt: new Date()
    }
    await givenCountryInstance(country);
    await givenHolidayInstance(holiday);
    const result = await holidaysRepository.createOrUpdate()
    expect(result).to.equal(null);
  });

  it('invokes function createOrUpdate when holidays is empty', async () => {
    await givenCountryInstance();
    const result = await holidaysRepository.createOrUpdate()
    expect(result).to.equal(null);
  });

  it('invokes function findByCountry', async () => {
    await givenCountryInstance();
    await givenHolidayInstance();
    const result = await holidaysRepository.findByCountry("pe", 2021)
    expect(result).to.be.eql([]);
  });

  it('invokes function findByCountry whitout year', async () => {
    await givenCountryInstance();
    await givenHolidayInstance();
    const result = await holidaysRepository.findByCountry("pe")
    expect(result).to.be.eql([]);
  });

  it('invokes function findByCountry with data result', async () => {
    await givenCountryInstance();
    const holiday = await givenHolidayInstance();
    const result = await holidaysRepository.findByCountry("cl", 2021)

    expect(result).to.be.eql([holiday]);
  });

  it('invokes function findByCountry with equal dates holidays ', async () => {
    await givenCountryInstance();

    const holidays = [];

    for (let index = 0; index < 3; index++) {
      const currentHoliday = await givenHolidayInstance();
      holidays.push(currentHoliday);
    }

    const rootHoliday = holidays[0];
    holidays.splice(0, 1);
    rootHoliday.data = holidays;
    const result = await holidaysRepository.findByCountry("cl", 2021)

    expect(result).to.be.eql([rootHoliday]);
  });

  async function givenCountryRepository() {
    countriesRepository = await app.getRepository(CountriesRepository);
  }

  async function givenCountryInstance(countries?: Partial<Countries>) {
    return countriesRepository.create(givenCountryData(countries));
  }

  async function givenHolidayRepository() {
    holidaysRepository = await app.getRepository(HolidaysRepository);
  }

  async function givenHolidayInstance(holidays?: Partial<Holidays>) {
    return holidaysRepository.create(givenHolidayData(holidays));
  }

  async function givenEmptyDatabase() {
    await holidaysRepository.deleteAll();
    await countriesRepository.deleteAll();
  }
});
