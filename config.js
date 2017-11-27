"use strict";

var config = {};

// default configuration
config.default = function(config_obj){
	// default config here
	config_obj.port = 5050;
};

// local configuration
config.local = function(config_obj){
    config_obj.local = true;
	config_obj.host = 'http://localhost:5050';
	config_obj.db_path = 'mongodb://localhost:27017/storyline';
	config_obj.db_options = {
		"useMongoClient": true // http://thecodebarbarian.com/mongoose-4.11-use-mongo-client.html
	};
	config_obj.image_server = 'public/images';
	config_obj.admin_email = 'taufik@prelo.id';
	config_obj.redis_host = "localhost";
	config_obj.redis_port = 6379;
	config_obj.redis_auth = "mystoryline1993";
	Promise.config({longStackTraces: true});
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
	Promise.config({longStackTraces: true});
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
};

module.exports = function (){
	var config_obj = {};
	// call default configuration
	config.default(config_obj); 
	config.local(config_obj);
	return config_obj;
};
