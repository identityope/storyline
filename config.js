"use strict";

var config = {};

// default configuration
config.default = function(config_obj){
	// default config here
	config_obj.port = 5050;
	config_obj.redis_user_prefix = 'user_login';

	config_obj.error_handler = function(err, req, res, next){
		logger.error("error_handler", err, "req.method:", req.method, "req.body:", req.body, "req.query:", req.query, "req.params:", req.params, "req.files:", req.files);
		if(err.status === 404){
			res.status(404);
			res.render('error', {
	    		message: err.message,
	    		error: {}
	    	});	
		}else{
			res.status(err.status || 500);
	    	res.render('error', {
	    		message: err.message,
	    		error: err
	    	});
		}
	};
};

// local configuration
config.local = function(config_obj){
    config_obj.local = true;
	config_obj.host = 'http://localhost:5050';
	config_obj.db_path = 'mongodb://localhost:27017/storyline';
	config_obj.db_options = {};
	config_obj.image_server = 'public/images';
	config_obj.admin_email = 'taufik@prelo.id';
	config_obj.redis_host = "localhost";
	config_obj.redis_port = 6379;
	config_obj.redis_auth = "mystoryline1993";
};

// development configuration
config.development = function(config_obj){
    config_obj.local = true;
	config_obj.host = 'http://localhost:5050';
	config_obj.db_path = 'mongodb://localhost:27017/storyline';
	config_obj.db_options = {};
	config_obj.image_server = 'public/images';
	config_obj.admin_email = 'taufik@prelo.id';
	config_obj.redis_host = "localhost";
	config_obj.redis_port = 6379;
	config_obj.redis_auth = "mystoryline1993";
};

// production configuration
config.production = function(config_obj){
    config_obj.local = true;
	config_obj.host = 'http://localhost:5050';
	config_obj.db_path = 'mongodb://localhost:27017/storyline';
	config_obj.db_options = {};
	config_obj.image_server = 'public/images';
	config_obj.admin_email = 'taufik@prelo.id';
	config_obj.redis_host = "localhost";
	config_obj.redis_port = 6379;
	config_obj.redis_auth = "mystoryline1993";

	config_obj.error_handler = function(err, req, res, next){
		logger.error("error_handler", err, "req.method:", req.method, "req.body:", req.body, "req.query:", req.query, "req.params:", req.params, "req.files:", req.files);
		// don't show error stacktraces on production
		res.status(err.status || 500);
    	res.render('error', {
    		message: err.message,
    		error: {}
    	});
	};
};

module.exports = function (){
	var config_obj = {};
	// call default configuration
	config.default(config_obj); 
	config.local(config_obj);
	return config_obj;
};
