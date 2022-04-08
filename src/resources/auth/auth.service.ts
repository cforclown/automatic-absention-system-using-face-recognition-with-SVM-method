import { sign, verify } from 'jsonwebtoken';
import { AccessToken, LoginPayload } from '.';
import { Role, RolesService, User, UsersService } from '..';
import { Environment } from '../../common';
import { RestApiException } from '../../exceptions';

export class AuthService {
  usersService: UsersService;
  rolesService: RolesService;

  constructor ({ usersService, rolesService }: { usersService: UsersService, rolesService: RolesService; }) {
    this.usersService = usersService;
    this.rolesService = rolesService;
  }

  async getUser (userId: string): Promise<User> {
    const user = await this.usersService.get(userId, true);
    if (!user) {
      throw new RestApiException('User not found');
    }
    return user;
  }

  async authenticate (payload: LoginPayload): Promise<User> {
    const user = await this.usersService.authenticate(payload);
    if (!user) {
      throw new RestApiException('User not found');
    }
    return user;
  }

  async login (payload: LoginPayload): Promise<AccessToken> {
    const user = await this.usersService.authenticate(payload);
    if (!user) {
      throw new RestApiException('Incorrect username or password');
    }
    return this.generateAccessToken(user);
  }

  async verify (user: User): Promise<AccessToken> {
    return this.generateAccessToken(user);
  }

  async refresh (refreshToken: string): Promise<AccessToken> {
    const tokenData = verify(refreshToken, Environment.getRefreshTokenSecret());
    const user = await this.usersService.get((tokenData as User)._id, true);
    if (!user) {
      throw new RestApiException('Refresh token is not valid');
    }
    return this.generateAccessToken(user);
  }

  generateAccessToken (user: User): AccessToken {
    const expiresIn = Environment.getAccessTokenExpIn();
    const accessToken = sign(user, Environment.getAccessTokenSecret(), { expiresIn });
    const refreshToken = sign(user, Environment.getRefreshTokenSecret(), {
      expiresIn: Environment.getAccessRefreshTokenExpIn()
    });

    user.role = {
      _id: (user.role as Role)._id,
      name: (user.role as Role).name,
      desc: (user.role as Role).desc
    };

    return {
      user,
      accessToken,
      refreshToken,
      expiresIn
    };
  }
}
