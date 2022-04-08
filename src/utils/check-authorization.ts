import { NextFunction, Request, Response } from 'express';
import { dro } from './dro';
import { HttpCodes } from '../exceptions';
import { SaveError } from '../common';
import { PermissionAction, ResourceTypes, Role, User } from '../resources';

export function checkAuthorization (resourceType: ResourceTypes, action: PermissionAction, forbiddenMsg = `You don't have the authority to '${action}' on resource '${resourceType}'`) {
  return (req: Request, res: Response, next: NextFunction): any => {
    try {
      if (!req.user) {
        return res.status(HttpCodes.Unauthorized).send(dro.error('UNAUTHORIZED'));
      }
      if (!((req.user as User).role as Role).permissions[resourceType][action]) {
        return res.status(HttpCodes.Forbidden).send(dro.error(forbiddenMsg));
      }

      return next();
    } catch (err) {
      if (err instanceof Error) {
        SaveError(err);
      }
      return res.status(HttpCodes.Forbidden).send(dro.error(forbiddenMsg));
    }
  };
}
