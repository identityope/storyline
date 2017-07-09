"use strict";

const log = rootRequire("libs/logger")('[user]');

module.exports = function(lib, models) {
    var controller = {};

    function formatUserData(user){
        if(!user){
            return {};
        }
        var user_data = {
            "_id": user._id,
            "username": user.username,
            "email": user.email,
            "profile": user.profile,
            "age": user.profile.birthdate ? lib.moment().diff(user.profile.birthdate, "years") : null,
            "last_seen": lib.moment(user.data.last_seen).fromNow(),
            "app_version": user.data.app_version,
            "total_stories": user.data.total_stories,
            "total_followers": user.data.total_followers,
            "total_followings": user.data.total_followings
        };
        user_data.profile.photo = helper.getUserPhotoURL(user_data._id, user_data.profile.photo);
        user_data.profile.photo_thumbnail = helper.getUserPhotoThumbnailURL(user_data._id, user_data.profile.photo);
        user_data.profile.cover_photo = helper.getUserCoverPhotoURL(user_data._id, user_data.profile.cover_photo);
        return user_data;
    }

    controller.register = function(username, email, password, platform, registration_device, app_version, advertising_obj, callback){
        var today = new Date();
        lib.async.waterfall([function(cb){
            if(email.indexOf("gmail.") === -1 && email.indexOf("googlemail.") === -1){
                return cb();
            }
            // check registered google email
            models.users.findByGoogleEmail(email, function(err, user){
                if(err){
                    return cb(err);
                }
                // user's email is already registered
                if(user){
                    return cb(helper.createErrorObject(403, "Email ini sudah terdaftar"));
                }
                cb();
            });
        }, function(cb){
            // check registered username or email
            models.users.findByUsernameOrEmail(username, email, function(err, user){
                 if(err){
                    return cb(err);
                }
                // user's username or email is already registered
                if(user){
                    return cb(helper.createErrorObject(403, "Username atau email ini sudah terdaftar"));
                }
                cb();
            });
        }, function(cb){
            // create new user
            var user_obj = {
                "username": username,
                "username_lowercase": username.toLowerCase(),
                "email": email,
                "email_lowercase": email.toLowerCase(),
                "salt": lib.crypto.randomBytes(64).toString('hex')
            };
            user_obj.password = helper.hashPassword(password, user_obj.salt);
            user_obj.profile = {};
            user_obj.keywords = helper.buildKeywords([username, email.split("@")[0]]);
            user_obj.data = {
                "registration_time": today,
                "registration_platform": platform,
                "registration_device": registration_device,
                "app_version": app_version,
                "advertising_ids": [advertising_obj],
                "last_update": today,
                "last_login": today,
                "last_seen": today
            };
            user_obj.online_devices = [{
                "device_model": registration_device.device_model,
                "device_notif_type": registration_device.device_notif_type,
                "device_notif_id": registration_device.device_notif_id
            }];
            models.users.create(user_obj, function(err, user){
                if(err){
                    return cb(err);
                }
                cb(null, formatUserData(user));
            });
        }], function(err, new_user){
            if(err){
                log.error(err);
                return callback(err);
            }
            callback(null, new_user);
        });
    };

    controller.login = function(username_email, password, online_device_obj, app_version, advertising_obj, callback){
        models.users.findByUsernameOrEmail(username_email, username_email, function(err, user){
            if(err){
                log.error(err);
                return callback(err);
            }
            if(!user){
                return callback();
            }
            // check password
            var hash = helper.hashPassword(password, user.salt);
            if(user.password !== hash){
                return callback(helper.createErrorObject(403, "Password tidak sesuai"));
            }
            // update user login data
            models.users.updateLoginData(user._id, online_device_obj, app_version, advertising_obj, function(err, res){
                if(err){
                    log.error(err);
                    return callback(err);
                }
                callback(null, formatUserData(user));
            });
        });
    };

    controller.logout = function(user_id, device_notif_type, device_notif_id, callback){
        // update user logout data
        models.users.updateLogoutData(user_id, device_notif_type, device_notif_id, function(err, res){
            if(err){
                log.error(err);
                return callback(err);
            }
            callback(null, res);
        });
    };

    controller.findById = function(user_id, callback){
        models.users.findById(user_id, function(err, user){
            if(err){
                log.error(err);
                return callback(err);
            }
            if(!user){
                log.error("user not found", user_id);
                return callback();
            }
            callback(null, formatUserData(user));
        });
    };

    return controller;
};
