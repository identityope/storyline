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
	 * @apiParam {Number} status Status of the author:<br/>0 = normal (default)<br/>1 = anonymous
	 * @apiParam {Number} visibility Visibility of the story:<br/>0 = public (default)<br/>1 = friends only
	 * @apiParam {String} category_id Category ID of the story (optional)
	 * @apiParam {String} category_name Category name of the story (optional)
	 *
	 * @apiSuccess {Object} data Result object
	 *
	 */
	api.post("/story/new", true, async function(req, res, auth){
		var user_id = auth.user_id;
		var title = helper.sanitize(req.body.title);
		var content = helper.sanitize(req.body.content);
		var status = parseInt(req.body.status) || models.stories.statusEnum.NORMAL;
		var visibility = parseInt(req.body.visibility) || models.stories.visibilityEnum.PUBLIC;
		var category_id = helper.sanitize(req.body.category_id);
		var category_name = helper.sanitize(req.body.category_name);
		var attachment = null;
		var options = {status, visibility, category_id, category_name};

		var [err, result] = await wrap(controllers.story.createNewStory(user_id, title, content, attachment, options));
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

	/**
	 * Author: ope
	 *
	 * @api {get} /stories/:author_id Get Stories by Author ID
	 * @apiName getStoriesByAuthorID
	 * @apiDescription Get Stories by Author ID
	 * @apiGroup Story
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} last_uuid Last time uuid from previous page, if empty then return the first page
	 * @apiParam {Number} limit Limit the number of stories per page (default = 20)
	 *
	 * @apiSuccess {Object} data Result object
	 *
	 */
	api.get("/stories/:author_id", async function(req, res, auth){
		var author_id = helper.sanitize(req.params.author_id);
		var last_uuid = helper.sanitize(req.query.last_uuid);
		var limit = parseInt(req.query.limit) || 20;
		var [err, result] = await wrap(controllers.story.findByAuthorIdWithPagination(author_id, last_uuid, limit));
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
