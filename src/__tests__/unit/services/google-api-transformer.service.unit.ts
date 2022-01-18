import {
  expect,
} from '@loopback/testlab';
import { GoogleApiTransformerService } from '../../../services';
import { inject } from '@loopback/context';
import { Holidays } from '../../../models';

describe('Unit Test GoogleApiTransformerService', () => {

  class GoogleController {
    constructor(
      @inject('services.GoogleApiTransformerService')
      protected googleApiTransformerService: GoogleApiTransformerService,
    ) { }

    async callgoogleApiTransformer(data: Object, country: string): Promise<Holidays[]> {
      return this.googleApiTransformerService.transformer(data, country);
    }
  }

  it('invokes function transformer', async () => {

    const googleApiTransformerService = new GoogleApiTransformerService();
    const data: Object = {
      "items": [
        {
          "summary": "test festividad 1",
          "start": {
            "date": "2021-03-28"
          }
        },
        {
          "summary": "test festividad 2",
          "start": {
            "date": "2021-03-29"
          }
        },
      ]
    };

    const country = "pe";
    const controller = new GoogleController(googleApiTransformerService);
    const dataTransformed = await controller.callgoogleApiTransformer(data, country);
    expect(dataTransformed.length).to.eql(2);
    expect(dataTransformed[0]['country']).to.eql(country);
    expect(dataTransformed[0]['date']).to.eql(new Date("2021-03-28"));
    expect(dataTransformed[0]['name']).to.eql("test festividad 1");
    expect(dataTransformed[0]['origin']).to.eql("Google");
    expect(dataTransformed[0]['type']).to.eql('Festivo');
  });
});
