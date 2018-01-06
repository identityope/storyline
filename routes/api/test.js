"use strict";

const FOLLOWER_PREFIX = "FOLLOWER";

module.exports = function(libs, models, controllers, api){

	/**
	 * Author: ope
	 *
	 * @api {get} /test/check API Health Check
	 * @apiName apiHealthCheck
	 * @apiDescription Health check API status to the server
	 * @apiGroup _Test Functions
	 * @apiVersion 1.0.0
	 *
	 * @apiSuccess {Object} data Result object
	 *
	 */
	api.get("/test/check", function(req, res, auth){
		res.reply(200, null, true);
	});

	/**
	 * Author: ope
	 *
	 * @api {get} /redis/info Redis Server Info
	 * @apiName RedisServerInfo
	 * @apiDescription Get Redis Server Info
	 * @apiGroup _Redis Functions
	 * @apiVersion 1.0.0
	 *
	 * @apiSuccess {Object} data Result object
	 *
	 */
	api.get("/redis/info", async function(req, res, auth){
		var [err, result] = await wrap(libs.redisClient.infoAsync());
		if (err) {
			logger.error(err);
			return res.replyError(err);
		}
		result = libs.redisClient.server_info;
		res.reply(200, null, result);
	});

	/**
	 * Author: ope
	 *
	 * @api {get} /redis/keys/:prefix Get All Keys by Prefix
	 * @apiName GetAllKeysByPrefix
	 * @apiDescription Get All Keys by Prefix
	 * @apiGroup _Redis Functions
	 * @apiVersion 1.0.0
	 *
	 * @apiSuccess {Object} data Result object
	 *
	 */
	api.get("/redis/keys/:prefix", async function(req, res, auth){
		var prefix = helper.sanitize(req.params.prefix);
		if (!prefix) {
			return res.replyError("Prefix cannot be empty");
		}
		var [err, result] = await wrap(libs.redisClient.keysAsync(`${prefix}*`));
		if (err) {
			logger.error(err);
			return res.replyError(err);
		}
		res.reply(200, null, result);
	});

	/**
	 * Author: ope
	 *
	 * @api {get} /redis/value/:key Get Value by Key
	 * @apiName GetValueByKey
	 * @apiDescription Get value by key name
	 * @apiGroup _Redis Functions
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} type Type of the value: string, list, hash, set, sorted set (default: string)
	 *
	 * @apiSuccess {Object} data Result object
	 *
	 */
	api.get("/redis/value/:key", async function(req, res, auth){
		var key = helper.sanitize(req.params.key);
		if (!key) {
			return res.replyError("Key name cannot be empty");
		}
		var type = helper.sanitize(req.query.type) || "string";
		var err, result;
		if (type === "list") {
			[err, result] = await wrap(libs.redisClient.lrangeAsync(`${key}`, 0, -1));
		} else if (type === "hash") {
			[err, result] = await wrap(libs.redisClient.hgetallAsync(`${key}`));
		} else if (type === "set") {
			[err, result] = await wrap(libs.redisClient.smembersAsync(`${key}`));
		} else if (type === "sorted set") {
			[err, result] = await wrap(libs.redisClient.zrangeAsync(`${key}`, 0, -1));
		} else {
			[err, result] = await wrap(libs.redisClient.getAsync(`${key}`));
		}
		
		if (err) {
			logger.error(err);
			return res.replyError(err);
		}
		res.reply(200, null, result);
	});

	/**
	 * Author: ope
	 *
	 * @api {post} /redis/remove/:key Remove Value by Key
	 * @apiName RemoveValueByKey
	 * @apiDescription Remove value by key name
	 * @apiGroup _Redis Functions
	 * @apiVersion 1.0.0
	 *
	 * @apiSuccess {Object} data Result object
	 *
	 */
	api.post("/redis/remove/:key", async function(req, res, auth){
		var key = helper.sanitize(req.params.key);
		if (!key) {
			return res.replyError("Key name cannot be empty");
		}
		var [err, result] = await wrap(libs.redisClient.delAsync(`${key}`));
		if (err) {
			logger.error(err);
			return res.replyError(err);
		}
		res.reply(200, null, result);
	});

	/**
	 * Author: ope
	 *
	 * @api {get} /redis/user_tokens/:user_id Get User's Tokens by ID
	 * @apiName GetUserTokensbyID
	 * @apiDescription Get User's Tokens by ID
	 * @apiGroup _Redis Functions
	 * @apiVersion 1.0.0
	 *
	 * @apiSuccess {Object} data Result object
	 *
	 */
	api.get("/redis/user_tokens/:user_id", async function(req, res, auth){
		var user_id = helper.sanitize(req.params.user_id);
		var [err, result] = await wrap(controllers.authentication.getTokensByUserId(user_id));
		if (err) {
			logger.error(err);
			return res.replyError(err);
		}
		res.reply(200, null, result);
	});

	/**
	 * Author: ope
	 *
	 * @api {get} /redis/user_followers/:user_id Get User's Followers by ID
	 * @apiName GetUserFollowersbyID
	 * @apiDescription Get User's Followers by ID
	 * @apiGroup _Redis Functions
	 * @apiVersion 1.0.0
	 *
	 * @apiSuccess {Object} data Result object
	 *
	 */
	api.get("/redis/user_followers/:user_id", async function(req, res, auth){
		var user_id = helper.sanitize(req.params.user_id);
		var [err, result] = await wrap(libs.redisClient.zrevrangeAsync(`${FOLLOWER_PREFIX}:${user_id}`, 0, -1));
		if (err) {
			logger.error(err);
			return res.replyError(err);
		}
		res.reply(200, null, result);
	});

};