const router = require('express').Router();
const { validateRegistration, validateAuthorization } = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const userRouters = require('./users');
const movieRouters = require('./movies');
const { login, createUser, logout } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');

router.post('/signup', validateRegistration, createUser);

router.post('/signin', validateAuthorization, login);

router.post('/signout', logout);

router.use('/users', auth, userRouters);
router.use('/movies', auth, movieRouters);

router.use((req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

module.exports = router;
