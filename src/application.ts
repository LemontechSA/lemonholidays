require('dotenv').config();
import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { MongoHolidaysDataSource } from './datasources';
import { AuthenticationComponent } from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  UserServiceBindings,
  TokenServiceBindings
} from '@loopback/authentication-jwt';



export { ApplicationConfig };

export class LemonholidaysApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    this.dataSource(MongoHolidaysDataSource, UserServiceBindings.DATASOURCE_NAME);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(process.env.JWT_SECRET ?? 'T0K3N_S3CR3T');
    // for jwt access token expiration in sec
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(process.env.JWT_EXPIRES_IN ?? '10');

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

  }
}
