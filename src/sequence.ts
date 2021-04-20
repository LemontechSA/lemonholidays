import { DefaultSequence, RequestContext } from '@loopback/rest';
import * as Sentry from "@sentry/node";

export class MySequence extends DefaultSequence {
    async handle(context: RequestContext) {
        Sentry.init({
            dsn: process.env.DNS_SENTRY,
            tracesSampleRate: 1.0,
            environment: "production"
        });
        const transaction = Sentry.startTransaction({
            op: "transaction",
            name: "My Transaction",
        });
        try {
            // Invoke registered Express middleware
            const finished = await this.invokeMiddleware(context);
            if (finished) {
                // The response been produced by the middleware chain
                return;
            }
            // findRoute() produces an element
            const route = this.findRoute(context.request);
            // parseParams() uses the route element and produces the params element
            const params = await this.parseParams(context.request, route);
            // invoke() uses both the route and params elements to produce the result (OperationRetVal) element
            const result = await this.invoke(route, params);
            // send() uses the result element
            this.send(context.response, result);
        } catch (error) {
            Sentry.captureException(error);
            this.reject(context, error);
        } finally {
            transaction.finish();
        }
    }
}