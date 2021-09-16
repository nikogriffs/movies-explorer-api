const { messageServerError } = require('../utils/messages');

module.exports.errorHandler = ((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? messageServerError : message,
  });
  return next();
});
