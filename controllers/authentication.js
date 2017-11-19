"use strict";

const log = rootRequire("libs/logger")('[auth]');
const USER_PREFIX = "USER_TOKEN";
const TOKEN_PREFIX = "TOKEN_IDS";
const DEVICE_PREFIX = "USER_DEVICES";
const TOKEN_VERSION = 1;

/**
 *  Redis User Data
 *  Store some user data in Redis in JSON string format
 *
 Object: {
	user_id: String,
	username: String,
	email: String,
	fullname: String,
	account_status: Number,
	gender: Number,
	photo: String,
	app_version: Number,
	device: Object {device_id, device_model, device_notif_type, device_notif_id},
	metadata: Object {ts, ip, ua, ver}
 }
 */

module.exports = function(libs) {
	var controller = {};

	// login user and save some user data (from formatUserData) to redis
	controller.login = async function(user, ip_address, user_agent, device){
		var token = libs.crypto.randomBytes(30).toString('base64').replace(/\+/g, "-").replace(/\//g, "_");
		var auth_data = {
			"user_id": user._id.toString(),
			"username": user.username,
			"email": user.email,
			"fullname": user.profile.fullname,
			"account_status": user.account_status,
			"gender": user.profile.gender,
			"photo": user.profile.photo_raw,
			"app_version": user.app_version,
			"device": device || {},
			"metadata": {
				"ts": Date.now(),
				"ip": ip_address,
				"ua": user_agent,
				"ver": TOKEN_VERSION
			}
		};
		var [err, result] = await wrap(libs.redisClient.setAsync(`${USER_PREFIX}:${token}`, JSON.stringify(auth_data)));
		if (err) {
			log.error(err);
			throw err;
		}
		var [err2, result2] = await wrap(libs.redisClient.saddAsync(`${TOKEN_PREFIX}:${user._id}`, token));
		if (err2) {
			log.error(err2);
			throw err2;
		}
		log.console("logged in user _id:", user._id, "token:", token);
		return token;
	};

	controller.logout = async function(token, user_id){
		var [err, result] = await wrap(libs.redisClient.delAsync(`${USER_PREFIX}:${token}`));
		if (err) {
			log.error(err);
			throw err;
		}
		var [err2, result2] = await wrap(libs.redisClient.sremAsync(`${TOKEN_PREFIX}:${user_id}`, token));
		if (err2) {
			log.error(err2);
			throw err2;
		}
		log.console("logged out user _id:", user_id, "token:", token); 
		return result;
	};

	controller.get = async function(token){
		var [err, auth_data] = await wrap(libs.redisClient.getAsync(`${USER_PREFIX}:${token}`));
		if (err) {
			log.error(err);
			throw err;
		}
		if (!auth_data) {
			return null;
		}
		auth_data = JSON.parse(auth_data);
		log.console("get data token:", token, "user_id:", auth_data.user_id);
		return auth_data;
	};

	controller.getTokensByUserId = async function(user_id){
		var [err, tokens] = await wrap(libs.redisClient.smembersAsync(`${TOKEN_PREFIX}:${user_id}`));
		if (err) {
			log.error(err);
			throw err;
		}
		log.console("get tokens:", tokens, "user_id:", user_id);
		return tokens;
	};

	return controller;
};
