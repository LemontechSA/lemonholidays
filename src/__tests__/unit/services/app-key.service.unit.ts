import {
  expect,
  StubbedInstanceWithSinonAccessor,
  createStubInstance
} from '@loopback/testlab';
import { Applications } from '../../../models';
import { givenApplicationData } from '../../helpers/database.helpers';
import { ApplicationsRepository } from '../../../repositories/applications.repository';
import { AppKeyProvider } from '../../../services/app-key.service';

describe('Unit Test AppKeyProvider', () => {
  let appKeyService: AppKeyProvider;
  let applicationInstance: Applications;
  let applicationInstances: Applications[];
  let repository: StubbedInstanceWithSinonAccessor<ApplicationsRepository>;

  beforeEach(resetTest);

  it('authorize with valid app key', async () => {
    const createStubMethod = repository.stubs.find;
    createStubMethod.resolves(applicationInstances);
    const result = await appKeyService.authorize(applicationInstance.key);
    expect(result).to.be.true();
  });

  it('authorize with invalid app key', async () => {
    const createStubMethod = repository.stubs.find;
    createStubMethod.resolves([]);
    const result = await appKeyService.authorize("invalid-key");
    expect(result).to.be.false();
  });

  it('authorize with empty app key', async () => {
    const createStubMethod = repository.stubs.find;
    createStubMethod.resolves(applicationInstances);
    const result = await appKeyService.authorize("");
    expect(result).to.be.false();
  });

  function resetTest() {
    applicationInstances = [];
    repository = createStubInstance(ApplicationsRepository);
    appKeyService = new AppKeyProvider(repository);
    applicationInstances.push(givenApplicationData());
    applicationInstance = givenApplicationData({key: "key-test"});
  }
});
