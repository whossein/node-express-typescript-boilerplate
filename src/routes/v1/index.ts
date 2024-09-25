import express from 'express';
import config from '../../config/config';
import userRoute from './user.route';
import { Environment } from '../../config/constants';

const authRoute = require('./auth.route');
const docsRoute = require('./docs.route');

const router = express.Router();

type TRouteType = { path: string; route: any }[];

const defaultRoutes: TRouteType = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
];

const devRoutes: TRouteType = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* ignore next */
if (config.env === Environment.development) {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
