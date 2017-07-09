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
	 * @api {get} /test/check/routes Check All API Routes
	 * @apiName checkApiRoutes
	 * @apiDescription List all API routes
	 * @apiGroup Test
	 * @apiVersion 1.0.0
	 *
	 * @apiSuccess {Object} data Result object
	 *
	 */
	api.get("/test/check/routes", function(req, res, auth){
		res.reply(200, null, api.routes);
	});

};