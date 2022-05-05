var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CourseSchema = new Schema({
	'code' : String,
	'credits' : Number, 
	'name' : String,
	'seats' : Number, 
	'author' : {
		type: Schema.Types.ObjectId,
		ref: 'User'
    },
	'teacher': String,
	'students' : [{
		type: Schema.Types.ObjectId,
		ref: 'User'
   		}],
	'exams' : [{
		type: Schema.Types.ObjectId,
		ref: 'Exam'
			}],
	'department' : String,
	'begins':String,
	'active':Boolean
});

module.exports = mongoose.model('Course', CourseSchema);
