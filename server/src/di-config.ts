import { asClass, asFunction, createContainer, InjectionMode } from 'awilix';
import {
  AuthController,
  AuthRouter,
  AuthService,
  RolesController,
  RolesDao,
  RolesRouter,
  RolesService,
  StudentsController,
  StudentsDao,
  StudentsRouter,
  StudentsService,
  UsersController,
  UsersDao,
  UsersRouter,
  UsersService
} from './resources';

export const container = createContainer({
  injectionMode: InjectionMode.PROXY
});

export function setup (): void {
  container.register({
    authRouter: asFunction(AuthRouter),
    authController: asClass(AuthController),
    authService: asClass(AuthService),
    usersRouter: asFunction(UsersRouter),
    usersController: asClass(UsersController),
    usersService: asClass(UsersService),
    usersDao: asClass(UsersDao),
    rolesRouter: asFunction(RolesRouter),
    rolesController: asClass(RolesController),
    rolesService: asClass(RolesService),
    rolesDao: asClass(RolesDao),
    studentsRouter: asFunction(StudentsRouter),
    studentsController: asClass(StudentsController),
    studentsService: asClass(StudentsService),
    studentsDao: asClass(StudentsDao)
  });
}
