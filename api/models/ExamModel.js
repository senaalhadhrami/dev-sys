var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ExamSchema = new Schema({ 
	'description' : String,
	'seats' : String, 
	'students' : [{
		type: Schema.Types.ObjectId,
		ref: 'User'
   		}],
	'author' : {
		type: Schema.Types.ObjectId,
		ref: 'User'
    },
	'course' : String,
	'courseId':String,
	'begins' : Date,
	'duration':String
});

module.exports = mongoose.model('Exam', ExamSchema);
