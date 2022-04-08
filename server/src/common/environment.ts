import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({
  path: resolve('./', process.env.NODE_ENV + '.env')
});

export function getEnvOrThrow (environmentVariableName: string): string {
  const value = process.env[environmentVariableName];
  if (!value) {
    throw new Error(`Environment variable ${environmentVariableName} not set!`);
  }
  return value;
}

export const Environment = {
  getNodeEnv: (): 'development' | 'test' | 'production' => {
    const value = getEnvOrThrow('NODE_ENV');
    if (value !== 'development' && value !== 'test' && value !== 'production') {
      throw new Error('Environment variable NODE_ENV not set!');
    }
    return value;
  },

  getServerPort: (): string => getEnvOrThrow('SERVER_PORT'),
  getAppHost: (): string[] => {
    const appHost = getEnvOrThrow('APP_HOST');
    return appHost.split(',').filter(h => !!h);
  },

  getDBUri: (): string => `mongodb://${getEnvOrThrow('DB_HOST')}:${getEnvOrThrow('DB_PORT')}`,
  getDBName: (): string => getEnvOrThrow('DB_NAME'),
  getDBUsername: (): string => getEnvOrThrow('DB_USERNAME'),
  getDBPassword: (): string => getEnvOrThrow('DB_PASSWORD'),

  getSessionSecret: (): string => getEnvOrThrow('SESSION_SECRET'),
  getSessionResave: (): boolean => getEnvOrThrow('SESSION_RESAVE') === 'true',
  getSessionSaveUninitialized: (): boolean => getEnvOrThrow('SESSION_SAVE_UNINITIALIZED') === 'true',
  getSessionCookieSecure: (): boolean => getEnvOrThrow('SESSION_COOKIE_SECURE') === 'true',
  getSessionCookieMaxAge: (): number => parseInt(getEnvOrThrow('SESSION_COOKIE_MAX_AGE')),

  getAccessTokenSecret: (): string => getEnvOrThrow('ACCESS_TOKEN_SECRET'),
  getRefreshTokenSecret: (): string => getEnvOrThrow('REFRESH_TOKEN_SECRET'),
  getAccessTokenExpIn: (): number => parseInt(getEnvOrThrow('ACCESS_TOKEN_EXP_IN')),
  getAccessRefreshTokenExpIn: (): number => parseInt(getEnvOrThrow('ACCESS_TOKEN_EXP_IN')) * 2,

  getEncryptionAlgorithm: (): string => getEnvOrThrow('ENCRYPTION_ALGORITHM'),
  getEncryptionKey: (): string => getEnvOrThrow('ENCRYPTION_KEY')
};
