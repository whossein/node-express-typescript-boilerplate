import passport from 'passport';
import httpStatus from 'http-status';
import { roleRights } from '../config/roles';
import { ApiError } from '../utils';
import { Request, Response, NextFunction } from 'express';

const verifyCallback =
  (
    req: Request,
    resolve: (val?: unknown) => void,
    reject: (error?: ApiError) => void,
    requiredRights: string[],
  ) =>
  async (err: any, user: any, info: any) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'),
      );
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      const hasRequiredRights = requiredRights.every((i: string) =>
        // @ts-ignore
        Boolean(userRights && userRights?.includes(i)),
      );
      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    resolve();
  };

const auth =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights),
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
