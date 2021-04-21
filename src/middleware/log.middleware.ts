import { Next } from '@loopback/core'
import { Middleware, MiddlewareContext } from '@loopback/rest'
import * as Sentry from "@sentry/node";

export const logMiddleware: Middleware = async (middlewareCtx: MiddlewareContext, next: Next) => {
  Sentry.init({
    dsn: process.env.DSN_SENTRY,
    tracesSampleRate: 1.0,
    environment: process.env.ENVIRONMENT
  });
  try {
    const result = await next();
    return result;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}
