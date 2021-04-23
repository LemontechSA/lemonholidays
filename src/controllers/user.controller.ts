import { authenticate, TokenService } from '@loopback/authentication';
import {
    Credentials,
    MyUserService,
    TokenServiceBindings,
    User,
    UserRepository,
    UserServiceBindings
} from '@loopback/authentication-jwt';
import { inject } from '@loopback/core';
import { model, property, repository } from '@loopback/repository';
import {
    get,
    getModelSchemaRef,
    post,
    requestBody,
    SchemaObject,
    HttpErrors,
    api,
    response
} from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { genSalt, hash } from 'bcryptjs';
import omit from 'lodash/omit';

@model({
    settings: {
        strictObjectIDCoercion: true,
        mongodb: { collection: 'user' },
    }
})
export class UserRequest extends User {
    @property({
        type: 'string',
        id: true,
        mongodb: { dataType: 'ObjectId' }
    })
    id: string;

    @property({
        type: 'string',
        required: true,
    })
    password: string;
}

const CredentialsSchema: SchemaObject = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {
            type: 'string',
            format: 'email',
        },
        password: {
            type: 'string',
            minLength: 8,
        },
    },
};

export const CredentialsRequestBody = {
    description: 'The input of login function',
    required: true,
    content: {
        'application/json': { schema: CredentialsSchema },
    },
};

@api({
    basePath: '/users',
    paths: {
        '/login': {
            post: {
                operationId: 'UserController.login',
                'x-operation-name': 'login',
                'x-controller-name': 'UserController',
            }
        },
        '/signup': {
            post: {
                operationId: 'UserController.signup',
                'x-operation-name': 'signup',
                'x-controller-name': 'UserController',
            }
        },
        '/whoAmI': {
            get: {
                operationId: 'UserController.whoAmI',
                'x-operation-name': 'whoAmI',
                'x-controller-name': 'UserController',
            }
        },
    },
})

export class UserController {
    constructor(
        @inject(TokenServiceBindings.TOKEN_SERVICE)
        public jwtService: TokenService,
        @inject(UserServiceBindings.USER_SERVICE)
        public userService: MyUserService,
        @inject(SecurityBindings.USER, { optional: true })
        public user: UserProfile,
        @repository(UserRepository) protected userRepository: UserRepository,
    ) { }

    @post('/login')
    @response(200, {
        description: "Login User",
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string'
                        }
                    }
                }
            }
        }
    })
    async login(
        @requestBody(CredentialsRequestBody) credentials: Credentials,
    ): Promise<{ token: string }> {
        const user = await this.userService.verifyCredentials(credentials);
        const userProfile = this.userService.convertToUserProfile(user);
        const token = await this.jwtService.generateToken(userProfile);
        return { token };
    }

    @authenticate('jwt')
    @get('/whoAmI')
    @response(200, {
        description: 'logged in user',
        content: { 'application/json': { schema: { type: 'string' } } },
    })
    async whoAmI(
        @inject(SecurityBindings.USER)
        currentUserProfile: UserProfile,
    ): Promise<string> {
        return currentUserProfile[securityId];
    }

    @post('/signup')
    @response(200, {
        description: 'Create user',
        content: { 'application/json': { schema: getModelSchemaRef(User) } },
    })
    async signUp(
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(UserRequest, {
                        title: 'NewUser',
                    }),
                },
            },
        })
        userRequest: UserRequest,
    ): Promise<User> {
        const userFind = await this.userRepository.find({ where: { email: userRequest.email } })
        if (userFind.length === 0) {
            const password = await hash(userRequest.password, await genSalt());
            const savedUser = await this.userRepository.create(
                omit(userRequest, 'password'),
            );
            await this.userRepository.userCredentials(savedUser.id).create({ password });
            return savedUser;
        } else {
            throw new HttpErrors.Conflict('Email value is already taken');
        }



    }
}
