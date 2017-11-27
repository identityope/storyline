"use strict";

const Router = require("express").Router;

module.exports = function(libs, models, controllers){

	var router = new Router();

	/* GET home page. */
	router.get('/', function(req, res){
		res.render('index', {title: 'Storyline'});
	});

	router.get('/docs', function(req, res){
		var api_metadata = require("../docs/api_project.json");
		var api_data = require("../docs/api_data.json");
		if (api_data) {
			api_data = _.groupBy(api_data, api => api.group);
		}
		var api_list = [];
		_.each(api_data, function(apis, group_name){
			api_list.push({
				group_name,
				apis: apis.map(api => { 
					return {"name": api.name, "title": api.title, "type": api.type};
				})
			});
		});
		res.render('docs/index', {api_metadata, api_data, api_list});
	});

	return router;
};