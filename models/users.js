"use strict";

module.exports = function(mongoose){
	var collection = 'users';
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var schema = new Schema({
		_id: ObjectId,
		username: String,
		password: String,
		salt: String,
		email: String,
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
			registration_time: Date,
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
            reset_password_time: Date
		},
		online_devices: [{
			_id: false,
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

	/** Enumeration definition **/
	Model.genderEnum = Object.freeze({
		WOMEN: 0,
    	MEN: 1
    });

    Model.restrictedUsernames = ["admin", "docs", "blog", "story", "storyline", "user", "public", "images", "contact", "support", "server"];

	/** Create Function ***/
	Model.create = function(user_obj, callback){
		user_obj._id = new mongoose.Types.ObjectId();
		var user = new Model(user_obj);
		user.save(function(err, obj){
			if(err || !obj){
				return callback(err);
			}
			callback(null, obj.toObject());
		});
	};

	/** Read Functions **/
	Model.findAll = function(callback){
		Model.find({}, {}, {"sort": {"_id": 1}}, function(err, users){
			if(err || !users){
				return callback(err);
			}
			callback(null, users.map(helper.mapObjects));
		});
	};

	Model.findById = function(user_id, callback){
		Model.findOne({"_id": user_id}, function(err, user){
			if(err || !user){
				return callback(err);
			}
			callback(null, user.toObject());
		});
	};

	Model.findByIdWithProjection = function(user_id, projection, callback){
		Model.findOne({"_id": user_id}, projection, function(err, user){
			if(err || !user){
				return callback(err);
			}
			callback(null, user.toObject());
		});
	};

	Model.findByUsername = function(username, callback){
		Model.findOne({"username_lowercase": username.toLowerCase()}, function(err, user){
			if(err || !user){
				return callback(err);
			}
			callback(null, user.toObject());
		});
	};

	Model.findByEmail = function(email, callback){
		Model.findOne({"email_lowercase": email.toLowerCase()}, function(err, user){
			if(err || !user){
				return callback(err);
			}
			callback(null, user.toObject());
		});
	};

	Model.findByUsernameOrEmail = function(username, email, callback){
		var query = {"$or": [
			{"username_lowercase": username.toLowerCase()},
			{"email_lowercase": email.toLowerCase()}
		]};
		Model.findOne(query, function(err, user){
			if(err || !user){
				return callback(err);
			}
			callback(null, user.toObject());
		});
	};

	Model.findByGoogleEmail = function(email, callback){
		var emailWithoutDot = email.toLowerCase().split("gmail.")[0].split("googlemail.")[0].replace(/\./g, "");
        var emailRegex = "^"+emailWithoutDot.split("").join("\\.*");
        var query = {"email_lowercase": {"$regex": new RegExp(emailRegex)}};

        Model.findOne(query, function(err, user){
            if(err || !user){
                return callback(err);
            }
            callback(null, user.toObject());
        });
	};

	Model.findByIds = function(user_ids, callback){
		Model.find({"_id": {"$in": user_ids}}, function(err, users){
			if(err || !users){
				return callback(err);
			}
			callback(null, users.map(helper.mapObjects));
		});
	};

	Model.findByIdsWithProjection = function(user_ids, projection, callback){
		Model.findOne({"_id": {"$in": user_ids}}, projection, function(err, users){
			if(err || !users){
				return callback(err);
			}
			callback(null, users.map(helper.mapObjects));
		});
	};

	/** Update functions **/
	Model.updateById = function(user_id, update_obj, callback){
		Model.update({"_id": user_id}, update_obj, {"multi": false}, function(err, res){
			if(err || !res){
				return callback(err);
			}
			callback(null, res.n > 0);
		});
	};

	Model.updateLoginData = function(user_id, online_device_obj, app_version, advertising_obj, callback){
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
		Model.update(query, update, function(err, result){
			if(err || !result){
				return callback(err);
			}
			callback(null, result.n > 0);
		});
	};

	Model.updateLogoutData = function(user_id, device_notif_type, device_notif_id, callback){
		var today = new Date();
		var query = {"_id": user_id};
		var update = {"$set": {
			"data.last_seen": today
		}, "$pull": {
			"online_devices": {"device_notif_type": device_notif_type, "device_notif_id": device_notif_id}
		}};
		// update data
		Model.update(query, update, function(err, result){
			if(err || !result){
				return callback(err);
			}
			callback(null, result.n > 0);
		});
	};

	/** Delete functions **/
	Model.deleteById = function(user_id, callback){
		Model.remove({"_id": user_id}, function(err, res){
			if(err || !res){
				return callback(err);
			}
			callback(null, res.result.n > 0);
		});
	};

	return Model;
};
