var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var DepartmentSchema = new Schema({
	'name' : String,
	'description' : String 
});

module.exports = mongoose.model('Department', DepartmentSchema);
