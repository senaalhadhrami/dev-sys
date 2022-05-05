var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var AuditSchema = new Schema({
	'action' : String,
	'author' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'User'
	},
	'message' : String,
	'createdAt' : Date,
	'_userId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'User'
	}
});

module.exports = mongoose.model('Audit', AuditSchema);
