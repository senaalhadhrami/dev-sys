var ProfileModel = require('../models/ProfileModel.js');
const {MongoClient} = require('mongodb'); 
const { db } = require('../config.json'); 
var mongoose = require('mongoose');
const AuditModel = require('../models/AuditModel.js');


/**
 * ProfileController.js
 *
 * @description :: Server-side logic for managing Profiles.
 */

const uri =  db;   

module.exports = {

    /**
     * ProfileController.myprofile()
     */
    myprofile:async (req, res,  next) => {   
        const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
        var _userId = req.userData.userId; 
        var author = new mongoose.Types.ObjectId(_userId);
        var profile;
        await client.connect(); 
        const session = client.startSession();  
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };
 
        try {
            const transactionResults = await session.withTransaction(async () => {  
            const profilesCollection = client.db('auchandb').collection('profiles');
            
            profile = await profilesCollection.findOne({ _userId:author }, { session: session });  
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:'Profile Retrieved',
                profile:profile
                });
            }else{
                res.status(401).json({
                message:'Failed to Retrieve Profile'
                });
            }

            } finally {
            session.endSession();  
            await client.close();
           // next();
            }
    },

    /**
     * ProfileController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        ProfileModel.findOne({_id: id}, function (err, Profile) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Profile.',
                    error: err
                });
            }

            if (!Profile) {
                return res.status(404).json({
                    message: 'No such Profile'
                });
            }

            return res.json(Profile);
        });
    },

  /**
     * ProfileController.registerCourse()
     */
   registerCourse: async (req, res,next)=>{
    //ROLES - LOGIC
   /* if(req.userData.role !== 'teacher' && req.userData.role !== 'admin'){ 
       return  res.status(401).json({
            message:'Insufficient Permissions'
        });
    } 
    */ 
    var _userId =  req.userData.userId;   
    var author = new mongoose.Types.ObjectId(_userId); 
    var _courseId = new mongoose.Types.ObjectId(req.body.id);  
    var course;
    const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
    await client.connect();  
    const session = client.startSession();  
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    }; 
    try {
        const transactionResults = await session.withTransaction(async () => {  
        const profilesCollection = client.db('auchandb').collection('profiles'); 
        const examsCollection = client.db('auchandb').collection('exams'); 
        const coursesCollection = client.db('auchandb').collection('courses');
        const auditsCollection = client.db('auchandb').collection('audits');

        profile = await profilesCollection.findOne({ _userId:author }, { session: session });      
        course = await coursesCollection.findOne({ _id:_courseId }, { session: session });  
        
        if(course && course.active == true && course.students.length < course.seats){
         await profilesCollection.updateOne({_id:profile._id}, {$addToSet:{courses:String(_courseId)}}, { session: session });
         course.exams.forEach(async exam => {
            var cExam = new mongoose.Types.ObjectId(exam);
            await profilesCollection.updateOne({_id:profile._id}, {$addToSet:{exams:String(exam)}}, { session: session });
            await examsCollection.updateOne({_id:cExam}, {$addToSet:{students:String(author)}}, { session: session }); 
         });
         await coursesCollection.updateOne({_id:course._id}, {$addToSet:{students:String(_userId)}}, { session: session });
         await auditsCollection.insertOne(new AuditModel({
            action : 'COURSE_REGISTER',
            author : author,
            message : `A new Student was Added to the Course ${course.name}`,
            createdAt : Date.now(),
            _userId : course.author, 
        }), { session: session })
        }

 
        }, transactionOptions);
        if (transactionResults) {
            res.status(200).json({
            message:(course && course.active == true && course.students.length < course.seats)? 'Course Registerd Successfully':'Course Cannot be Registered', 
            });
        }else{
            res.status(401).json({
            message:'Failed to register Course'
            });
        }

        } finally {
        session.endSession();  
        await client.close();
        // next();
        } 
},

    /**
     * ProfileController.dropCourse()
     */
   dropCourse: async (req, res,next)=>{
    //ROLES - LOGIC
   /* if(req.userData.role !== 'teacher' && req.userData.role !== 'admin'){ 
       return  res.status(401).json({
            message:'Insufficient Permissions'
        });
    } 
    */  
    var _userId =  req.userData.userId;   
    var author = new mongoose.Types.ObjectId(_userId); 
    var _courseId = new mongoose.Types.ObjectId(req.body.id); 
    var course; 
    const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
    await client.connect();  
    const session = client.startSession();  
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
 
    try {
        const transactionResults = await session.withTransaction(async () => {  
        const profilesCollection = client.db('auchandb').collection('profiles');
        const examsCollection = client.db('auchandb').collection('exams'); 
        const coursesCollection = client.db('auchandb').collection('courses');
        const auditsCollection = client.db('auchandb').collection('audits');
            
        profile = await profilesCollection.findOne({ _userId:author }, { session: session });  
        course = await coursesCollection.findOne({ _id:_courseId }, { session: session });

        if(course){
            await profilesCollection.updateOne({_id:profile._id}, {$pull:{courses:String(_courseId)}}, { session: session });
            course.exams.forEach(async exam => {
                var cExam = new mongoose.Types.ObjectId(exam);
                await profilesCollection.updateOne({_id:profile._id}, {$pull:{exams:String(exam)}}, { session: session });
                await examsCollection.updateOne({_id:cExam}, {$pull:{students:String(author)}}, { session: session }); 
             });
            await coursesCollection.updateOne({_id:course._id}, {$pull:{students:String(author)}}, { session: session });
            await auditsCollection.insertOne(new AuditModel({
                action : 'COURSE_DROP',
                author : author,
                message : `A student withdrawn from Course ${course.name}`,
                createdAt : Date.now(),
                _userId : course.author, 
            }), { session: session })
        }
            
        }, transactionOptions);
        if (transactionResults) {
            res.status(200).json({
            message:(course)?'Course Dropped Successfully':'Couldnt drop course', 
            });
        }else{
            res.status(401).json({
            message:'Failed to drop Course'
            });
        }

        } finally {
        session.endSession();  
        await client.close();
        // next();
        } 
},


    /**
     * ProfileController.registerExam()
     */
   registerExam: async (req, res,next)=>{
    //ROLES - LOGIC
   /* if(req.userData.role !== 'teacher' && req.userData.role !== 'admin'){ 
       return  res.status(401).json({
            message:'Insufficient Permissions'
        });
    } 
    */ 
    var _userId =  req.userData.userId;  
    var _examId = req.body._examId; 
    const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
    await client.connect();  
    const session = client.startSession();  
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    }; 
    try {
        const transactionResults = await session.withTransaction(async () => {  
        const profilesCollection = client.db('auchandb').collection('profiles');
        // Important:: You must pass the session to the operations  
        
        await profilesCollection.updateOne({_userId:_userId}, {$addToSet:{exams:_examId}}, { session: session });
            
        }, transactionOptions);
        if (transactionResults) {
            res.status(200).json({
            message:'Exam Registerd Successfully', 
            });
        }else{
            res.status(401).json({
            message:'Failed to register Exam'
            });
        }

        } finally {
        session.endSession();  
        await client.close();
        // next();
        } 
},

    /**
     * ProfileController.dropExam()
     */
   dropExam: async (req, res,next)=>{
    //ROLES - LOGIC
   /* if(req.userData.role !== 'teacher' && req.userData.role !== 'admin'){ 
       return  res.status(401).json({
            message:'Insufficient Permissions'
        });
    } 
    */  
    var _userId = req.userData.userId;  
    var _examId = req.body._examId;
    console.log(`course ID from drop body:${_examId}`);
    const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
    await client.connect();  
    const session = client.startSession();  
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
 
    try {
        const transactionResults = await session.withTransaction(async () => {  
        const profilesCollection = client.db('auchandb').collection('profiles'); 
        
        await profilesCollection.updateOne({_userId:_userId}, {$pull:{exams:_examId}}, { session: session });
            
        }, transactionOptions);
        if (transactionResults) {
            res.status(200).json({
            message:'Exam Dropped Successfully', 
            });
        }else{
            res.status(401).json({
            message:'Failed to drop Exam'
            });
        }

        } finally {
        session.endSession();  
        await client.close();
        // next();
        } 
},

    /**
     * ProfileController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        ProfileModel.findOne({_id: id}, function (err, Profile) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Profile',
                    error: err
                });
            }

            if (!Profile) {
                return res.status(404).json({
                    message: 'No such Profile'
                });
            }

            Profile.name = req.body.name ? req.body.name : Profile.name;
			Profile.lastName = req.body.lastName ? req.body.lastName : Profile.lastName;
			Profile.email = req.body.email ? req.body.email : Profile.email;
			Profile.photoUrl = req.body.photoUrl ? req.body.photoUrl : Profile.photoUrl; 
			
            Profile.save(function (err, Profile) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Profile.',
                        error: err
                    });
                }

                return res.json(Profile);
            });
        });
    },

    /**
     * ProfileController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        ProfileModel.findByIdAndRemove(id, function (err, Profile) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Profile.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
