import { PassportStatic } from 'passport';
import passportLocal from 'passport-local';
import { AuthService, User } from '../';
import { RestApiException } from '../../exceptions';
export function InitLocalStrategy (passport: PassportStatic, authService: AuthService): void {
  passport.use(new passportLocal.Strategy(async (username: string, password: string, done) => {
    try {
      const user = await authService.authenticate({ username, password });
      return done(null, user);
    } catch (error) {
      if (error instanceof RestApiException) {
        return done(null, false, { message: 'User not found' });
      } else {
        return done(error);
      }
    }
  }));
  passport.serializeUser((user, done) => {
    done(null, (user as User)._id);
  });
  passport.deserializeUser(async (userId: string, done) => {
    try {
      const user = await authService.getUser(userId);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
}
