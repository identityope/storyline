"use strict";

// author: ope
// api is the same object returned by the api_router
module.exports = function(models, controllers, api){

	api.get('/', function(req, res, auth) {
		res.reply(200, null, "Hello! This is API test page for Storyline Application.");
	});

	/* subroutes */
	var test = require("./test")(models, controllers, api);
	var search = require("./user")(models, controllers, api);

	return api.Router();
};
