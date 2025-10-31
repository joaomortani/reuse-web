declare module 'cors' {
  import type { RequestHandler } from 'express';

  interface CorsOptions {
    origin?:
      | boolean
      | string
      | RegExp
      | Array<string | RegExp>
      | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void);
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
  }

  type CorsRequestHandler = RequestHandler;

  interface Cors {
    (options?: CorsOptions): CorsRequestHandler;
    (optionsDelegate: (
      req: import('http').IncomingMessage,
      callback: (err: Error | null, options?: CorsOptions) => void,
    ) => void): CorsRequestHandler;
  }

  const cors: Cors;
  export = cors;
}
