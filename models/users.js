"use strict";

module.exports = function(mongoose){
	var collection = 'users';
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var schema = new Schema({
		_id: ObjectId,
		username: String,
		email: String,
		password: String,
		username_lowercase: String,
		email_lowercase: String,
		account_status: Number,
		profile: {
			fullname: String,
			birthdate: Date,
			gender: Number,
			phone: String,
			photo: String,
			cover_photo: String,
			about_me: String,
			province_id: ObjectId,
			city_id: ObjectId,
			district_id: ObjectId,
			location: {
				type: {type: String},
				coordinates: [Number] // longitude, latitude
			},
			additional_info: {}
		},
		keywords: [String],
		data: {
			registration_date: Date,
			registration_platform: String,
			registration_device: { // for mobile app
				device_id: String,
				device_model: String,
				device_imei: String,
				device_os: String,
				device_notif_type: String,
				device_notif_id: String
			},
			app_version: String,
			advertising_ids: [{
				_id: false,
				platform: String,
				ads_id: String
			}],
			last_update: Date,
			last_login: Date,
			last_seen: Date,
			last_story: Date,
			total_stories: Number,
			total_followings: Number,
			total_followers: Number,
			is_phone_verified: Boolean,
			is_email_verified: Boolean,
			email_code: String,
			phone_code: String,
			last_sent_sms: Date,
			total_sent_sms: Number,
			reset_password_code: String,
			reset_password_date: Date
		},
		online_devices: [{
			_id: false,
			device_id: String,
			device_model: String,
			device_notif_type: String,
			device_notif_id: String
		}],
		followings: [{
			_id: false,
			user_id: ObjectId,
			username: String,
			fullname: String,
			user_photo: String,
			since: Date,
			closeness: Number,
			last_interaction: Date
		}],
		followers: [{
			_id: false,
			user_id: ObjectId,
			username: String,
			fullname: String,
			user_photo: String,
			since: Date,
			closeness: Number,
			last_interaction: Date
		}]
	});

	schema.index({_id: 1});

	var Model = mongoose.model(collection, schema);

	/** Enumeration & Constants **/
	Model.genderEnum = Object.freeze({
		WOMEN: 0,
		MEN: 1
	});

	Model.restrictedUsernames = ["admin", "docs", "blog", "story", "storyline", "user", "public", "images", "contact", "support", "server"];

	const default_projection = {"password": 0, "keywords": 0, "online_devices": 0, "followings": 0, "followers": 0};

	/** Create Function ***/
	Model.create = async function(user_obj){
		user_obj._id = new mongoose.Types.ObjectId();
		var user = await new Model(user_obj).save();
		return user ? user.toObject() : null;
	};

	/** Read Functions **/
	Model.findAll = async function(projection = default_projection){
		var users = await Model.find({}, projection, {"sort": {"_id": 1}}).exec();
		return users ? users.map(helper.mapObjects) : null;
	};

	Model.findById = async function(user_id, projection = default_projection){
		var user = await Model.findOne({"_id": user_id}, projection).exec();
		return user ? user.toObject() : null;
	};

	Model.findByUsername = async function(username, projection = default_projection){
		var user = await Model.findOne({"username_lowercase": username.toLowerCase()}, projection).exec();
		return user ? user.toObject() : null;
	};

	Model.findByEmail = async function(email, projection = default_projection){
		var user = await Model.findOne({"email_lowercase": email.toLowerCase()}, projection).exec();
		return user ? user.toObject() : null;
	};

	Model.findByUsernameOrEmail = async function(username_email, projection = default_projection){
		var query = {"$or": [
			{"username_lowercase": username_email.toLowerCase()},
			{"email_lowercase": username_email.toLowerCase()}
		]};
		var user = await Model.findOne(query, projection).exec();
		return user ? user.toObject() : null;
	};

	Model.findByGoogleEmail = async function(email, projection = default_projection){
		var emailWithoutDot = email.toLowerCase().split("gmail.")[0].split("googlemail.")[0].replace(/\./g, "");
		var emailRegex = "^"+emailWithoutDot.split("").join("\\.*");
		var query = {"email_lowercase": {"$regex": new RegExp(emailRegex)}};
		var user = await Model.findOne(query, projection).exec();
		return user ? user.toObject() : null;
	};

	Model.findByIds = async function(user_ids, projection = default_projection){
		var users = await Model.find({"_id": {"$in": user_ids}}, projection).exec();
		return users ? users.map(helper.mapObjects) : null;
	};

	/** Update functions **/
	Model.updateById = async function(user_id, update_obj){
		var result = await Model.update({"_id": user_id}, update_obj, {"multi": false}).exec();
		return result ? (result.n > 0) : null;
	};

	Model.updateLoginData = async function(user_id, online_device_obj, app_version, advertising_obj){
		var today = new Date();
		var query = {"_id": user_id};
		var update = {"$set": {
			"data.app_version": app_version,
			"data.last_login": today,
			"data.last_seen": today
		}, "$addToSet": {
			"data.advertising_ids": advertising_obj,
			"online_devices": online_device_obj
		}};
		// update data
		var result = await Model.update(query, update).exec();
		return result ? (result.n > 0) : null;
	};

	Model.updateLogoutData = async function(user_id, device_notif_type, device_notif_id){
		var today = new Date();
		var query = {"_id": user_id};
		var update = {"$set": {
			"data.last_seen": today
		}, "$pull": {
			"online_devices": {"device_notif_type": device_notif_type, "device_notif_id": device_notif_id}
		}};
		// update data
		var result = await Model.update(query, update).exec();
		return result ? (result.n > 0) : null;
	};

	/** Delete functions **/
	Model.deleteById = async function(user_id){
		var result = await Model.remove({"_id": user_id}).exec();
		return result ? (result.result.n > 0) : null;
	};

	return Model;
};
