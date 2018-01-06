"use strict";

module.exports = function(mongoose){
	var collection = 'user_relations';
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var schema = new Schema({
		_id: ObjectId,
		following_id: ObjectId,
		follower_id: ObjectId,
		follow_date: Date,
		last_interaction: Date,
		closeness: Number
	});

	var Model = mongoose.model(collection, schema);

	var default_projection = {"__v": 0};

	/** Create Function ***/
	Model.create = async function(relation_obj){
		var query = {
			"following_id": relation_obj.following_id,
			"follower_id": relation_obj.follower_id
		};
		var options = {"new": true, "upsert": true};
		var relation = await Model.findOneAndUpdate(query, relation_obj, options).exec();
		return relation ? relation.toObject() : null;
	};

	/** Read Functions **/
	Model.findAll = async function(projection = default_projection){
		var relations = await Model.find({}, projection, {"sort": {"_id": 1}}).exec();
		return relations ? relations.map(helper.mapObjects) : null;
	};

	Model.findAllFollowers = async function(following_id, projection = default_projection){
		var followers = await Model.find({following_id}, projection, {"sort": {"follow_date": -1}}).exec();
		return followers ? followers.map(helper.mapObjects) : null;
	};

	Model.findAllFollowings = async function(follower_id, projection = default_projection){
		var followings = await Model.find({follower_id}, projection, {"sort": {"follow_date": -1}}).exec();
		return followings ? followings.map(helper.mapObjects) : null;
	};

	Model.findFollowersWithPagination = async function(following_id, skip, limit, projection = default_projection){
		var followers = await Model.find({following_id}, projection, {"sort": {"follow_date": -1}, skip, limit}).exec();
		return followers ? followers.map(helper.mapObjects) : null;
	};

	Model.findFollowingsWithPagination = async function(follower_id, skip, limit, projection = default_projection){
		var followings = await Model.find({follower_id}, projection, {"sort": {"follow_date": -1}, skip, limit}).exec();
		return followings ? followings.map(helper.mapObjects) : null;
	};

	/** Update functions **/
	Model.updateRelationByUserId = async function(following_id, follower_id, last_interaction, closeness){
		var result = await Model.update({following_id, follower_id}, {"$set": {last_interaction}, "$inc": {closeness}}).exec();
		return result ? (result.n > 0) : null;
	};

	/** Delete functions **/
	Model.deleteById = async function(_id){
		var result = await Model.remove({_id}).exec();
		return result ? (result.result.n > 0) : null;
	};

	Model.deleteByUserId = async function(following_id, follower_id){
		var result = await Model.remove({following_id, follower_id}).exec();
		return result ? (result.result.n > 0) : null;
	};

	return Model;
};
