"use strict";

/** Include libraries and modules **/

// main application
var express = require('express');
var app = express();

// if (process.env.NODE_ENV == "production" || process.env.NODE_ENV == "development") {
// 	require('newrelic');
// }
var basicAuth = require('basic-auth-connect');
var bodyParser = require('body-parser');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var debug = require('debug')('storyline:server');
var domain = require('./libs/domain_middleware');
var escapeStringRegexp = require('escape-string-regexp');
var favicon = require('serve-favicon');
var multer = require('multer');
var proxy = require('express-http-proxy');
var redis = require('redis');

// load libraries
var lib = {};
lib.accounting = require('accounting');
lib.async = require('async');
lib.cronJob = require("cron").CronJob;
lib.crypto = require('crypto');
lib.csv = require('fast-csv');
lib.expressMailer = require("express-mailer");
lib.fs = require('fs');
lib.http = require('http');
lib.https = require('https');
lib.moment = require('moment');
lib.mongoose = require('mongoose');
lib.nodemailer = require("nodemailer");
lib.os = require('os');
lib.path = require('path');
lib.timeUUID = require("node-time-uuid");
lib.request = require('request');
lib.sanitizeCaja = require('sanitize-caja');
lib.sha1 = require('sha1');
lib.sharp = require('sharp');
lib.shortId = require('shortid');
lib.streamifier = require('streamifier');
lib.xoauth2 = require('xoauth2');

// load global libraries
global.rootRequire = function(filename){ return require(__dirname + '/' + filename); };
global._ = require('lodash');
global.config = require('./config')();
global.helper = require('./libs/helper.js')(lib);
global.logger = require('./libs/logger').default;

/** Include models **/
var models = {};
models.users = require('./models/users')(lib.mongoose);

/** Include controllers **/
var controllers = {};
controllers.authentication = require('./controllers/authentication')(lib); // basic authentication with Redis
controllers.api_router = require('./controllers/api_router'); // just init functions, execute in api/index
controllers.user = require('./controllers/user')(lib, models);

/** Setup application **/
app.set('port', config.port);
app.set('views', lib.path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// load middleware libraries
app.use(domain); // domain must be the first middleware
app.use(compression());
app.use(favicon(lib.path.join(__dirname, 'public/images', 'favicon.png')));
app.use(require('stylus').middleware(lib.path.join(__dirname, 'public')));
app.use(express.static(lib.path.join(__dirname, 'public'), {'maxAge': 86400000*365}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': false}));
app.use(cookieParser());

// storage configuration for file upload with multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// use single file upload to destination folder
app.use(multer({storage: storage}).single('image'));

/** Load web & api routes **/
var apiroutes = require('./routes/api/index')(express.Router(), models, controllers);
var webroutes = require('./routes/index')(express.Router(), lib, models, controllers);
app.use('/api', apiroutes);
app.use('/', webroutes);
app.use(express.static(lib.path.join(__dirname, 'public')));
app.use("/docs", express.static(lib.path.join(__dirname, "routes", "documentation")));

/** Database connection setup **/
// connect to database
lib.mongoose.connect(config.db_path, config.db_options);

lib.mongoose.connection.on('connected', function () {
  logger.console('mongoose connected');
});

lib.mongoose.connection.on('reconnect', function () {
  logger.console('mongoose reconnect');
});

lib.mongoose.connection.on('reconnectFailed', function (err) {
  logger.error('mongoose reconnectFailed', err);
});

// If the connection throws an error
lib.mongoose.connection.on('error',function (err) {
  logger.error('mongoose error: ', err);
});

// When the connection is disconnecting
lib.mongoose.connection.on('disconnecting', function () {
  logger.console('mongoose disconnecting');
});

// When the connection is disconnected
lib.mongoose.connection.on('disconnected', function () {
  logger.console('mongoose disconnected');
});

// When db serverConfig on close : https://github.com/Automattic/mongoose/issues/2229
lib.mongoose.connection.db.serverConfig.on('close', function() {
  logger.console('mongoose disconnected serverConfig close');
});

lib.mongoose.connection.once('open', function () {
	logger.console('mongoose connection open (once)');
});

/** redis setup **/
if (!lib.redis){
	lib.redis = redis.createClient(config.redis_port, config.redis_host);
	// lib.redis.auth(config.redis_auth);
  lib.redis.on("error", function(err){
    logger.error("redis client error:", err);
  });
  lib.redis.on("connect", function(err){
    logger.console("redis client connected");
  });
}

/** Catch 404 for undefined route and forward to error handler **/
app.use(function(req, res, next){
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(config.error_handler);

logger.console("server running on", process.env.NODE_ENV);

module.exports = app;
