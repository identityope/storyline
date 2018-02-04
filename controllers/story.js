"use strict";

const log = rootRequire("libs/logger")('[story]');
const FOLLOWER_PREFIX = "SL_FOLLOWERS";
const FOLLOWING_PREFIX = "SL_FOLLOWINGS";
const STORYLINE_PREFIX = "SL_TIMELINE";
const STORIES_PREFIX = "SL_STORIES";
const MAX_REDIS_SL_SIZE = 1000;

module.exports = function(libs, models) {
	
	const statusEnum = models.stories.statusEnum;
	const visibilityEnum = models.stories.visibilityEnum;

	var controller = {};

	function formatStoryData(story){
		// format story data
		if (story.status === statusEnum.ANONYMOUS) {
			story.author._id = null;
			story.author.username = "anonymous";
			story.author.photo = "../anonymous.png";
			story.author.is_anonymous = true;
			story.permalink = null;
		} else {
			story.permalink = `${config.host}/stories/${story.permalink}`;
		}
		story.auhtor.photo_raw = story.author.photo;
		story.auhtor.photo = helper.getUserPhotoURL(story.auhtor._id, story.auhtor.photo_raw);
		story.auhtor.photo_thumbnail = helper.getUserPhotoThumbnailURL(story.auhtor._id, story.auhtor.photo_raw);
		story.created_time_ago = libs.moment(story.created_time).fromNow();
		delete story.keywords;

		return story;
	}

	controller.createNewStory = async function(user_id, title, content, attachment, options){
		// get user detail
		var user = await models.users.findById(user_id, "username profile.photo");
		if (!user) throw "Get user details failed";

		/** Save this story into database **/
		var now = new Date();
		var story_obj = {
			"auhtor": {
				"_id": user_id,
				"username": user.username,
				"photo": user.profile.photo
			},
			"title": title,
			"content": content,
			"status": options.status,
			"visibility": options.visibility,
			"permalink": libs.shortId.generate(),
			"created_time": now,
			"created_time_uuid": new libs.timeUUID(), 
			"keywords": helper.buildKeywords([title, user.username, options.category_name]),
			"details": {
				"category_id": options.category_id,
				"category_name": options.category_name
			}
		};
		var story = await models.stories.create(story_obj);
		if (!story) throw "Failed to create a new story";

		/** Push this new story to each author's followers timeline **/
		var follower_ids = await libs.redisClient.zrangeAsync(`${FOLLOWER_PREFIX}:${user_id}`, 0, -1);
		await Promise.map(follower_ids, async function(follower_id){
			// push to follower's timeline, story scored by microseconds time
			await libs.redisClient.zaddAsync(`${STORYLINE_PREFIX}:${follower_id}`, helper.getMicroTime(), story._id);
			// trim 1000 item
			await libs.redisClient.zremrangebyrankAsync(`${STORYLINE_PREFIX}:${follower_id}`, 0, -MAX_REDIS_SL_SIZE-1);
		}, {"concurrency": 10});

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

	controller.findByAuthorIdWithPagination = async function(author_id, last_uuid, limit){
		var stories = await models.stories.findByAuthorIdWithPagination(author_id, last_uuid, limit);
		if (!stories) return;

		stories = stories.map(s => formatStoryData(s));
		return stories;
	};

	controller.getUserTimeline = async function(user_id, last_uuid, limit){
		last_uuid = last_uuid || helper.getMicroTime();
		// check timeline on redis
		var story_ids = await libs.redisClient.zrevrangebyscoreAsync(`${STORYLINE_PREFIX}:${user_id}`, "("+last_uuid, "-inf", "LIMIT", 0, limit);
		var stories = [];
		// if result from redis is empty, get timeline from database
		if (!story_ids || !story_ids.length) {
			var follower_ids = await libs.redisClient.zrangeAsync(`${FOLLOWER_PREFIX}:${user_id}`, 0, -1);
			// stories = 
		}
	};

	return controller;
};