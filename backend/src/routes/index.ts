import { Request, Response, Router } from 'express';

import userRouter from '../modules/user/user.router';

const routes = Router();

routes.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

routes.use('/users', userRouter);

export default routes;
