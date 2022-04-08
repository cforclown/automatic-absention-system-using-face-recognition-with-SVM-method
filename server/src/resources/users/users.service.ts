import { ChangeAvatarPayload, CreateUserPayload, FindUsersPayload, FindUsersResult, UpdateUserPayload, User, UserAvatar, UsersDao } from '.';
import { Role, RolesService } from '../roles';
import { LoginPayload } from '../auth';
import { RestApiException } from '../../exceptions';
import { hashPassword } from '../../utils';

export class UsersService {
  private readonly usersDao: UsersDao;
  private readonly rolesService: RolesService;

  constructor ({ usersDao, rolesService }: { usersDao: UsersDao; rolesService: RolesService; }) {
    this.usersDao = usersDao;
    this.rolesService = rolesService;
  }

  async authenticate ({ username, password }: LoginPayload): Promise<User | null> {
    return this.usersDao.authenticate({
      username,
      password: (await hashPassword(password))
    });
  }

  get (userId: string, leanObject?: boolean): Promise<User | null> {
    return this.usersDao.get(userId, leanObject);
  }

  find (dto: FindUsersPayload): Promise<FindUsersResult> {
    return this.usersDao.find(dto);
  }

  isUsernameAvailable (username: string, exclude?: string): Promise<boolean> {
    return this.usersDao.isUsernameAvailable(username, exclude);
  }

  isEmailAvailable (email: string, exclude?: string): Promise<boolean> {
    return this.usersDao.isEmailAvailable(email, exclude);
  }

  async create (payload: CreateUserPayload): Promise<User> {
    const [isUsernameAvailable, isEmailAvailable, isRoleValid] = await Promise.all([
      this.isUsernameAvailable(payload.username),
      payload.email ? this.isEmailAvailable(payload.email) : Promise.resolve(true),
      this.rolesService.get(payload.role)
    ]);
    if (!isUsernameAvailable) {
      throw new RestApiException('Username is taken');
    }
    if (!isEmailAvailable) {
      throw new RestApiException('Email already registered');
    }
    if (!isRoleValid) {
      throw new RestApiException('Invalid role');
    }

    return this.usersDao.create({
      ...payload,
      password: (await hashPassword(payload.password))
    });
  }

  async update (payload: UpdateUserPayload): Promise<User> {
    if (!payload.fullname && !payload.username && !payload.role && payload.email === undefined) {
      throw new RestApiException('One of the parameters should be filled');
    }
    const [isUsernameAvailable, isEmailAvailable, isRoleValid] = await Promise.all([
      payload.username ? this.isUsernameAvailable(payload.username as string) : Promise.resolve(true),
      payload.email ? this.isEmailAvailable(payload.email) : Promise.resolve(true),
      payload.role ? this.rolesService.get(payload.role) : Promise.resolve(true)
    ]);
    if (!isUsernameAvailable) {
      throw new RestApiException('Username is taken');
    }
    if (!isEmailAvailable) {
      throw new RestApiException('Email already registered');
    }
    if (!isRoleValid) {
      throw new RestApiException('Role is not valid');
    }

    return this.usersDao.update(payload);
  }

  getUserAvatar (userId: string): Promise<UserAvatar | undefined> {
    return this.usersDao.getUserAvatar(userId);
  }

  changeUserAvatar (userId: string, avatar: ChangeAvatarPayload): Promise<User> {
    return this.usersDao.changeUserAvatar(userId, avatar);
  }

  delete (userId: string): Promise<User> {
    return this.usersDao.delete(userId);
  }

  async getUserPermissions (userId: string): Promise<Role> {
    const user = await this.usersDao.get(userId);
    if (!user) {
      throw new RestApiException('User not found');
    }
    return user.role as Role;
  }
}
