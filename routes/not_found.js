"use strict";

const log = rootRequire("libs/logger")('[HTTP]');

module.exports = function(req, res, next){
	var err = new Error('Not Found');
	err.status = 404;
	log.error(req.url, err);
	res.status(404);
	res.render('error', {
		message: err.message,
		error: {}
	});
};