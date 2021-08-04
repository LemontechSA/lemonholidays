import {
  expect,
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  sinon
} from '@loopback/testlab';
import { Applications } from '../../../models';
import { AdminApplicationsController } from '../../../controllers';
import { givenApplicationData } from '../../helpers/database.helpers';
import { ApplicationsRepository } from '../../../repositories/applications.repository';

describe('Unit Test AdminApplicationsController', () => {
  let applicationInstance: Applications;
  let applicationInstanceWithId: Applications;
  let controller: AdminApplicationsController;
  let repository: StubbedInstanceWithSinonAccessor<ApplicationsRepository>;

  beforeEach(resetTest);

  it('create', async () => {
    const createStubMethod = repository.stubs.create;
    createStubMethod.resolves(applicationInstanceWithId);
    const result = await controller.create(applicationInstance);
    expect(result).to.eql(applicationInstanceWithId);
    sinon.assert.calledWith(createStubMethod, applicationInstance);
  });

  it('count', async () => {
    const createStubMethod = repository.stubs.count;
    createStubMethod.resolves({count: 0});
    const result = await controller.count();
    expect(result.count).to.eql(0);
  });

  function resetTest() {
    repository = createStubInstance(ApplicationsRepository);
    applicationInstance = givenApplicationData();
    applicationInstanceWithId = givenApplicationData({id: "1"});
    controller = new AdminApplicationsController(repository);
  }
});
