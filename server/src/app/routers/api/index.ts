import { Router } from 'express';
import { container } from '../../../di-config';
import { authenticateRequest } from '../../../resources/auth/authenticate-request';

export function ApiRouter (): Router {
  const router = Router();
  router.use(authenticateRequest(['/api/users/avatar']));
  router.use('/users', container.resolve('usersRouter'));
  router.use('/roles', container.resolve('rolesRouter'));
  router.use('/students', container.resolve('studentsRouter'));

  return router;
}
