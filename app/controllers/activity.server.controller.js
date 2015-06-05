'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Activity = mongoose.model('Activity');

exports.create = function(obj) {
	// config activity object with user, object id's, action type
	// save
	// socket object

	var ActivityObj = new Activity({
		user: obj.user,
		projectId: obj.projectId,
		noteId: obj.noteId,
		commentId: obj.commentId,
		nestedCommentId: obj.nestedCommentId,
		actiontype: obj.actiontype
	});

	ActivityObj.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// socket
		}
	});

};
