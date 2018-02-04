"use strict";

module.exports = function(mongoose){
	var collection = 'stories';
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var schema = new Schema({
		_id: ObjectId,
		author: {
			_id: ObjectId, // author's user _id
			username: String,
			photo: String
		},
		title: String, // optional
		content: String,
		status: Number, // normal or anonymous
		visibility: Number, // friends or public
		permalink: String,
		created_time: Date,
		updated_time: Date, // if edited
		created_time_uuid: String,
		expiry_time: Date, // optional 
		keywords: [String],
		details: {
			total_comments: Number,
			total_loves: Number,
			total_reposts: Number,
			total_reports: Number,
			// optional fields
			category_id: ObjectId,
			category_name: String,
			is_serial: Boolean,
			serial_number: Number,
			prev_id: ObjectId,
			next_id: ObjectId
		},
		attachment: {
			photos: [],
			videos: [],
			links: []
		},
		location: {
			type: {type: String},
			coordinates: [Number] // longitude, latitude
		}
	});

	var Model = mongoose.model(collection, schema);

	/** Enumeration & Constants **/
	Model.visibilityEnum = Object.freeze({
		PUBLIC: 0,
		FRIENDS: 1
	});

	Model.statusEnum = Object.freeze({
		NORMAL: 0,
		ANONYMOUS: 1
	});

	var default_projection = {"__v": 0};

	/** Create Function ***/
	Model.create = async function(story_obj){
		story_obj._id = new mongoose.Types.ObjectId();
		var story = await new Model(story_obj).save();
		return story ? story.toObject() : null;
	};

	/** Read Functions **/
	Model.findAll = async function(projection = default_projection){
		var stories = await Model.find({}, projection, {"sort": {"created_time_uuid": -1}}).exec();
		return stories ? stories.map(helper.mapObjects) : null;
	};

	Model.findById = async function(_id, projection = default_projection){
		var story = await Model.findOne({_id}, projection).exec();
		return story ? story.toObject() : null;
	};

	Model.findByPermalink = async function(permalink, projection = default_projection){
		var story = await Model.findOne({permalink}, projection).exec();
		return story ? story.toObject() : null;
	};

	Model.findAllByAuthorId = async function(author_id, projection = default_projection){
		var stories = await Model.find({"author._id": author_id}, projection, {"sort": {"created_time_uuid": -1}}).exec();
		return stories ? stories.map(helper.mapObjects) : null;
	};

	Model.findByAuthorIdWithPagination = async function(author_id, last_uuid, limit, projection = default_projection){
		var query = {"author._id": author_id, "status": Model.statusEnum.NORMAL};
		if (last_uuid) {
			query.created_time_uuid = {"$lt": last_uuid};
		}
		var stories = await Model.find(query, projection, {"sort": {"created_time_uuid": -1}, limit}).exec();
		return stories ? stories.map(helper.mapObjects) : null;
	};

	Model.findForUserTimeline = async function(follower_ids, last_uuid, limit, projection = default_projection){
		var query = {"author._id": {"$in": follower_ids}};
		if (last_uuid) {
			query.created_time_uuid = {"$lt": last_uuid};
		}
		var stories = await Model.find(query, projection, {"sort": {"created_time_uuid": -1}, limit}).exec();
		return stories ? stories.map(helper.mapObjects) : null;
	};

	/** Update functions **/
	Model.updateById = async function(_id, update_obj){
		var result = await Model.update({_id}, update_obj, {"multi": false}).exec();
		return result ? (result.n > 0) : null;
	};

	/** Delete functions **/
	Model.deleteById = async function(_id){
		var result = await Model.remove({_id}).exec();
		return result ? (result.result.n > 0) : null;
	};

	return Model;
};
