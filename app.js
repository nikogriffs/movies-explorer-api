require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/loggers');
const limiter = require('./middlewares/limiter');
const { errorHandler } = require('./middlewares/error-handler');
const routers = require('./routes/index');

const { PORT = 3000, NODE_ENV, MONGO_URL } = process.env;
const app = express();

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/bitfilmsdb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use(cors({
  credentials: true,
  origin: [
    'https://diploma.nikogriffs.nomoredomains.monster',
    'https://api.diploma.nikogriffs.nomoredomains.monster',
    'http://diploma.nikogriffs.nomoredomains.monster',
    'http://api.diploma.nikogriffs.nomoredomains.monster',
    'https://localhost:3000',
    'http://localhost:3000',
  ],
}));

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routers);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT);
