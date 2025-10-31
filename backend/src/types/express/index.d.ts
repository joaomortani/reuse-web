declare module 'express' {
  interface Request {
    body?: unknown;
    params: Record<string, string>;
    query: Record<string, unknown>;
    headers: Record<string, string | string[] | undefined>;
    user?: {
      id: string;
    };
    header(name: string): string | undefined;
  }

  interface Response {
    json(body: unknown): Response;
    status(code: number): Response;
  }

  type NextFunction = (err?: unknown) => void;

  type RequestHandler = (req: Request, res: Response, next: NextFunction) => unknown;

  interface Router {
    use: (...handlers: Array<string | RequestHandler | Router>) => Router;
    get: (...handlers: Array<string | RequestHandler>) => Router;
    post: (...handlers: Array<string | RequestHandler>) => Router;
  }

  interface Application {
    use: (...handlers: Array<string | RequestHandler | Router>) => Application;
    get: (...handlers: Array<string | RequestHandler>) => Application;
    post: (...handlers: Array<string | RequestHandler>) => Application;
    listen(port: number, callback?: () => void): void;
  }

  function Router(): Router;
  function json(): RequestHandler;

  interface ExpressModule {
    (): Application;
    Router: typeof Router;
    json: typeof json;
  }

  const express: ExpressModule;

  export default express;
  export { Request, Response, NextFunction, Router, Application, RequestHandler };
}
