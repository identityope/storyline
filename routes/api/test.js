"use strict";

module.exports = function(models, controllers, api){

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
	 * @api {get} /redis/user_tokens/:user_id Get User Tokens by ID
	 * @apiName GetUserTokensbyID
	 * @apiDescription Get User Tokens by ID
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

};