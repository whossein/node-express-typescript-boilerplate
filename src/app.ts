import express from 'express';
import helmet from 'helmet';
import config from './config/config';
import * as morgan from './config/morgan';
import { xss } from 'express-xss-sanitizer';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import { authLimiter } from './middlewares/rateLimiter';
import routes from './routes/v1';
import httpStatus from 'http-status';
import { errorConverter, errorHandler } from './middlewares/error';
import mongoSanitize from 'express-mongo-sanitize';
import ApiError from './utils/apiError.js';
import { jwtStrategy } from './config/passport';

const app = express();

const env = config.env;

if (env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
// passport.use(
//   'jwt',
//   // config.jwt
//   new JWTStrategy({
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.SECRET_KEY || 'jvns',
//   }),
// );

// limit repeated failed requests to auth endpoints
if (env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
export default app;
