"use strict";

module.exports = function(models, controllers, api){

	/**
	 * Author: ope
	 *
	 * @api {get} /test/check Check API
	 * @apiName checkAPI
	 * @apiDescription Health check to the API routes
	 * @apiGroup Test
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
	 * @api {get} /test/user_tokens/:user_id Get User Tokens by ID
	 * @apiName GetUserTokensbyID
	 * @apiDescription Get User Tokens by ID
	 * @apiGroup Test
	 * @apiVersion 1.0.0
	 *
	 * @apiSuccess {Object} data Result object
	 *
	 */
	api.get("/test/user_tokens/:user_id", async function(req, res, auth){
		var user_id = helper.sanitize(req.params.user_id);
		var [err, result] = await wrap(controllers.authentication.getTokensByUserId(user_id));
		if (err) {
			logger.error(err);
			return res.replyError(err);
		}
		res.reply(200, null, result);
	});

};