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
  let holidayInstance: Holidays;
  let holidayInstanceWithId: Holidays;
  let controller: AdminHolidayController;
  let repository: StubbedInstanceWithSinonAccessor<HolidaysRepository>;

  beforeEach(resetTest);

  it('create', async () => {
    const createStubMethod = repository.stubs.create;
    createStubMethod.resolves(holidayInstanceWithId);
    const result = await controller.create(holidayInstance);
    expect(result).to.eql(holidayInstanceWithId);
    sinon.assert.calledWith(createStubMethod, holidayInstance);
  });

  it('delete', async () => {
    const deleteStubMethod = repository.stubs.delete;
    deleteStubMethod.resolves();
    const result = await controller.deleteById("1");
    expect(result).to.eql(undefined);
  });

  it('update', async () => {
    const updateStubMethod = repository.stubs.updateById;
    updateStubMethod.resolves();
    const result = await controller.updateById("1", holidayInstance);
    holidayInstance.origin = "Manual";
    holidayInstance.updatedAt = new Date();
    expect(result).to.eql(holidayInstance);
  });

  function resetTest() {
    repository = createStubInstance(HolidaysRepository);
    holidayInstance = givenHolidayData();
    holidayInstanceWithId = givenHolidayData({ id: "1" });
    controller = new AdminHolidayController(repository);
  }
});
