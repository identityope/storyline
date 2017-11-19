"use strict";

const log = rootRequire("libs/logger")('[API]');
const Router = require("express").Router;

module.exports = function(authenticator){
	
	var controller = {"router": new Router()};

	var status_messages = {
		200: "success",
		400: "invalid request",
		401: "not authenticated",
		403: "forbidden",
		404: "not found",
		500: "internal server error"
	};

	function reply(code, message, data){
		var result = {
			"status_code": code,
			"status_message": message ? message.toString() : status_messages[code],
			"data": data || {}
		};
		this.setHeader('Content-Type', 'application/json');
		this.status(code);
		this.json(result);
	}

	function replyError(err){
		var result = {};
		if (err instanceof Error) {
			result.status_code = 500;
			result.status_message = err.toString();
		} else {
			result.status_code = 403;
			result.status_message = err;
		}
		result.data = {};
		this.setHeader('Content-Type', 'application/json');
		this.status(result.status_code);
		this.json(result);
	}

	async function getAuthData(authorization_header){
		var auth_data = {};
		// check authorization header
		if (!authorization_header) return auth_data;

		var authorization = authorization_header.split(" ");
		// check token in authorization header
		if (authorization[0] !== "Token") return auth_data;

		// if using token scheme
		var token = authorization[1];
		if (!config.production && token === "DEVELOPMENT_TOKEN") { // authentication with development token
			auth_data.user_id = "56382fb877719d215d3e47d9"; // test user ID
			auth_data.token = token;
			return auth_data;
		}
		// get user data by token from redis
		var result = await authenticator.get(token);
		if (!result) return auth_data;

		// assign auth data from redis
		_.assign(auth_data, result);
		auth_data.token = token;
		return auth_data;
	}

	function handleRequest(enable_auth, callback){
		return async function(req, res){
			// define reply function
			res.reply = reply;
			// define reply function for error result
			res.replyError = replyError;

			// if authentication is not needed, callback === enable_auth
			if (!callback) {
				callback = enable_auth;
			}
			// check request connection on production environment
			if (config.production && !req.secure) {
				return res.reply(403, "API must be accessed by a secure connection (https)");
			}
			// get user auth data
			try {
				var auth_data = await getAuthData(req.headers.authorization);
				// check authentication data
				if (enable_auth === false && auth_data.user_id) {
					// only for unauthenticated user
					res.reply(403, "You should not be logged in to access this");
				} else if (enable_auth === true && !auth_data.user_id) {
					// not authenticated yet
					res.reply(401, "You are not logged in");
				} else if (enable_auth === true && auth_data.user_id) {
					// proceed to the next callback function
					await callback(req, res, auth_data);
				} else {
					// can be accessed with or without authenticated user
					await callback(req, res, auth_data);
				}
			} catch (err) {
				log.error(err);
				res.replyError(err);
			}
		};
	}

	controller.Router = function(){
		return this.router;
	};

	controller.get = function(path, enable_auth, callback){
		this.router.get(path, handleRequest(enable_auth, callback));
	};

	controller.post = function(path, enable_auth, callback){
		this.router.post(path, handleRequest(enable_auth, callback));
	};

	return controller;
};
