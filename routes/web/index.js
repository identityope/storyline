"use strict";

const Router = require("express").Router;

module.exports = function(libs, models, controllers){

	var router = new Router();

	/* GET home page. */
	router.get('/', function(req, res, next){
		res.render('index', {title: 'Storyline'});
	});

	return router;
};