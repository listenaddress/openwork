'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	var sockets = require('../../app/controllers/sockets.server.controller');

	app.route('/').get(core.index);

	app.route('/sockets')
		// .delete(sockets.find, sockets.deleteTwo)
		.post(sockets.removeOldSockets, sockets.createSocket);
};