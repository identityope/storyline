"use strict";

module.exports = function(router, models, controllers){
	var api = controllers.api_router(router, controllers.authentication); 

	api.get('/', function(req, res, auth) {
		res.reply(200, null, "Hello! This is API test page for Storyline Application.");
	});

	/* subroutes */
	var test = require("./test")(models, controllers, api);
	var search = require("./user")(models, controllers, api);

	return api.getRouter();
};
