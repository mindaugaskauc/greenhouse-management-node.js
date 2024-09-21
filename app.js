var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require ('express-session'); // for logged in session
var passport = require ('passport');

//var indexRouter = require('./routes/');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var weatherTemperatureRouter = require('./routes/weathert');
var soilTemperatureRouter = require('./routes/soilt');
var soilHumidityRouter = require('./routes/soilh');
var soilPHRouter = require('./routes/soilph');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
  secret: 'secret-code',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
//Passport middleware configuration for logging out
app.use(passport.initialize());
app.use(passport.session());
//app.use('/', indexRouter);
// Works only with / request
//app.use('/', indexRouter);
//to use not only / but also /register1 requests etc
//https://zetcode.com/javascript/expressjs
//app.use(indexRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/weathert', weatherTemperatureRouter);
app.use('/soilt', soilTemperatureRouter);
app.use('/soilh', soilHumidityRouter);
app.use('/soilph', soilPHRouter);

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
  res.render('error');
});

module.exports = app;