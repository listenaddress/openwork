'use strict';

module.exports = function(app) {
	var activities = require('../../app/controllers/activities.server.controller');

	// Projects Routes
	app.route('/activities')
		.get(activities.list);

};