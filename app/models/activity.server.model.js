var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ActivitySchema = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	activityType: {
		type: Number
	},
	activityString: {
		type: String
	},
	projectId: {
		type: Schema.ObjectId,
		ref: 'Project'
	},
	noteId: {
		type: String
	},
	commentId: {
		type: String
	},
	nestedCommentId: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Activity', ActivitySchema);