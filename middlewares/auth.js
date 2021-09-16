const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { messageNeedAuthorization } = require('../utils/messages');
const { JWT_DEV_SECRET } = require('../utils/dev-config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new UnauthorizedError(messageNeedAuthorization));
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET);
  } catch {
    return next(new UnauthorizedError(messageNeedAuthorization));
  }

  req.user = payload;

  return next();
};
