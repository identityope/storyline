"use strict";

var domain = require('domain');
var _ = require('lodash');
var uuid = require('uuid/v4');
var logger = require('../libs/logger')('[HTTP]');
var running = {};

module.exports = function (req, res, next) {

	if (process.stopping) {
		res.set('Connection', 'close'); // avoid http Keep-Alive when stopping
	}

	var time = req.start_time = Date.now();
	var d = domain.create();
	d.id = uuid();
	d.token = (req.headers.authorization || '').split(' ')[1];
	d.url = req.url;

	req.domain = d;
	
	var exitDomain = function (done) {
		d.exit();
		delete running[d.id];
		if (done) process.nextTick(done);
	};

	d.add(req);
	d.add(res);
	d.enter();	
	d.on('error', function(err) {
		try {
			res.sendStatus(500);
		} catch (e) {
			logger.error(e);
		}
		logger.error('ERROR', req.method, d.url, (Date.now()-time)+'ms', err.code, err.message ? err.message : err, '\n'+err.stack);
		exitDomain(function () {
			process.stopApp();
		});
	});
	
	running[d.id] = true;
	logger.info('START', req.method, d.url, req.headers['user-agent']);

	res.on('finish', function () {
		if (res.statusCode < 400) {
		  logger.info('END', req.method, d.url, res.statusCode, (Date.now()-time)+'ms');
		} else {
		  logger.warn('END', req.method, d.url, res.statusCode, (Date.now()-time)+'ms');
		}
		exitDomain();
	});

	res.on('close', function () {
		logger.warn('END', req.method, d.url, res.statusCode, (Date.now()-time)+'ms', 'connection dropped by the client');
		exitDomain();
	});

	next();

	process.nextTick(function(){
		d.exit();
	});
};

var waitRunningDomains = module.exports.waitRunningDomains = function (done, stime) {
	var time = stime || Date.now();
	var ids = _.keys(running);
	var interval_time = 5000;
	var max_wait_time = 30000; // wait 30 sec otherwise exit anyway

	if (!ids.length) {
		return done();
	}
	if ((Date.now() - time) < max_wait_time) { 
		logger.info('waiting for domains to stop', ids);
		_.delay(waitRunningDomains, interval_time, done, time);
	} else {
		logger.warn('domains still running after 30 sec, exiting anyway', ids);
		done();
	}
};
