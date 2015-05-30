'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Socket Schema
 */
var SocketSchema = new Schema({
	socketID: {
		type: String
	},
	name: {
		type: String,
		default: 'default',
		trim: true
	},
	extraSockets: {
		type: Number,
		default: 0
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Socket', SocketSchema);