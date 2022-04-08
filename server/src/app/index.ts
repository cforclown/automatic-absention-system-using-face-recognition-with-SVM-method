'use strict';

import { Environment } from '../common';
import express, { Express } from 'express';
import logger from 'morgan';
import expressFlash from 'express-flash';
import expressSession from 'express-session';
import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import passport from 'passport';
import swaggerUI from 'swagger-ui-express';
import swaggerConfig from '../swagger/configs';
import { container } from '../di-config';
import { InitLocalStrategy } from '../resources';
import path from 'path';
import { MainRouter } from './routers';

function App (): Express {
  const app = express();
  app.use(logger('dev'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.use(
    cors({
      origin: Environment.getAppHost(),
      credentials: true
    })
  );
  app.use(expressFlash());
  app.use(
    expressSession({
      secret: Environment.getSessionSecret(),
      resave: Environment.getSessionResave(),
      saveUninitialized: Environment.getSessionSaveUninitialized(),
      cookie: {
        secure: Environment.getSessionCookieSecure(),
        maxAge: Environment.getSessionCookieMaxAge()
      }
    })
  );

  // #region ============================ SWAGGER CONFIG =============================
  // reference: https://swagger.io/specification/#infoObject
  const swaggerDocs = swaggerJsDoc(swaggerConfig);
  app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
  // #endregion -----------------------------------------------------------------------

  app.use(passport.initialize());
  app.use(passport.session());
  const authService = container.resolve('authService');
  InitLocalStrategy(passport, authService);

  app.use('/', MainRouter());

  // TODO: REMOVE AFTER FRONT-END FINISHED
  app.use(express.static(path.join(__dirname, '../../public')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

  return app;
}

export default App;
