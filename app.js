import createError from 'http-errors';
import express, {json, urlencoded} from 'express';
import session from 'express-session';
import {join, dirname} from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {fileURLToPath} from 'url';
import mongoose, {connect} from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

import indexRouter from './routes/index.js';
import postRouter from './routes/post.js';
import userRouter from './routes/user.js';
import passport from './config/passport.js';

const app = express();

// db setup
connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

// view engine setup
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false},
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
  // res.render('pages/error');
});

export default app;
