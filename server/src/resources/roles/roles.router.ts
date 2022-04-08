import { Router } from 'express';
import { checkAuthorization, RequestHandler, validateBody, validateParams } from '../../utils';
import { CreateRolePayloadSchema, FindRolesSchema, RoleIdSchema, UpdateRoleSchema } from './roles.dto';
import { RolesController } from './roles.controller';
import { ResourceTypes } from './roles.types';

export function RolesRouter ({ rolesController }: { rolesController: RolesController }): Router {
  const router = Router();

  /**
   * @swagger
   * /api/roles/{roleId}:
   *      get:
   *          tags:
   *              - Roles
   *          description: Get role
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          parameters:
   *              - name: roleId
   *                in: path
   *                required: true
   */
  router.get('/:roleId', validateParams(RoleIdSchema), RequestHandler(rolesController.get));

  /**
   * @swagger
   * /api/roles/find:
   *      post:
   *          tags:
   *              - Roles
   *          description: Search roles
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          requestBody:
   *              description: Search roles
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/findRoles'
   */
  router.post('/find', validateBody(FindRolesSchema), RequestHandler(rolesController.find));

  /**
  * @swagger
  * /api/roles:
  *      post:
  *          tags:
  *              - Roles
  *          description: Create role
  *          responses:
  *              '200':
  *                  description: OK
  *          security:
  *              - Bearer: []
  *          requestBody:
  *              description: Role data
  *              required: true
  *              content:
  *                  application/json:
  *                      schema:
  *                          $ref: '#/components/schemas/createRole'
  */
  router.post('/', checkAuthorization(ResourceTypes.masterData, 'create'), validateBody(CreateRolePayloadSchema), RequestHandler(rolesController.create));

  /**
   * @swagger
   * /api/roles:
   *      put:
   *          tags:
   *              - Roles
   *          description: Update role
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          requestBody:
   *              description: Update role data
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/updateRole'
   */
  router.put('/', checkAuthorization(ResourceTypes.masterData, 'update'), validateBody(UpdateRoleSchema), RequestHandler(rolesController.update));

  /**
   * @swagger
   * /api/roles/{roleId}:
   *      delete:
   *          tags:
   *              - Roles
   *          description: Delete role
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          parameters:
   *              - name: roleId
   *                in: path
   *                required: true
   */
  router.delete('/:roleId', checkAuthorization(ResourceTypes.masterData, 'delete'), validateParams(RoleIdSchema), RequestHandler(rolesController.delete));

  /**
   * @swagger
   * /api/roles/role/default:
   *      get:
   *          tags:
   *              - Roles
   *          description: Get default role
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          parameters:
   *              - name: roleId
   *                in: path
   *                required: true
   */
  router.get('/role/default', RequestHandler(rolesController.getDefault));

  /**
   * @swagger
   * /api/roles/role/default:
   *      put:
   *          tags:
   *              - Roles
   *          description: Set default role
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          requestBody:
   *              description: Update role data
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/updateRole'
   */
  router.put('/role/default', checkAuthorization(ResourceTypes.masterData, 'update'), validateBody(RoleIdSchema), RequestHandler(rolesController.setDefault));

  return router;
}
