import {inject, injectable} from '@loopback/core';
import {
  asSpecEnhancer,
  HttpErrors,
  mergeSecuritySchemeToSpec,
  OASEnhancer,
  OpenApiSpec,
  Request,
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {asAuthStrategy, AuthenticationStrategy} from '../../../types';
import {BasicAuthenticationStrategyBindings} from '../keys';
import {BasicAuthenticationUserService} from '../services/basic-auth-user-service';

export interface AppKeyAuthenticationStrategyCredentials {
  name: string;
  key: string;
}

@injectable(asAuthStrategy, asSpecEnhancer)
export class AppKeyAuthenticationStrategy
  implements AuthenticationStrategy, OASEnhancer {
  name = 'appKey';

  constructor(
    @inject(BasicAuthenticationStrategyBindings.USER_SERVICE)
    private userService: BasicAuthenticationUserService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const credentials: AppKeyAuthenticationStrategyCredentials = this.extractCredentials(
      request,
    );
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);

    return userProfile;
  }

  extractCredentials(request: Request): AppKeyAuthenticationStrategyCredentials {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    // for example : Appey Z2l6bW9AZ21haWwuY29tOnBhc3N3b3Jk
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('AppKey')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'AppKey'.`,
      );
    }

    //split the string into 2 parts. We are interested in the base64 portion
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'AppKey xxyyzz' where xxyyzz is a base64 string.`,
      );
    const encryptedCredentails = parts[1];

    // decrypt the credentials. Should look like :   'name:key'
    const decryptedCredentails = Buffer.from(
      encryptedCredentails,
      'base64',
    ).toString('utf8');

    //split the string into 2 parts
    const decryptedParts = decryptedCredentails.split(':');

    if (decryptedParts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        `Authorization header 'Basic' value does not contain two parts separated by ':'.`,
      );
    }

    const creds: AppKeyAuthenticationStrategyCredentials = {
      name: decryptedParts[0],
      key: decryptedParts[1],
    };

    return creds;
  }

  modifySpec(spec: OpenApiSpec): OpenApiSpec {
    return mergeSecuritySchemeToSpec(spec, this.name, {
      type: 'http',
      scheme: 'AppKey',
    });
  }
}