"use strict";

const log = rootRequire("libs/logger")('[story]');

module.exports = function(libs, models, controllers, api){

	/**
	 * Author: ope
	 *
	 * @api {post} /story/new Create New Story
	 * @apiName createNewStory
	 * @apiDescription Create a New Story
	 * @apiGroup Story
	 * @apiVersion 1.0.0
	 *
	 * @apiHeader {String} Authorization User's token
	 *
	 * @apiParam {String} title Title of the story (optional)
	 * @apiParam {String} content Whatever story you want to tell
	 * @apiParam {String} category_id Category ID of the story (optional)
	 *
	 * @apiSuccess {Object} data Result object
	 *
	 */
	api.post("/story/new", true, async function(req, res, auth){
		var user_id = auth.user_id;
		var title = helper.sanitize(req.body.title);
		var content = helper.sanitize(req.body.content);
		var category_id = helper.sanitize(req.body.category_id);
		var details = {category_id};
		var attachment = null;
		var options = {};

		var [err, result] = await wrap(controllers.story.createNewStory(user_id, title, content, details, attachment, options));
		if (err) {
			log.error(err);
			return res.replyError(err);
		}
		res.reply(200, null, result);
	});

	/**
	 * Author: ope
	 *
	 * @api {get} /story/:story_id Get Story by ID
	 * @apiName getStoryByID
	 * @apiDescription Get Story by ID
	 * @apiGroup Story
	 * @apiVersion 1.0.0
	 *
	 * @apiSuccess {Object} data Result object
	 *
	 */
	api.get("/story/:story_id", async function(req, res, auth){
		var story_id = helper.sanitize(req.params.story_id);
		var [err, result] = await wrap(controllers.story.findById(story_id));
		if (err) {
			logger.error(err);
			return res.replyError(err);
		}
		if (!result) {
			return res.reply(404, "Story ID not found");
		}
		res.reply(200, null, result);
	});

	/**
	 * Author: ope
	 *
	 * @api {get} /story/permalink/:permalink Get Story by Permalink
	 * @apiName getStoryByPermalink
	 * @apiDescription Get Story by Permalink
	 * @apiGroup Story
	 * @apiVersion 1.0.0
	 *
	 * @apiSuccess {Object} data Result object
	 *
	 */
	api.get("/story/permalink/:permalink", async function(req, res, auth){
		var permalink = helper.sanitize(req.params.permalink);
		var [err, result] = await wrap(controllers.story.findByPermalink(permalink));
		if (err) {
			logger.error(err);
			return res.replyError(err);
		}
		if (!result) {
			return res.reply(404, "Story not found");
		}
		res.reply(200, null, result);
	});

};
