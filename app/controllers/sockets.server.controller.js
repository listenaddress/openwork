'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Socket = mongoose.model('Socket'),
	_ = require('lodash');


/**
 * Find sockets older than 30 minutes and delete them.
 */

exports.removeOldSockets = function(req, res, next) {
	var d = new Date();
	d.setMinutes(d.getMinutes() - 30);
	Socket.find({ created: { $lt: d }}).exec(function(err, theseSockets) {
		theseSockets.forEach(function(callback, thisArg) {
			theseSockets[thisArg].remove(function(err) {
				if (err) {
					console.log(err);
				}
			});
		});
	});

	next();
};

/**
 * Save a socket. If the user's onlineStatus is '1', next() to findOnline.
 */
exports.createSocket = function(req, res, next) {
	var socket = new Socket(req);
	socket.socketID = req.body.socketID;
	socket.user = req.user;
	socket.created = new Date();
	socket.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else if (req.user) {
			console.log(socket);
			res.jsonp(socket);
			if (req.user.onlineStatus === '1') {
				next();
			}
		} 
	});
};