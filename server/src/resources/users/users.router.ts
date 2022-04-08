import { Request, Router } from 'express';
import { UsersController } from './users.controller';
import { ChangeAvatarPayloadSchema, ChangeUserRolePayloadSchema, CreateUserPayloadSchema, FindUsersSchema, UpdateProfilePayloadSchema, UserIdSchema, UsernameAvailabilitySchema } from './users.dto';
import { checkAuthorization, dro, RequestHandler, validateBody, validateParams } from '../../utils';
import { ResourceTypes } from '../roles';
import { SaveError } from '../../common';
import { HttpCodes, RestApiException } from '../../exceptions';

export function UsersRouter ({ usersController }:{usersController:UsersController}): Router {
  const router = Router();

  /**
   * @swagger
   * /api/users/{userId}:
   *      get:
   *          tags:
   *              - Users
   *          description: Get user
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          parameters:
   *              -   name: userId
   *                  in: path
   *                  required: true
   */
  router.get('/:userId', validateParams(UserIdSchema), RequestHandler(usersController.get));

  /**
   * @swagger
   * /api/users/find:
   *      post:
   *          tags:
   *              - Users
   *          description: Search users
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          requestBody:
   *              description: "Search users"
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/findUsers'
   */
  router.post('/find', validateBody(FindUsersSchema), RequestHandler(usersController.find));

  /**
   * @swagger
   * /api/users/username/available/{username}:
   *      get:
   *          tags:
   *              - Users
   *          description: Get user
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          parameters:
   *              - name: username
   *                in: path
   *                required: true
   *              - name: excludeSelf
   *                in: query
   */
  router.get('/username/available/:username', validateParams(UsernameAvailabilitySchema), RequestHandler(usersController.isUsernameAvailable));

  /**
   * @swagger
   * /api/users:
   *      post:
   *          tags:
   *              - Users
   *          description: Create user
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          requestBody:
   *              description: "User data"
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/createUser'
   */
  router.post('/', checkAuthorization(ResourceTypes.users, 'create'), validateBody(CreateUserPayloadSchema), RequestHandler(usersController.create));

  /**
   * @swagger
   * /api/users/change-role:
   *      put:
   *          tags:
   *              - Users
   *          description: Update user
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          requestBody:
   *              description: "User data"
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/changeUserRole'
   */
  router.put('/change-role', checkAuthorization(ResourceTypes.users, 'update'), validateBody(ChangeUserRolePayloadSchema), RequestHandler(usersController.changeRole));

  /**
   * @swagger
   * /api/users/{userId}:
   *      delete:
   *          tags:
   *              - Users
   *          description: Delete user
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          parameters:
   *              - name: userId
   *                in: path
   *                required: true
   */
  router.delete('/:userId', checkAuthorization(ResourceTypes.users, 'delete'), validateParams(UserIdSchema), RequestHandler(usersController.delete));

  /**
   * @swagger
   * /api/users/avatar/{userId}:
   *      get:
   *          tags:
   *              - Users
   *          description: Get user profile
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   */
  router.get('/avatar/:userId', validateParams(UserIdSchema), async (req: Request, res) => {
    try {
      const data = await usersController.getAvatar(req);
      return res.send(data);
    } catch (err) {
      if (err instanceof RestApiException) {
        return res.status(err.httpCode).send(dro.error(err.message));
      }
      if (err instanceof Error) {
        SaveError(err);
        return res.status(HttpCodes.Internal).send(dro.error(err.message));
      }
    }
  });

  /**
   * @swagger
   * /api/users/profile/details:
   *      get:
   *          tags:
   *              - Users
   *          description: Get user profile
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   */
  router.get('/profile/details', RequestHandler(usersController.getProfile));

  /**
   * @swagger
   * /api/users/profile/permissions:
   *      get:
   *          tags:
   *              - Users
   *          description: Get user permissions
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   */
  router.get('/profile/permissions', RequestHandler(usersController.getPermissions));

  /**
   * @swagger
   * /api/users/profile:
   *      put:
   *          tags:
   *              - Users
   *          description: Update user profile
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          requestBody:
   *              description: "User data"
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/updateUserProfile'
   */
  router.put('/profile', validateBody(UpdateProfilePayloadSchema), RequestHandler(usersController.updateProfile));

  /**
   * @swagger
   * /api/users/profile/avatar:
   *      put:
   *          tags:
   *              - Users
   *          description: Change user avatar
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          requestBody:
   *              description: "User data"
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/changeAvatar'
   */
  router.put('/profile/avatar', validateBody(ChangeAvatarPayloadSchema), RequestHandler(usersController.changeAvatar));

  return router;
}
