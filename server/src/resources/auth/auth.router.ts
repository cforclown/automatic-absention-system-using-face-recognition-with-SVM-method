import express from 'express';
import passport from 'passport';
import { dro, RequestHandler, validateBody } from '../../utils';
import { HttpCodes } from '../../exceptions';
import { LoginPayloadSchema, RefreshTokenPayloadSchema } from '.';
import { AuthController } from './auth.controller';

export function AuthRouter ({ authController }: { authController: AuthController }): express.Router {
  const router = express.Router();

  /**
   * @swagger
   * /auth/login:
   *      post:
   *          tags:
   *              - Authentication
   *          description: Login
   *          responses:
   *              '200':
   *                  description: Login Success
   *          requestBody:
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/login'
   */
  router.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/auth/login/verify',
      failureRedirect: '/auth/login/error',
      failureFlash: true
    })
  );

  router.post('/login/test', validateBody(LoginPayloadSchema), RequestHandler(authController.login));
  router.get('/login/verify', RequestHandler(authController.verify));
  router.get('/login/error', async (req, res) => res.status(HttpCodes.NotFound).send(dro.error('Authentication error')));

  /**
   * @swagger
   * /auth/refresh:
   *      post:
   *          tags:
   *              - Authentication
   *          description: Refresh Token
   *          responses:
   *              '200':
   *                  description: Access token has been refreshed
   *          security:
   *              - Bearer: []
   *          requestBody:
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/refreshToken'
   */
  router.post('/refresh', validateBody(RefreshTokenPayloadSchema), RequestHandler(authController.refresh));

  /**
   * @swagger
   * /auth/logout:
   *      delete:
   *          tags:
   *              - Authentication
   *          description: Logout success
   *          responses:
   *              '200':
   *                  description: Logout Success
   *          security:
   *              - Bearer: []
   */
  router.delete('/logout', RequestHandler(async () => Promise.resolve(true)));

  return router;
}
