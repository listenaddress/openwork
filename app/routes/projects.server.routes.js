'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projects = require('../../app/controllers/projects.server.controller');

	// Projects Routes
	app.route('/projects')
		.get(projects.list)
		.post(users.requiresLogin, projects.create);

	app.route('/projects/:projectId')
		.get(projects.read)
		.put(users.requiresLogin, projects.update, projects.createProjectComment, projects.createNote, projects.createNoteComment, projects.followProject)
		.delete(users.requiresLogin, projects.hasAuthorization, projects.delete);

	// Finish by binding the Project middleware
	app.param('projectId', projects.projectByID);
};
