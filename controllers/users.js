const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');
const { messageEmailUsed, messageWrongEmailOrPassword, messageUserLogout } = require('../utils/messages');
const { JWT_DEV_SECRET } = require('../utils/dev-config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return next(new ConflictError(messageEmailUsed));
      }
      return next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return next(new ConflictError(messageEmailUsed));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError(messageWrongEmailOrPassword));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new UnauthorizedError(messageWrongEmailOrPassword));
          } else {
            const token = jwt.sign({ _id: user._id },
              NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_SECRET,
              { expiresIn: '7d' });

            res.cookie('jwt', token, {
              httpOnly: true, sameSite: 'none', secure: true,
            }).send({ token });
          }
        });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true, sameSite: 'none', secure: true,
  }).send({ message: messageUserLogout });
};
