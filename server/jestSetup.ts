process.env.NODE_ENV='test';

process.env.SERVER_PORT='55555';
process.env.APP_HOST='http://localhost:55556';

process.env.SESSION_SECRET='LAAD1_SESSION_SECRET';
process.env.SESSION_RESAVE='false';
process.env.SESSION_SAVE_UNINITIALIZED='false'
process.env.SESSION_COOKIE_SECURE='false'
process.env.SESSION_COOKIE_MAX_AGE='3600';

process.env.ACCESS_TOKEN_EXP_IN = '3600';
process.env.ACCESS_TOKEN_SECRET = 'ACCESS_TOKEN_SECRET';
process.env.REFRESH_TOKEN_SECRET = 'REFRESH_TOKEN_SECRET';

process.env.ENCRYPTION_ALGORITHM='aes-256-cbc';
process.env.ENCRYPTION_KEY = 'ENCRYPTION_KEY';
