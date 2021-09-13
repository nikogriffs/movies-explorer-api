const Movie = require('../models/movie');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, thumbnail, movieId, nameRU, nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(200).send(movie))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error('NotFound'))
    .then((movie) => {
      if (JSON.stringify(req.user._id) === JSON.stringify(movie.owner)) {
        return Movie.findByIdAndDelete(req.params.movieId)
          .then(() => {
            res.status(200).send({ message: 'Данные успешно удалёны' });
          });
      }
      return next(new ForbiddenError('Доступ к данным запрещён'));
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return next(new NotFoundError('Данные по указанному ID не найдены'));
      }
      return next(err);
    });
};
