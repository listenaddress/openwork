'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var NestedCommentSchema = new Schema({
	text: {
		type: String,
		default: '',
		trim: true
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

var CommentSchema = new Schema({
	text: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	comments: [NestedCommentSchema]
});

/**
 * Notes Schema
 */

var NoteSchema = new Schema({
	title: {
		type: String,
		required: 'Please fill Project name',
		trim: true
	},
	content: {
		type: String
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	comments: [CommentSchema],
	created: {
		type: Date,
		default: Date.now
	}
});

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Project name',
		trim: true
	},
	description: {
		type: String,
		required: 'Please fill Project description'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	notes: [NoteSchema],
	comments: [CommentSchema]
});

mongoose.model('Project', ProjectSchema);