import { Client, expect } from '@loopback/testlab';
import { LemonholidaysApplication } from '../..';
import { setupApplication } from './test-helper';
import { ApplicationsRepository } from '../../repositories/applications.repository';
import { Applications } from '../../models';
import { givenApplicationData } from '../helpers/database.helpers';

describe('Acceptance Test AdminApplicationsController', () => {
  let app: LemonholidaysApplication;
  let client: Client;
  let applicationRepository: ApplicationsRepository;

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

  it('invokes POST /admin/applications with bad request body', async () => {
    await client.post('/admin/applications').send({}).expect(422);
  });

  it('invokes POST /admin/applications', async () => {
    const data = {
      name: "applications test 1",
      key: "<key>",
    };
    const result = await client.post('/admin/applications').send(data).expect(200);

    expect(result.body.name).to.equal(data.name);
    expect(result.body.key).to.equal(data.key);
  });

  it('invokes GET /admin/applications/count', async () => {
    await givenApplicationInstance();
    const result = await client.get('/admin/applications/count').expect(200);

    expect(result.body.count).to.equal(1);
  });

  it('invokes GET /admin/applications', async () => {
    const persistApplication = await givenApplicationInstance();
    const result = await client.get('/admin/applications').expect(200);

    expect(result.body).to.containDeep([persistApplication]);
  });

  it('invokes GET /admin/applications/{id} with bad id', async () => {
    await client.get(`/admin/applications/999999`).expect(404);
  });

  it('invokes GET /admin/applications/{id}', async () => {
    const persistApplication = await givenApplicationInstance();
    const result = await client.get(`/admin/applications/${persistApplication.id}`);

    expect(result.body).to.containEql(persistApplication);
  });

  it('invokes PATCH /admin/applications/{id}', async () => {
    const data = {
      name: "applications test edit",
      key: "<ke-edit>",
    };
    const persistApplication = await givenApplicationInstance();
    await client.patch('/admin/applications/' + persistApplication.id).send(data).expect(204);
  });

  it('invokes DELETE /admin/applications/{id}', async () => {
    const persistApplication = await givenApplicationInstance();
    await client.del('/admin/applications/' + persistApplication.id).expect(204);
  });

  async function givenApplicationRepository() {
    applicationRepository = await app.getRepository(ApplicationsRepository);
  }

  async function givenApplicationInstance(application?: Partial<Applications>) {
    return applicationRepository.create(givenApplicationData(application));
  }

  async function givenEmptyDatabase() {
    await applicationRepository.deleteAll();
  }
});
