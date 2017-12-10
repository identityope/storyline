"use strict";

module.exports = function(mongoose){
	var collection = 'stories';
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var schema = new Schema({
		_id: ObjectId,
		user_id: ObjectId,
		username: String,
		userphoto: String,
		title: String, // optional
		content: String,
		status: Number,
		permalink: String,
		category_id: ObjectId,
		category_name: String,
		created_date: Date,
		updated_date: Date,
		created_time_uuid: String, 
		keywords: [String],
		details: {
			total_comments: Number,
			total_loves: Number,
			total_reposts: Number,
			total_reports: Number,
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

	var default_projection = {"__v": 0};

	/** Create Function ***/
	Model.create = async function(story_obj){
		story_obj._id = new mongoose.Types.ObjectId();
		var story = await new Model(story_obj).save();
		return story ? story.toObject() : null;
	};

	/** Read Functions **/
	Model.findAll = async function(projection = default_projection){
		var users = await Model.find({}, projection, {"sort": {"_id": 1}}).exec();
		return users ? users.map(helper.mapObjects) : null;
	};

	Model.findById = async function(_id, projection = default_projection){
		var story = await Model.findOne({_id}, projection).exec();
		return story ? story.toObject() : null;
	};

	Model.findByPermalink = async function(permalink, projection = default_projection){
		var story = await Model.findOne({permalink}, projection).exec();
		return story ? story.toObject() : null;
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
