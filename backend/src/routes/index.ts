import { Request, Response, Router } from 'express';

const routes = Router();

routes.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export default routes;
