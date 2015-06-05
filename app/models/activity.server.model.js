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
	}
});

mongoose.model('Activity', ActivitySchema);