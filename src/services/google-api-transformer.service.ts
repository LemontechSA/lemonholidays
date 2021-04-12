import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { Holidays } from '../models/holidays.model';

@injectable({scope: BindingScope.TRANSIENT})
export class GoogleApiTransformerService {
  private origin: string = 'ApiGoogle';

  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
  transformer(data: any, country: string) {
    if (data) {
      const dataTranformer = [];

      if (Object.prototype.hasOwnProperty.call(data, 'items')) {
        for (const item of data.items) {
          const model = new Holidays();
  
          if (Object.prototype.hasOwnProperty.call(item, 'summary')) {
            model.name = item['summary'];
          }
  
          if (Object.prototype.hasOwnProperty.call(item, 'start')) {
            model.date = item['start']['date'];
          }
  
          model.country = country;
          model.origin = this.origin;
          model.active = true;
  
          dataTranformer.push(model);
        }
  
        return dataTranformer;
      }
    }
  }
}
