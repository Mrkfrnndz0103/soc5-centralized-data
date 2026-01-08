import "server-only"
import { AsyncLocalStorage } from "node:async_hooks"

type RequestContext = {
  route: string
}

const requestContext = new AsyncLocalStorage<RequestContext>()

export function getRequestContext() {
  return requestContext.getStore()
}

type RouteHandler<TContext> = (request: Request, context: TContext) => Promise<Response> | Response

export function withRequestLogging(route: string, handler: RouteHandler<void>): (request: Request) => Promise<Response>
export function withRequestLogging<TContext>(
  route: string,
  handler: RouteHandler<TContext>
): (request: Request, context: TContext) => Promise<Response>
export function withRequestLogging<TContext>(
  route: string,
  handler: RouteHandler<TContext>
): (request: Request, context?: TContext) => Promise<Response> {
  return async function wrapped(request: Request, context?: TContext) {
    const start = Date.now()
    const method = request.method
    return requestContext.run({ route }, async () => {
      let status = 500
      try {
        const response = await handler(request, context as TContext)
        status = response.status
        return response
      } finally {
        const ms = Date.now() - start
        const payload = { type: "api.request", route, method, status, ms }
        console.log(JSON.stringify(payload))
      }
    })
  }
}
