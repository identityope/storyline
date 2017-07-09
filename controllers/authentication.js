"use strict";

const log = rootRequire("libs/logger")('[auth]');

module.exports = function(lib) {
    var controller = {
        "prefix": config.redis_user_prefix
    };

    controller.login = function(user_id, callback){
        var token = lib.crypto.randomBytes(20).toString('hex');
        // use sha1 to generate token
        token = lib.sha1(token);
        log.console("login user_id:", user_id);
        lib.redis.set(this.prefix + ":" + token, user_id.toString(), function(err, value){
            callback(err, token);
        });
    };

    controller.logout = function(token, callback){
        log.console("logout token:", token);
        lib.redis.del(this.prefix + ":" + token, function(err, value){
            callback(err, value);
        });
    };

    controller.get = function(token, callback){
        log.console("get token:", token);
        lib.redis.get(this.prefix + ":" + token, function(err, value){
            callback(err, value);
        });
    };

    return controller;
};
