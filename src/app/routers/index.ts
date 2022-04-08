import { Router } from 'express';
import { container } from '../../di-config';
import { ApiRouter } from './api';

export function MainRouter (): Router {
  const router = Router();
  router.use('/auth', container.resolve('authRouter'));
  router.use('/api', ApiRouter());

  return router;
}
