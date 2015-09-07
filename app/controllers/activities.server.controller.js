'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Activity = mongoose.model('Activity');

/**
 * List of Activities
 */
exports.list = function(req, res) {
	Activity.find().sort('-created').populate('user', 'displayName').exec(function(err, projects) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projects);
		}
	});
};


/**
 * Create activity instance
 */
exports.create = function(obj) {
	// config activity object with user, object id's, action type
	// config activity string
	// socket object

	var ActivityObj = new Activity({
		user: obj.userObj._id,
		projectId: obj.projectId,
		noteId: obj.noteId,
		commentId: obj.commentId,
		nestedCommentId: obj.nestedCommentId,
		activityType: obj.activityType
	});

	if (obj.activityType === 1) {
		ActivityObj.activityString = obj.userObj.username + ' created a new project called ' + obj.name;
	} else if (obj.activityType === 2) {
		ActivityObj.activityString = obj.userObj.username + ' created a new note called ' + obj.newNote.title;
	}

	ActivityObj.save(function(err) {
		if (err) {
			console.log(err);
		} else {
			// socket
			console.log('string here');
			console.log(ActivityObj.activityString);
		}
	});

};
