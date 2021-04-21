import { Next } from '@loopback/core'
import { Middleware, MiddlewareContext } from '@loopback/rest'

export const appKeyMiddleware: Middleware = async (
  middlewareCtx: MiddlewareContext,
  next: Next,
) => {
  const { request } = middlewareCtx
  console.log('Request: %s %s', request.method, request.originalUrl)
  try {
    // Proceed with next middleware
    const result = await next();
    return result;
    // Process response
    console.log('Response received for %s %s', request.method, request.originalUrl)
  } catch (err) {
    // Catch errors from downstream middleware
    console.error('Error received for %s %s', request.method, request.originalUrl)
    throw err
  }
}
