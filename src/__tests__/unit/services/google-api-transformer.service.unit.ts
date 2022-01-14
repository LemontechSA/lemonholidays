
import {
  expect,
} from '@loopback/testlab';
import { GoogleApiTransformerService } from '../../../services';
import { inject } from '@loopback/context';
import { Holidays } from '../../../models';

describe('Unit Test GoogleApiTransformerService', () => {

  class MyController {
    constructor(
      @inject('services.GoogleApiTransformerService')
      protected googleApiTransformerService: GoogleApiTransformerService,
    ) { }

    async callgoogleApiTransformer(data: Object, country: string): Promise<Holidays[]> {
      return this.googleApiTransformerService.transformer(data, country);
    }
  }

  it('invokes function transformer', async () => {

    let googleApiTransformerService = new GoogleApiTransformerService();
    let dataTransformed: Array<Holidays>;
    const data: Object = {
      "items": [
        {
          "summary": "test festividad",
          "start": {
            "date": "2021-03-28"
          }
        },
        {
          "summary": "test festividad2",
          "start": {
            "date": "2021-03-29"
          }
        },
      ]
    };

    const country: string = "pe";
    let controller = new MyController(googleApiTransformerService);
    dataTransformed = await controller.callgoogleApiTransformer(data, country);
    expect(dataTransformed.length).to.eql(2);

  });
});
