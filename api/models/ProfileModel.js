var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ProfileSchema = new Schema({
	'name' : String,
	'lastName' : String,
	'courses' : [{
		type: Schema.Types.ObjectId,
		ref: 'Course'
   		}],
	'exams' : [{
		type: Schema.Types.ObjectId,
		ref: 'Exam'
		}],
	'email' : String,
	'photoUrl' : String,
	'_userId' : {
		type: Schema.Types.ObjectId,
		ref: 'User'
   }
});

module.exports = mongoose.model('Profile', ProfileSchema);
