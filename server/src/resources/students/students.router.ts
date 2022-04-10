import { Router } from 'express';
import { checkAuthorization, RequestHandler, validateBody, validateParams } from '../../utils';
import { CreateStudentPayloadSchema, FindStudentsSchema, StudentIdSchema, UpdateStudentSchema } from './students.dto';
import { StudentsController } from './students.controller';
import { ResourceTypes } from '../roles';

export function StudentsRouter ({ studentsController }: { studentsController: StudentsController }): Router {
  const router = Router();

  /**
   * @swagger
   * /api/students/{studentId}:
   *      get:
   *          tags:
   *              - Students
   *          description: Get student
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          parameters:
   *              - name: studentId
   *                in: path
   *                required: true
   */
  router.get('/:studentId', validateParams(StudentIdSchema), RequestHandler(studentsController.get));

  /**
   * @swagger
   * /api/students/find:
   *      post:
   *          tags:
   *              - Students
   *          description: Search students
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          requestBody:
   *              description: Search students
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/findStudents'
   */
  router.post('/find', validateBody(FindStudentsSchema), RequestHandler(studentsController.find));

  /**
  * @swagger
  * /api/students:
  *      post:
  *          tags:
  *              - Students
  *          description: Create student
  *          responses:
  *              '200':
  *                  description: OK
  *          security:
  *              - Bearer: []
  *          requestBody:
  *              description: Student data
  *              required: true
  *              content:
  *                  application/json:
  *                      schema:
  *                          $ref: '#/components/schemas/createStudent'
  */
  router.post('/', checkAuthorization(ResourceTypes.masterData, 'create'), validateBody(CreateStudentPayloadSchema), RequestHandler(studentsController.create));

  /**
   * @swagger
   * /api/students:
   *      put:
   *          tags:
   *              - Students
   *          description: Update student
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          requestBody:
   *              description: Update student data
   *              required: true
   *              content:
   *                  application/json:
   *                      schema:
   *                          $ref: '#/components/schemas/updateStudent'
   */
  router.put('/', checkAuthorization(ResourceTypes.masterData, 'update'), validateBody(UpdateStudentSchema), RequestHandler(studentsController.update));

  /**
   * @swagger
   * /api/students/{studentId}:
   *      delete:
   *          tags:
   *              - Students
   *          description: Delete student
   *          responses:
   *              '200':
   *                  description: OK
   *          security:
   *              - Bearer: []
   *          parameters:
   *              - name: studentId
   *                in: path
   *                required: true
   */
  router.delete('/:studentId', checkAuthorization(ResourceTypes.masterData, 'delete'), validateParams(StudentIdSchema), RequestHandler(studentsController.delete));

  return router;
}
