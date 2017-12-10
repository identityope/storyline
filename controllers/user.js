"use strict";

const log = rootRequire("libs/logger")('[user]');
const SALT_ROUNDS = 11; // ~5 hashes/second

module.exports = function(libs, models) {
	var controller = {};

	function formatUserData(user){
		var user_data = {
			"_id": user._id,
			"username": user.username,
			"email": user.email,
			"account_status": user.account_status,
			"profile": user.profile,
			"age": user.profile.birthdate ? libs.moment().diff(user.profile.birthdate, "years") : null,
			"last_seen": libs.moment(user.details.last_seen).fromNow(),
			"app_version": user.details.app_version,
			"total_stories": user.details.total_stories,
			"total_followers": user.details.total_followers,
			"total_followings": user.details.total_followings
		};
		user_data.profile.photo_raw = user_data.profile.photo;
		user_data.profile.photo = helper.getUserPhotoURL(user_data._id, user_data.profile.photo);
		user_data.profile.photo_thumbnail = helper.getUserPhotoThumbnailURL(user_data._id, user_data.profile.photo);
		user_data.profile.cover_photo = helper.getUserCoverPhotoURL(user_data._id, user_data.profile.cover_photo);
		return user_data;
	}

	controller.register = async function(username, email, password, platform, registration_device, app_version, advertising_obj){
		var today = new Date();
		var user;
		// check registered google email
		if (email.indexOf("gmail.") >= 0 || email.indexOf("googlemail.") >= 0) {
			user = await models.users.findByGoogleEmail(email);
			if (user) throw "Email ini sudah terdaftar";
		}
		// check registered username or email
		user = await models.users.findByUsernameOrEmail(username, email);
		if (user) throw "Username atau email ini sudah terdaftar";

		// create a new user
		var hashed_password = await libs.bcrypt.hash(password, SALT_ROUNDS);
		var user_obj = {
			"username": username,
			"username_lowercase": username.toLowerCase(),
			"email": email,
			"email_lowercase": email.toLowerCase(),
			"password": hashed_password,
			"profile": {
				"photo": "../default.png",
				"cover_photo": "../default.png"
			},
			"keywords": helper.buildKeywords([username, email.split("@")[0]]),
			"details": {
				"registration_date": today,
				"registration_platform": platform,
				"registration_device": registration_device,
				"app_version": app_version,
				"advertising_ids": [advertising_obj],
				"last_update": today,
				"last_login": today,
				"last_seen": today
			},
			"online_devices": [{
				"device_id": registration_device.device_id,
				"device_model": registration_device.device_model,
				"device_notif_type": registration_device.device_notif_type,
				"device_notif_id": registration_device.device_notif_id
			}]
		};
		user = await models.users.create(user_obj);
		if (!user) throw "Failed to register a new user";

		return formatUserData(user);
	};

	controller.login = async function(username_email, password, online_device_obj, app_version, advertising_obj){
		var user = await models.users.findByUsernameOrEmail(username_email, {});
		if (!user) return;

		// check password
		var valid = await libs.bcrypt.compare(password, user.password);
		if (!valid) throw "Password tidak sesuai";

		// update user login data
		await models.users.updateLoginData(user._id, online_device_obj, app_version, advertising_obj);
		return formatUserData(user);
	};

	controller.logout = async function(user_id, device_notif_type, device_notif_id, callback){
		// update user logout data
		return await models.users.updateLogoutData(user_id, device_notif_type, device_notif_id);
	};

	controller.findById = async function(user_id){
		var user = await models.users.findById(user_id);
		if (!user) return;
		return formatUserData(user);
	};

	return controller;
};
