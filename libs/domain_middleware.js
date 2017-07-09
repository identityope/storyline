"use strict";

var domain = require('domain');
var _ = require('lodash');
var uuid = require('node-uuid').v4;
var logger = require('../libs/logger')('[domain]');
var running = {};

module.exports = function (req, res, next) {

    if (process.stopping) {
       res.set('Connection', 'close'); // avoid http Keep-Alive when stopping
    }

    var time = req.start_time = Date.now(),
        d = domain.create(),
        exitDomain = function (done) {
            d.exit();
            delete running[d.id];
            if (done) process.nextTick(done);
        };

    d.id = uuid();
    d.token = (req.headers.authorization || '').split(' ')[1];
    req.domain = d;
    d.add(req);
    d.add(res);

    d.on('error', function(err) {
        try {
            res.sendStatus(500);
        } catch (e) {

        }        
        logger.error('HTTP',req.method,req.url,req.headers['user-agent'],(Date.now()-time)+'ms','domain error',d.user_id,err.code,err.message ? err.message : err,'\n'+err.stack);
        exitDomain(function () {
            process.stopApp();
        });
    });

    res.on('finish', function () {
        if (res.statusCode<400) {
          logger.info('HTTP','END',req.method,req.url,req.headers['user-agent'],res.statusCode,(Date.now()-time)+'ms');
        } else {
          logger.warn('HTTP','END',req.method,req.url,req.headers['user-agent'],res.statusCode,(Date.now()-time)+'ms');
        }
        exitDomain();
    });

    res.on('close', function () {
        logger.warn('HTTP','END',req.method,req.url,req.headers['user-agent'],res.statusCode,(Date.now()-time)+'ms','connection dropped by the client');
        exitDomain();
    });

    d.enter();
    running[d.id] = true;

    logger.info('HTTP','START',req.method,req.url,req.headers['user-agent']);

    next();

    process.nextTick(function(){
        d.exit();
    });
};

var waitRunningDomains = module.exports.waitRunningDomains = function (done,stime) {
    var  time = stime || Date.now(),
         ids = _.keys(running);

    if (ids.length) {
        if ((Date.now() - time) < (1 * 60 * 1000)) { // wait 1 min otherwise exit anyway
            logger.info('waiting for domains to stop', ids);
            return _.delay(waitRunningDomains,10000,done,time);
        } else {
            logger.warn('domains still running after 1min, exiting anyway', ids);
            done();
        }
    } else {
        done();
    }
};
