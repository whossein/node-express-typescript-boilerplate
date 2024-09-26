export * as userService from './user.service.js';
export * as emailService from './email.service.js';
export * as tokenService from './token.service.js';
export * as authService from './auth.service.js';

module.exports.authService = require('./auth.service');
module.exports.emailService = require('./email.service');
module.exports.tokenService = require('./token.service');
module.exports.userService = require('./user.service');
