import {
  expect,
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  sinon
} from '@loopback/testlab';
import { Holidays } from '../../../models';
import { AdminHolidayController } from '../../../controllers';
import { givenHolidayData } from '../../helpers/database.helpers';
import { HolidaysRepository } from '../../../repositories/holidays.repository';

describe('Unit Test AdminHolidaysController', () => {
  let applicationInstance: Holidays;
  let applicationInstanceWithId: Holidays;
  let controller: AdminHolidayController;
  let repository: StubbedInstanceWithSinonAccessor<HolidaysRepository>;

  beforeEach(resetTest);

  it('create', async () => {
    const createStubMethod = repository.stubs.create;
    createStubMethod.resolves(applicationInstanceWithId);
    const result = await controller.create(applicationInstance);
    expect(result).to.eql(applicationInstanceWithId);
    sinon.assert.calledWith(createStubMethod, applicationInstance);
  });

  it('delete', async () => {
    const deleteStubMethod = repository.stubs.delete;
    deleteStubMethod.resolves();
    const result = await controller.deleteById("1");
    expect(result).to.eql(undefined);
  });

  function resetTest() {
    repository = createStubInstance(HolidaysRepository);
    applicationInstance = givenHolidayData();
    applicationInstanceWithId = givenHolidayData({ id: "1" });
    controller = new AdminHolidayController(repository);
  }
});
