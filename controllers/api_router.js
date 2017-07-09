"use strict";

const log = rootRequire("libs/logger")('[auth]');

module.exports = function(router, _authInstance){
	
	var controller = {"router": router, "authInstance": _authInstance, "routes": {}};

	var status_messages = {
		200: "success",
		400: "invalid request",
		401: "not authenticated",
		403: "forbidden",
		404: "not found",
		500: "internal server error"
	};

	function setRoutes(method, path, enable_auth, callback, authInstance){
		controller.routes[method + " " + path] = {"enable_auth": enable_auth, "callback": callback, "authInstance": authInstance};
	}

	function getRoutes(route){
		if(route.methods.get){
			return controller.routes["GET " + route.path];
		}else{
			return controller.routes["POST " + route.path];
		}
	}

	controller.get = function(path, enable_auth, callback){
		setRoutes("GET", path, enable_auth, callback, controller.authInstance);
		controller.router.get(path, handleRequest);
	};

	controller.post = function(path, enable_auth, callback){
		setRoutes("POST", path, enable_auth, callback, controller.authInstance);
		controller.router.post(path, handleRequest);
	};

	controller.getRouter = function(){
		return controller.router;
	};

	function getAuth(authorization_header, authInstance, callback){
		var auth_data = {};
		// check authorization header
		if(!authorization_header){
			return callback(null, auth_data);
		}
		var authorization = authorization_header.split(" ");
		// check token in authorization header
		if(authorization[0] !== "Token"){
			return callback(null, auth_data);
		}
		// if using token scheme
		var token = authorization[1];
		if(!config.production && token === "DEVELOPMENT_TOKEN"){ // authentication with development token
			auth_data.user = "56382fb877719d215d3e47d9"; // test user ID
			auth_data.token = token;
			return callback(null, auth_data);
		}
		authInstance.get(token, function(err, value){
			if(err){
				return callback(err);
			}
			if(value){
				auth_data.user = value;
				auth_data.token = token;
			}
			callback(null, auth_data);
		});
	}

	function handleRequest(req, res, next){	
		// define reply function
		res.reply = function(code, message, data){
			if(!data){
				data = {};
			}
			var result = {
				"status_code": code,
				"status_message": message || status_messages[code],
				"data": data
			};
			res.setHeader('Content-Type', 'application/json');
			res.status(code);
			res.json(result);
		};

		var routedata = getRoutes(req.route);
		var enable_auth = routedata.enable_auth;
		var callback = routedata.callback;
		var authInstance = routedata.authInstance;
		// check request connection on production environment
		if(config.production && !req.secure){
			return res.reply(403, "Akses API harus menggunakan koneksi yang aman (https)");
		}
		// get user auth data
		getAuth(req.headers.authorization, authInstance, function(err, auth_data){
			if(err){
				return res.reply(500, err);
			}
			if(!callback){ // don't need authentication (enable_auth is not defined)
				callback = enable_auth;
				callback(req, res, auth_data);
			}else if(enable_auth === true){ // need authentication
				log.console("user:", auth_data.user, "token:", auth_data.token);
				if(!auth_data.user){ // not yet authenticated
					return res.reply(401, "user belum login");
				}
				callback(req, res, auth_data);
			}else if(enable_auth === false && auth_data.user){ // already authenticated
				res.reply(403, "user sudah login");
			}else{ // don't need authentication
				callback(req, res, auth_data);
			}
		});
	}

	return controller;
};
