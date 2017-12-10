"use strict";

const log = rootRequire("libs/logger")('[user]');

module.exports = function(models, controllers, api){

	/**
	 * @apiDefine ResponseError4xx
	 * @apiError {String} message The <code>id</code> of the User was not found.
	 */

	 /**
	 * @apiDefine ResponseError500
	 * @apiError (Error 500) {String} message Something happened on the server.
	 */

	/**
	 * Author: ope
	 *
	 * @api {post} /user/register Register New User
	 * @apiName registerNewUser
	 * @apiDescription Register new user.
	 * @apiGroup User
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} username User's username
	 * @apiParam {String} email User's email
	 * @apiParam {Password} password User's password
	 * @apiParam {String} platform User's platform on registration (android, ios, or web)
	 * @apiParam {String} device_id User's device ID
	 * @apiParam {String} device_model User's device model
	 * @apiParam {String} device_imei User's device IMEI
	 * @apiParam {String} device_os User's device OS version
	 * @apiParam {String} device_notif_type User's device push notification type (APNS or FCM)
	 * @apiParam {String} device_notif_id User's device push notification ID
	 * @apiParam {String} app_version User's app version
	 * @apiParam {String} advertising_platform User's app advertising platform
	 * @apiParam {String} advertising_id User's app advertising ID
	 *
	 * @apiSuccess {Object} data User object
	 *
	 */
	api.post("/user/register", false, async function(req, res, auth){
		var username = helper.sanitize(req.body.username);
		var email = helper.sanitize(req.body.email);
		var password = helper.sanitize(req.body.password);
		var platform = helper.sanitize(req.body.platform);
		var device_id = helper.sanitize(req.body.device_id);
		var device_model = helper.sanitize(req.body.device_model);
		var device_imei = helper.sanitize(req.body.device_imei);
		var device_os = helper.sanitize(req.body.device_os);
		var device_notif_type = helper.sanitize(req.body.device_notif_type);
		var device_notif_id = helper.sanitize(req.body.device_notif_id);
		var app_version = helper.sanitize(req.body.app_version);
		var advertising_platform = helper.sanitize(req.body.advertising_platform);
		var advertising_id = helper.sanitize(req.body.advertising_id);
		var device_obj = {};
		// check device info from mobile app
		if (device_notif_type && device_notif_id) {
			device_obj.device_id = device_id;
			device_obj.device_model = device_model;
			device_obj.device_imei = device_imei;
			device_obj.device_os = device_os;
			device_obj.device_notif_type = device_notif_type;
			device_obj.device_notif_id = device_notif_id;
		}
		var advertising_obj = {
			"platform": advertising_platform,
			"ads_id": advertising_id
		};
		var username_valid = /^([a-zA-Z0-9_]){4,15}$/.test(username);
		// check params
		if (!username_valid) {
			return res.reply(400, "Username harus terdiri dari 4 sampai 15 karakter alphanumerik dan/atau _");
		}
		if (username && models.users.restrictedUsernames.indexOf(username) > -1) {
			return res.reply(403, "Username ini tidak dapat digunakan");
		}
		if (!email || email.indexOf("@") === -1 || email.indexOf(".") === -1) { // very simple email validation
			return res.reply(400, "Harap isi email dengan benar");
		}
		if (!password || password.length < 6) {
			return res.reply(400, "Password harus terdiri dari minimal 6 karakter");
		}
		// register a new user
		var [err, new_user] = await wrap(controllers.user.register(username, email, password, platform, device_obj, app_version, advertising_obj));
		if (err) {
			log.error(err);
			return res.replyError(err);
		}
		// login this new user
		var ip_address = req.ip;
		var user_agent = req.headers['user-agent'];
		var online_device_obj = _.pick(device_obj, ["device_id", "device_model", "device_notif_type", "device_notif_id"]);
		var token = await controllers.authentication.login(new_user, ip_address, user_agent, online_device_obj);
		new_user.token = token;
		res.reply(200, null, new_user);
	});

	/**
	 * Author: ope
	 *
	 * @api {post} /user/login Login User
	 * @apiName loginUser
	 * @apiDescription Login user.
	 * @apiGroup User
	 * @apiVersion 1.0.0
	 *
	 * @apiParam {String} username_email User's username
	 * @apiParam {Password} password User's password
	 * @apiParam {String} device_id User's device ID
	 * @apiParam {String} device_model User's device model
	 * @apiParam {String} device_notif_type User's device push notification type (APNS or FCM)
	 * @apiParam {String} device_notif_id User's device push notification ID
	 * @apiParam {String} app_version User's app version
	 * @apiParam {String} advertising_platform User's app advertising platform
	 * @apiParam {String} advertising_id User's app advertising ID
	 *
	 * @apiSuccess {Object} data User object
	 * @apiSuccess {String} data.username Username of user
	 * @apiSuccess {String} data.email Email of user
	 *
	 * @apiUse ResponseError4xx
	 * @apiUse ResponseError500
	 *
	 */
	api.post("/user/login", false, async function(req, res, auth){
		var username_email = helper.sanitize(req.body.username_email);
		var password = helper.sanitize(req.body.password);
		var device_id = helper.sanitize(req.body.device_id);
		var device_model = helper.sanitize(req.body.device_model);
		var device_notif_type = helper.sanitize(req.body.device_notif_type);
		var device_notif_id = helper.sanitize(req.body.device_notif_id);
		var app_version = helper.sanitize(req.body.app_version);
		var advertising_platform = helper.sanitize(req.body.advertising_platform);
		var advertising_id = helper.sanitize(req.body.advertising_id);
		var online_device_obj = {};
		// check device info from mobile app
		if (device_notif_type && device_notif_id) {
			online_device_obj.device_id = device_id;
			online_device_obj.device_model = device_model;
			online_device_obj.device_notif_type = device_notif_type;
			online_device_obj.device_notif_id = device_notif_id;
		}
		var advertising_obj = {
			"platform": advertising_platform,
			"ads_id": advertising_id
		};
		// check params
		if (!username_email) {
			return res.reply(400, "Username atau email tidak boleh kosong");
		}
		if (!password) {
			return res.reply(400, "Password tidak boleh kosong");
		}
		// login this user
		var [err, user] = await wrap(controllers.user.login(username_email, password, online_device_obj, app_version, advertising_obj));
		if (err) {
			log.error(err);
			return res.replyError(err);
		}
		if (!user) {
			return res.reply(404, "Username atau email tidak ditemukan");
		}
		var ip_address = req.ip;
		var user_agent = req.headers['user-agent'];
		var token = await controllers.authentication.login(user, ip_address, user_agent, online_device_obj);
		user.token = token;
		res.reply(200, null, user);
	});

	/**
	 * Author: ope
	 *
	 * @api {post} /user/logout Logout User
	 * @apiName logoutUser
	 * @apiDescription Logout user.
	 * @apiGroup User
	 * @apiVersion 1.0.0
	 *
	 * @apiHeader {String} Authorization User's token
	 *
	 * @apiParam {String} device_notif_type User's device push notification type (APNS or FCM)
	 * @apiParam {String} device_notif_id User's device push notification ID
	 *
	 * @apiSuccess {Object} data User object
	 *
	 * @apiHeaderExample {form-data} Header-Example:
	 *   Authorization=Token DEVELOPMENT_TOKEN
	 */
	api.post("/user/logout", true, async function(req, res, auth){
		var user_id = auth.user_id;
		var device_notif_type = helper.sanitize(req.body.device_notif_type);
		var device_notif_id = helper.sanitize(req.body.device_notif_id);
		// logout user
		var [err, result] = await wrap(controllers.user.logout(user_id, device_notif_type, device_notif_id));
		if (err) {
			log.error(err);
			return res.replyError(err);
		}
		if (!result) {
			return res.reply(404, "Logout gagal. Harap coba lagi");
		}
		await controllers.authentication.logout(auth.token, user_id);
		res.reply(200, null, result);
	});

	/**
	 * Author: ope
	 *
	 * @api {get} /user/profile Get User Profile
	 * @apiName getUserProfile
	 * @apiDescription Get user profile data.
	 * @apiGroup User
	 * @apiVersion 1.0.0
	 *
	 * @apiHeader {String} Authorization User's token
	 *
	 * @apiSuccess {Object} data User object
	 *
	 * @apiHeaderExample {form-data} Header-Example:
	 *   Authorization=Token DEVELOPMENT_TOKEN
	 */
	api.get("/user/profile", true, async function(req, res, auth){
		var user_id = auth.user_id;
		var [err, user] = await wrap(controllers.user.findById(user_id));
		if (err) {
			log.error(err);
			return res.replyError(err);
		}
		if (!user) {
			return res.reply(404, "user not found");
		}
		res.reply(200, null, user);
	});

	/**
	 * Author: ope
	 *
	 * @api {get} /user/auth_data Get User Authentication Data
	 * @apiName getUserAuthenticationData
	 * @apiDescription Get user Authentication Data
	 * @apiGroup User
	 * @apiVersion 1.0.0
	 *
	 * @apiHeader {String} Authorization User's token
	 *
	 * @apiSuccess {Object} data User object
	 *
	 * @apiHeaderExample {form-data} Header-Example:
	 *   Authorization=Token DEVELOPMENT_TOKEN
	 */
	api.get("/user/auth_data", async function(req, res, auth){
		res.reply(200, null, auth);
	});

	/**
	 * Author: ope
	 *
	 * @api {get} /user/:id/profile Get User Profile by ID
	 * @apiName getUserProfileById
	 * @apiDescription Get user profile data by user ID.
	 * @apiGroup User
	 * @apiVersion 1.0.0
	 *
	 * @apiSuccess {Object} data User object
	 *
	 */
	api.get("/user/:id/profile", async function(req, res, auth){
		var user_id = helper.sanitize(req.params.id);
		var [err, user] = await wrap(controllers.user.findById(user_id));
		if (err) {
			log.error(err);
			return res.replyError(err);
		}
		if(!user){
			return res.reply(404, "user not found");
		}
		res.reply(200, null, user);
	});

};