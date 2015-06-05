'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Activity = mongoose.model('Activity');

exports.create = function(obj) {
	// config activity object with user, action type, object id
	// save
	// socket object
	
	ActivityObj.user = obj.user;

	if (obj.projectCreated) {
		
	}

};
