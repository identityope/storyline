"use strict";

module.exports = function(libs){
	var helper = {};

	/** Basic helper function **/

	// return array of object from array of mongoose oject
	helper.mapObjects = function(obj){ 
		return obj.toObject(); 
	};

	// return array of [error, value] from resolved/rejected promise
	helper.wrapPromise = function(promise){
		return promise.then(data => [null, data]).catch(err => [err]);
	};

	// return unique words from text
	helper.breakupWords = function(text){
		if (!text) return;
		var delimiters = /[\s_.,'"+:?!@#^*()\[\]\-]+/;
		var words = text.toLowerCase().split(delimiters).filter(str => !!str);
		return Array.from(new Set(words));
	};

	// build keywords for search
	helper.buildKeywords = function(texts){
		var wordset = new Set();

		_.each(texts, function(text){
			var words = helper.breakupWords(text);
			_.each(words, function(word){
				wordset.add(word);
			});
		});

		return Array.from(wordset);
	};

	// string sanitizer
	helper.sanitize = function(str){
		if(!str){
			return null;
		}
		str = str.toString().trim().replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
		str = libs.sanitizeCaja(str).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
		return str || null;
	};

	// phone number sanitizer
	helper.sanitizePhone = function(phone){
		phone = phone.trim();

		if(phone.indexOf("\n") >= 0){
			phone = phone.split("\n")[0];
		}

		if(phone.indexOf("/") >= 0){
			phone = phone.split("/")[0];
		}

		phone = phone.replace(/[\s\-\(\)]+/g, "");

		if(phone.indexOf("62") === 0){
			phone = "+" + phone;
		}else if(phone.charAt(0) !== "0" && phone.charAt(0) !== "+"){
			phone = "+62" + phone;
		}else if(phone.charAt(0) === "0"){
			phone = phone.substring(1);
		    phone = "+62" + phone;
		}

		return phone;
	};

	/** Image helper functions **/

	helper.getUserPhotoURL = function(user_id, filename){
		if(!filename){
			return config.image_server + "/default.png";
		}else if(filename.indexOf("../") === 0){
			return config.image_server + "/" + filename.substring(3);
		}else{
			return config.image_server + "/users/" + user_id + "/" + filename;
		}
	};

	helper.getUserPhotoThumbnailURL = function(user_id, filename){
		if(!filename){
			return config.image_server + "/thumbnail/default.png";
		}else if(filename.indexOf("../") === 0){
			return config.image_server + "/thumbnail/" + filename.substring(3);
		}else{
			return config.image_server + "/users/" + user_id + "/thumbnail/" + filename;
		}
	};

	helper.getUserCoverPhotoURL = function(user_id, filename){
		if(!filename){
			return config.image_server + "/cover/default.png";
		}else if(filename.indexOf("../") === 0){
			return config.image_server + "/cover/" + filename.substring(3);
		}else{
			return config.image_server + "/users/" + user_id + "/cover/" + filename;
		}
	};

	helper.getProductImagePath = function(filename){
		if(!filename){
			return null;
		}else if(filename.indexOf("../") === 0){
			return config.image_server + "/" + filename.substring(3);
		}else{
			return config.image_server + '/products/' + filename;
		}
	};

	helper.getProductThumbnailsPath = function(filename){
		if(!filename){
			return null;
		}else if(filename.indexOf("../") === 0){
			return config.image_server + "/" + filename.substring(3);
		}else{
			return config.image_server + '/products/thumbnails/' + filename;
		}
	};

	/** Datetime helper function **/

	helper.getDateTimeString = function(date){
		return libs.moment(date).format("YYYY-MM-DD HH:mm:ss");
	};

	helper.getTimeString = function(date){
		return libs.moment(date).format("HH:mm:ss");
	};

	helper.getMicroTime = function(time_uuid){
		var times = new libs.timeUUID(time_uuid).getTimeOfDay();
		return times[0] * 1e6 + times[1];
	};

	return helper;
};