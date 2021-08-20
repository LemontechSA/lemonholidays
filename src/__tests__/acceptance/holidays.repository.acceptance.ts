import { Client, expect } from '@loopback/testlab';
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
        await givenCountryInstance();
        await givenHolidayInstance();
        let result = await holidaysRepository.createOrUpdate()
        expect(result).to.equal(null);
    });

    it('invokes function createOrUpdate when holidays is empty', async () => {
        await givenCountryInstance();
        let result = await holidaysRepository.createOrUpdate()
        expect(result).to.equal(null);
    });

    it('invokes function findByCountry', async () => {
        await givenCountryInstance();
        await givenHolidayInstance();
        let result = await holidaysRepository.findByCountry("pe", 2021)
        expect(result).to.be.eql([]);
    });

    it('invokes function findByCountry whitout year', async () => {
        await givenCountryInstance();
        await givenHolidayInstance();
        let result = await holidaysRepository.findByCountry("pe")
        expect(result).to.be.eql([]);
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
