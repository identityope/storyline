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
var domain = require('./middlewares/domain');
var escapeStringRegexp = require('escape-string-regexp');
var favicon = require('serve-favicon');
var multer = require('multer');
var proxy = require('express-http-proxy');

// load global libraries
global.rootRequire = (filename) => require(__dirname + '/' + filename);
global.Promise = require('bluebird');
global.co = Promise.coroutine;
global._ = require('lodash');
global.config = require('./config')();
global.logger = require('./libs/logger').default;

// load libraries
var libs = {};
libs.accounting = require('accounting');
libs.async = require('async');
libs.bcrypt = require('bcrypt');
libs.cronJob = require("cron").CronJob;
libs.crypto = require('crypto');
libs.csv = Promise.promisifyAll(require('fast-csv'));
libs.expressMailer = Promise.promisifyAll(require("express-mailer"));
libs.fs = Promise.promisifyAll(require('fs'));
libs.http = require('http');
libs.https = require('https');
libs.moment = require('moment');
libs.mongoose = require('mongoose');
libs.mongoose.Promise = Promise;
libs.nodemailer = require("nodemailer");
libs.os = require('os');
libs.path = require('path');
libs.redis = Promise.promisifyAll(require('redis'));
libs.request = Promise.promisifyAll(require('request'));
libs.sanitizeCaja = require('sanitize-caja');
libs.sha1 = require('sha1');
libs.sharp = require('sharp');
libs.shortId = require('shortid');
libs.streamifier = require('streamifier');
libs.timeUUID = require("node-time-uuid");
libs.xoauth2 = require('xoauth2');

global.helper = require('./libs/helper.js')(libs);
global.wrap = helper.wrapPromise;

/** Include models **/
var models = {};
models.stories = require('./models/stories')(libs.mongoose);
models.users = require('./models/users')(libs.mongoose);
models.user_relations = require('./models/user_relations')(libs.mongoose);

/** Include controllers **/
var controllers = {};
controllers.authentication = require('./controllers/authentication')(libs); // basic authentication with Redis
controllers.story = require('./controllers/story')(libs, models);
controllers.user = require('./controllers/user')(libs, models);

/** Setup application **/
app.set('port', config.port);
app.set('views', libs.path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// load middlewares
app.use(domain); // domain must be the first middleware
app.use(compression());
app.use(favicon(libs.path.join(__dirname, 'public/images', 'favicon.png')));
app.use(require('stylus').middleware(libs.path.join(__dirname, 'public')));
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
var api_router = require('./routes/api_router')(controllers.authentication);
var api_routes = require('./routes/api')(libs, models, controllers, api_router);
var web_routes = require('./routes/web')(libs, models, controllers);
app.use('/api', api_routes);
app.use('/', web_routes);
app.use("/docs", express.static(libs.path.join(__dirname, "routes", "docs")));
app.use(express.static(libs.path.join(__dirname, 'public'), {'maxAge': 86400000*365}));
// catch undefined routes to 404 not found error handler **/
app.use(require('./routes/not_found'));

/** Database connection setup **/
// connect to database
libs.mongoose.connect(config.db_path, config.db_options);

// connection event handlers
libs.mongoose.connection.on('connected', function(){
	// When successfully connected
	logger.console('mongoose connected');
})
.on('reconnect', function(){
	logger.console('mongoose reconnect');
})
.on('reconnectFailed', function(err){
	logger.error('mongoose reconnectFailed', err);
})
.on('error',function(err){
	// If the connection throws an error
	logger.error('mongoose error: ', err);
})
.on('disconnecting', function(){
	// When the connection is disconnecting
	logger.console('mongoose disconnecting');
})
.on('disconnected', function(){
	// When the connection is disconnected
	logger.console('mongoose disconnected');
});

// When db serverConfig on close : https://github.com/Automattic/mongoose/issues/2229
// libs.mongoose.connection.db.serverConfig.on('close', function(){
// 	logger.console('mongoose disconnected serverConfig close');
// });

libs.mongoose.connection.once('open', function(){
	logger.console('mongoose connection open (once)');
}); 

/** redis setup **/
if (!libs.redisClient){
	libs.redisClient = libs.redis.createClient(config.redis_port, config.redis_host);
	// libs.redis.auth(config.redis_auth);
	libs.redisClient.on("error", function(err){
		logger.error("redis client error:", err);
	});
	libs.redisClient.on("connect", function(err){
		logger.console("redis client connected");
	});
}

logger.console("server running on", process.env.NODE_ENV);

var gracefulExit = function(){
	libs.mongoose.connection.close(function(){ 
		logger.console('mongoose default connection disconnected through app termination'); 
		process.exit(0); 
	});
};

module.exports = app;