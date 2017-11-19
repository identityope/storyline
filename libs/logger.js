"use strict";

var _ = require('lodash');
var util = require('util');

const NOOP = function(){};
const LEVELS = ['silly','debug','verbose','console','info','mail','sms','wait','warn','error'];

var MIN_IDX = LEVELS.indexOf(process.env.LOG_LEVEL);

MIN_IDX = MIN_IDX > -1 ? MIN_IDX : 2;

var logger = module.exports = function (id,level) {
    var inst = { id: id || 'default' };
    var min_idx = LEVELS.indexOf(level);

    min_idx = min_idx > -1 ? min_idx : MIN_IDX;

    LEVELS.forEach(function (level,idx) {
      inst[level] = idx >= min_idx ? function () {
        console.log.apply(console,formatArguments(id,level,arguments));
      } : NOOP;
    });

    inst.iferror = function () {
      var args = Array.prototype.slice.call(arguments);
      return function (err) {
        if (err) {
          args.push(err);
          args.push(err.stack);
          inst.error.apply(inst,args);
        }
      };
    };

    return inst;
};

var def = module.exports.default = logger();

var formatArgument = function (args,i) {
    var arg = args[i];
    var isError = arg instanceof Error;
    var type = typeof arg;

    if (isError) {
        args[i] = arg.message+' '+arg.stack;
        return ' %s';
    } else if (type == 'string') {
        return ' %s';
    } else if (type == 'number') {
        return ' %d';
    } else { // %j
      // node 0.10.32 %j does not support circular structures
      args[i] = util.inspect(arg, null, 3);
      return ' %s';
    }
};

var formatArguments = function (id,level,args) {
    args = Array.prototype.slice.call(args);
    var user_id = 'NU';
    var domain_id = 'ND';

    if (process.domain) {
        domain_id = process.domain.id;
        if (process.domain.token) {
          user_id = process.domain.token;
        }
    }

    var format = '%d %d %s %s %s %s';

    for (var i=0;i<args.length;i++) {
        format += formatArgument(args,i);
    }

    args.unshift.apply(args, [format, Date.now(), process.pid, level, user_id, domain_id, id ? id : 'NI']);

    return args;
};
