const Movie = require('../models/movie');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const { messageMovieDeleted, messageMovieNotDeleted, messageMovieNotFound } = require('../utils/messages');

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
            res.status(200).send({ message: messageMovieDeleted });
          });
      }
      return next(new ForbiddenError(messageMovieNotDeleted));
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return next(new NotFoundError(messageMovieNotFound));
      }
      return next(err);
    });
};
