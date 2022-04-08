import express from 'express';
import { AccessToken, AuthService } from '.';
import { User } from '..';

export class AuthController {
  private readonly authService: AuthService;

  constructor ({ authService }:{ authService: AuthService }) {
    this.authService = authService;

    this.login = this.login.bind(this);
    this.verify = this.verify.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  async login ({ body }: express.Request): Promise<AccessToken> {
    return this.authService.login(body);
  }

  async verify ({ user }: express.Request): Promise<AccessToken> {
    return this.authService.verify(user as User);
  }

  async refresh ({ body }: express.Request): Promise<AccessToken> {
    return this.authService.refresh(body.refreshToken);
  }
}
