import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { Holidays } from '../models/holidays.model';

@injectable({scope: BindingScope.TRANSIENT})
export class ApiChileTranformerService {
  private country: string = 'Chile';
  private origin: string = 'ApiChile';

  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
  transformer(data: any) {
    if (data) {
      const dataTranformer = [];

      for (const item of data) {
        const model = new Holidays();

        if (Object.prototype.hasOwnProperty.call(item, 'nombre')) {
          model.name = item['nombre'];
        }

        if (Object.prototype.hasOwnProperty.call(item, 'fecha')) {
          model.date = item['fecha'];
        }

        model.country = this.country;
        model.origin = this.origin;
        model.active = true;

        dataTranformer.push(model);
      }

      return dataTranformer;
    }
  }
}
