"use strict";

const log = rootRequire("libs/logger")('[auth]');
const USER_PREFIX = "SL_USER";
const TOKEN_PREFIX = "SL_TOKENS";
const TOKEN_VERSION = 1;

/**
 *  Redis User Data
 *  Store user data in hash format
 *
 Hash Object: {
	user_id: String,
	username: String,
	email: String,
	fullname: String,
	account_status: Number,
	gender: Number,
	photo: String,
	app_version: Number,
	device_id: String,
	device_model: String,
	device_notif_type: String,
	device_notif_id: String
	ts: Number,
	ip: String,
	ua: String,
	ver: Number
 }
 */

module.exports = function(libs) {
	var controller = {};

	// login user and save some user data (from formatUserData) to redis
	controller.login = async function(user, ip_address, user_agent, device){
		var token = libs.crypto.randomBytes(30).toString('base64').replace(/\+/g, "-").replace(/\//g, "_");
		var now = Date.now();
		var auth_data = {
			"user_id": user._id.toString(),
			"username": user.username,
			"email": user.email,
			"fullname": user.profile.fullname || "",
			"account_status": user.account_status || 0,
			"gender": user.profile.gender,
			"photo": user.profile.photo_raw || "",
			"app_version": user.app_version || "",
			"device_id": device.device_id || "",
			"device_model": device.device_model || "",
			"device_notif_type": device.device_notif_type,
			"device_notif_id": device.device_notif_id,
			"ts": now,
			"ip": ip_address,
			"ua": user_agent,
			"ver": TOKEN_VERSION
		};
		var [err, result] = await wrap(
			libs.redisClient.multi()
			.hmset(`${USER_PREFIX}:${token}`, auth_data)
			.zadd(`${TOKEN_PREFIX}:${user._id}`, now, token)
			.execAsync()
		);
		log.console("logged in user _id:", user._id, "token:", token);
		return token;
	};

	controller.logout = async function(token, user_id){
		var [err, result] = await wrap(
			libs.redisClient.multi()
			.del(`${USER_PREFIX}:${token}`)
			.zrem(`${TOKEN_PREFIX}:${user_id}`, token)
			.execAsync()
		);
		log.console("logged out user _id:", user_id, "token:", token); 
		return result;
	};

	controller.get = async function(token){
		var [err, auth_data] = await wrap(libs.redisClient.hgetallAsync(`${USER_PREFIX}:${token}`));
		if (err) {
			log.error(err);
			throw err;
		}
		if (!auth_data) {
			return null;
		}
		log.console("get data token:", token, "user_id:", auth_data.user_id);
		return auth_data;
	};

	controller.getTokensByUserId = async function(user_id){
		var [err, tokens] = await wrap(libs.redisClient.zrevrangeAsync(`${TOKEN_PREFIX}:${user_id}`, 0, -1));
		if (err) {
			log.error(err);
			throw err;
		}
		log.console("get tokens:", tokens, "user_id:", user_id);
		return tokens;
	};

	return controller;
};
