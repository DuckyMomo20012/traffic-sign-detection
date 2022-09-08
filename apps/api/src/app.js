import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import express from 'express';
import createError from 'http-errors';
import logger from 'morgan';

import indexRouter from './routes/index.js';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(fileURLToPath(new URL('./public', import.meta.url))));

app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send('');
});

export default app;
