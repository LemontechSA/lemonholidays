import {
    AuthenticateFn,
    AuthenticationBindings,
    AUTHENTICATION_STRATEGY_NOT_FOUND,
    USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';
import {
    RequestContext,
    SequenceHandler,
    SequenceActions,
    FindRoute,
    ParseParams,
    InvokeMethod,
    Send,
    Reject
} from '@loopback/rest';
import * as Sentry from "@sentry/node";
import { inject } from '@loopback/core';

export class MySequence implements SequenceHandler {
    constructor(
        @inject(AuthenticationBindings.AUTH_ACTION)
        protected authenticateRequest: AuthenticateFn,
        @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
        @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
        @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
        @inject(SequenceActions.SEND) public send: Send,
        @inject(SequenceActions.REJECT) public reject: Reject,
    ) { }

    async handle(context: RequestContext) {
        Sentry.init({
            dsn: process.env.DNS_SENTRY,
            tracesSampleRate: 1.0,
            environment: process.env.ENVIRONMENT
        });

        try {
            // findRoute() produces an element
            const route = this.findRoute(context.request);
            // call authentication action
            await this.authenticateRequest(context.request);
            // parseParams() uses the route element and produces the params element
            const params = await this.parseParams(context.request, route);
            // invoke() uses both the route and params elements to produce the result (OperationRetVal) element
            const result = await this.invoke(route, params);
            // send() uses the result element
            this.send(context.response, result);
        } catch (error) {
            if (
                error.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
                error.code === USER_PROFILE_NOT_FOUND
            ) {
                Object.assign(error, { statusCode: 401 });
            }
            Sentry.captureException(error);
            this.reject(context, error);
        }
    }
}
