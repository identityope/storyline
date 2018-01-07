"use strict";

const log = rootRequire("libs/logger")('[story]');

module.exports = function(libs, models) {
	var controller = {};

	function formatStoryData(story){
		var story_data = {
			// TODO: format story here
		};
		return story;
	}

	controller.createNewStory = async function(user_id, title, content, details, attachment, options){
		// get user detail
		var user = await models.users.findById(user_id, "username profile.photo");
		if (!user) throw "Get user details failed";

		var now = new Date();
		var story_obj = {
			"user_id": user_id,
			"username": user.username,
			"userphoto": user.profile.photo,
			"title": title,
			"content": content,
			"permalink": libs.shortId.generate(),
			"category_id": details.category_id,
			"category_name": details.category_name,
			"created_time": new Date(),
			"created_time_uuid": new libs.timeUUID(), 
			"keywords": helper.buildKeywords([title, user.username, details.category_name])
		};
		var story = await models.stories.create(story_obj);
		if (!story) throw "Failed to create a new story";

		return formatStoryData(story);
	};

	controller.findById = async function(_id){
		var story = await models.stories.findById(_id);
		if (!story) return;
		return formatStoryData(story);
	};

	controller.findByPermalink = async function(permalink){
		var story = await models.stories.findByPermalink(permalink);
		if (!story) return;
		return formatStoryData(story);
	};

	return controller;
};