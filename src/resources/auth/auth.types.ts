import { User } from '..';

export interface AccessToken {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}
