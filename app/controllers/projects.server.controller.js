'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Project = mongoose.model('Project'),
	activityHandler = require('./activities.server.controller'),
	_ = require('lodash');

/**
 * Create a Project
 */
exports.create = function(req, res) {
	var project = new Project(req.body);
	project.user = req.user;

	project.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			project.activityType = 1;
			project.userObj = req.user;
			project.projectId = project._id;
			activityHandler.create(project);
			res.jsonp(project);
		}
	});
};

/**
 * Show the current Project
 */
exports.read = function(req, res) {
	res.jsonp(req.project);
};

/**
 * Update a Project
 */
exports.update = function(req, res, next) {
	Project.findById(req.body._id).exec(function(err, project) {
		project.followers.push(req.user._id);
		console.log(project.followers);
		project.save(function(err, projectSaved) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				// projectSaved.followProject = true;
				// projectSaved.activityType = 4;
				// projectSaved.userObj = req.user;
				// activityHandler.create(projectSaved);
				// console.log('about to respond in followProject');
				var obj = {
					hey: 'hey'
				};
				res.jsonp(projectSaved);
			}
		});
	});
	// if (req.body.projectComment || req.body.newNote || req.body.noteComment || req.body.followProject ) {
	// 	next();
	// }
	// console.log('in update');
	// var project = req.project ;
	// project = _.extend(project , req.body);
	// console.log(req.body.updatedNote);
	// project.updatedNote = req.body.updatedNote;
	// console.log(project.updatedNote);
	// var newNote = req.body.newNote;
	// console.log('heres new note');

	// project.save(function(err) {
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		project
	// 			.populate('user', 'username providerData.profile_image_url_https')
	// 			.populate('notes.comments.user', 'username providerData.profile_image_url_https')
	// 			.populate('notes.comments.comments.user', 'username providerData.profile_image_url_https')
	// 			.populate('comments.user', 'username providerData.profile_image_url_https')
	// 			.populate('comments.comments.user', 'username providerData.profile_image_url_https', function() {
	// 				project.userObj = req.user;
	// 				if (newNote) {
	// 					project.newNote = project.notes[project.notes.length - 1];
	// 					project.activityType = 2;
	// 					activityHandler.create(project);
	// 				} 
	// 				// else if (noteComment) {
	// 				// 	project.projectId = project._id;
	// 				// 	project.noteId = req.body.updatedNote;
	// 				// }
	// 				res.jsonp(project);
	// 			});
	// 	}
	// });
};

/**
 * Create a note
 */
exports.createProjectComment = function(req, res, next) {
	console.log('in create 12');
	if (req.body.newNote || req.body.noteComment || req.body.followProject ) {
		next();
	} else {
		console.log('in create');
		Project.findById(req.body._id)
		 	.exec(function(err, project) {
				project.comments.push(req.body.projectComment);
				project.save(function(err, projectSaved) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						console.log('in else in cpc');
						projectSaved
							.populate('user', 'username providerData.profile_image_url_https')
							.populate('notes.comments.user', 'username providerData.profile_image_url_https')
							.populate('notes.comments.comments.user', 'username providerData.profile_image_url_https')
							.populate('comments.user', 'username providerData.profile_image_url_https')
							.populate('comments.comments.user', 'username providerData.profile_image_url_https', function() {
								projectSaved.newComment = projectSaved.comments[projectSaved.comments.length - 1];
								projectSaved.activityType = 3;
								projectSaved.userObj = req.user;
								activityHandler.create(projectSaved);
								console.log('about to res');
								res.jsonp(projectSaved);
							});
					}
				});
			});
	}
};

/**
 * Create a note
 */
exports.createNote = function(req, res, next) {
	console.log('in create note');
	if (req.body.noteComment || req.body.followProject ) {
		next();
	}


	Project.findById(req.body._id).exec(function(err, project) {
		project.notes.push(req.body.newNote);
		project.save(function(err, projectSaved) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				projectSaved.newNote = projectSaved.notes[projectSaved.notes.length - 1];
				projectSaved.activityType = 2;
				projectSaved.userObj = req.user;
				activityHandler.create(projectSaved);
				console.log('about to res in note');
				res.jsonp(projectSaved);
			}
		});
	});
};

exports.createNoteComment = function(req, res, next) {
	if (req.body.noteComment || req.body.projectComment || req.body.followProject ) {
		next();
	}
};

exports.followProject = function(req, res, next) {
	var thisUser = req.user._id;

	Project.findById(req.body._id).exec(function(err, project) {
		project.followers.push(req.user._id);
		console.log(project.followers);
		project.save(function(err, projectSaved) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				// projectSaved.followProject = true;
				// projectSaved.activityType = 4;
				// projectSaved.userObj = req.user;
				// activityHandler.create(projectSaved);
				// console.log('about to respond in followProject');
				var obj = {
					hey: 'hey'
				};
				res.jsonp(obj);
			}
		});
	});

};

/**
 * Delete an Project
 */
exports.delete = function(req, res) {
	var project = req.project ;

	project.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(project);
		}
	});
};

/**
 * List of Projects
 */
exports.list = function(req, res) {
	Project.find().sort('-created').populate('user', 'displayName').exec(function(err, projects) {
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
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) { 
	Project.findById(id)
		.populate('user', 'displayName')
		.populate('user', 'username providerData.profile_image_url_https')
		.populate('notes.comments.user', 'username providerData.profile_image_url_https')
		.populate('notes.comments.comments.user', 'username providerData.profile_image_url_https')
		.populate('comments.user', 'username providerData.profile_image_url_https')
		.populate('comments.comments.user', 'username providerData.profile_image_url_https')
		.exec(function(err, project) {
			if (err) return next(err);
			if (! project) return next(new Error('Failed to load Project ' + id));
			req.project = project ;
			next();
		}
	);
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.project.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
