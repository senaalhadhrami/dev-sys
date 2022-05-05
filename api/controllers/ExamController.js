var ExamModel = require('../models/ExamModel.js');
const {MongoClient} = require('mongodb'); 
const { db } = require('../config.json');  
var mongoose = require('mongoose');
const AuditModel = require('../models/AuditModel.js');


/**
 * ExamController.js
 *
 * @description :: Server-side logic for managing Exams.
 */

const uri =  db;   
module.exports = {
    myexams:async (req, res, next) => {   
        const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
        var _userId = req.userData.userId; 
        var author = new mongoose.Types.ObjectId(_userId); 
        var courses=[];
        var exams=[], profile; 
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
            const coursesCollection = client.db('auchandb').collection('courses');
            const examsCollection = client.db('auchandb').collection('exams');

           
            profile = await profilesCollection.findOne({ _userId:author }, { session: session });  
                
            if(profile)  { 
                myExamsIds = []
                profile.exams.forEach(examId => {
                    ex = new mongoose.Types.ObjectId(examId);
                    myExamsIds.push(ex);
                })
                
                const cursor = examsCollection
                    .find({_id:{$in:myExamsIds}}, { session })
                    .sort({ title: -1 })
                    .limit(100);  
                exams = await cursor.toArray();  
            }

            }, transactionOptions);

            if (transactionResults) {
                res.status(200).json({
                message:'Courses Retrieved',
                exams:exams
                });
            }else{
                res.status(401).json({
                message:'Failed to Retrieve Courses'
                });
            }

            } finally {
            session.endSession(); 
            
            await client.close();
           // next();
            } 


    },

     /**
     * Examontroller.show()
     */
      show: async (req, res,  next) => {  
        var id = new mongoose.Types.ObjectId(req.params.id); 
        const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
        var exam;
        await client.connect(); 
        
        const session = client.startSession(); 
        
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };

        
        try {
            const transactionResults = await session.withTransaction(async () => { 
            const examsCollection = client.db('auchandb').collection('exams');
                 
             
           // exam = await examsCollection.findOne({ _id: new ObjectId("605b31f30f5b0ed441b908bc") }, { session: session }); 
            exam = await examsCollection.findOne({ _id:id }, { session: session }); 
                 
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:'Course Found',
                exam:{id:id,  ...exam} //adding id to use in frontend rather than _id
                });
            }else{
                res.status(401).json({
                message:'Course not found'
                });
            }

            } finally {
            session.endSession(); 
            
            await client.close();
            // next();
            }
    },

    /**
     * ExamController.getCourseExams()
     */
     getCourseExams: async (req, res,  next) => {  
        var id = req.params.id; 
        var _userId = req.userData.userId; 
        var author = new mongoose.Types.ObjectId(_userId); 
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
            const examsCollection = client.db('auchandb').collection('exams');
            const profilesCollection = client.db('auchandb').collection('profiles');
            profile = await profilesCollection.findOne({ _userId:author }, { session: session });  
 
           // exam = await examsCollection.findOne({ _id: new ObjectId("605b31f30f5b0ed441b908bc") }, { session: session });  
            const cursor = examsCollection
            .find({_courseId:id}, { session })
            .sort({ title: -1 })
            .limit(100);
            
            exams = await cursor.toArray(); 

            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:'Exams Found',
                exams:exams,
                myexams:profile.exams
                });
            }else{
                res.status(401).json({
                message:'Exams not found'
                });
            }

            } finally {
            session.endSession(); 
            
            await client.close();
            // next();
            }
    },

    /**
     * ExamController.create()
     */
    create: async (req, res,  next) =>  { 
        var _userId = req.userData.userId; 
        var author = new mongoose.Types.ObjectId(_userId);   
        var students=[];
        var profile;
 
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
            const examsCollection = client.db('auchandb').collection('exams');
            const coursesCollection = client.db('auchandb').collection('courses');
            const profilesCollection = client.db('auchandb').collection('profiles');
            const auditsCollection = client.db('auchandb').collection('audits');
             
            var courseId = new mongoose.Types.ObjectId(req.body.course); 

            course = await coursesCollection.findOne({ _id: courseId}, { session: session }); 
            profile = await profilesCollection.findOne({ _userId:author }, { session: session });  
            exam = await examsCollection.findOne({ _userId:author }, { session: session });  

            var Exam = new ExamModel({
                description : req.body.description,
                seats : req.body.seats,
                students:[],
                author : author,
                course : course.name,
                courseId: course._id,
                begins : req.body.begins,
                duration:req.body.duration
            });


            students = course.students;
            // check if exam course belong to author
            if((course.author).toString() === author.toString()){
                await examsCollection.insertOne(Exam, { session: session }).then(data=>{
                    createdExamId = data.insertedId;
                })  
                students.forEach( async student => {
                    var cStudent = new mongoose.Types.ObjectId(student);
                    await profilesCollection.updateOne({_userId:cStudent}, {$addToSet:{exams:String(createdExamId)}}, { session: session }); 
                    await examsCollection.updateOne({_id:createdExamId}, {$addToSet:{students:String(student)}}, { session: session }); 
                    await auditsCollection.insertOne(new AuditModel({
                        action : 'EXAM_CREATE',
                        author : author,
                        message : `A new Exam is Added to the Course ${course.name}`,
                        createdAt : Date.now(),
                        _userId : cStudent, 
                    }), { session: session })
                })
                await profilesCollection.updateOne({_id:profile._id}, {$addToSet:{exams:String(createdExamId)}}, { session: session }); 
                await coursesCollection.updateOne({_id:course._id}, {$addToSet:{exams:String(createdExamId)}}, { session: session }); 
            }
           
                
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:'Exam Created Successfully', 
                });
            }else{
                res.status(401).json({
                message:'Failed to add Exam'
                }); }

            } finally {
            session.endSession(); 
            
            await client.close();
            // next();
            } 
    },

   /**
     * ExamController.update()
     */
    update: async (req, res, next)=> { 
        var _userId = req.userData.userId; 
        var _role = req.userData.role; 
        var course;
        var exam; 
        var author = new mongoose.Types.ObjectId(_userId); 
        var id = new mongoose.Types.ObjectId(req.params.id);

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
            const coursesCollection = client.db('auchandb').collection('courses');
            const examsCollection = client.db('auchandb').collection('exams');
            exam =  await examsCollection.findOne({ _id:id }, { session: session });
            var courseId = new mongoose.Types.ObjectId(exam.courseId); 
            course = await coursesCollection.findOne({ _id: courseId }, { session: session });
            if (((course.author).toString() === author.toString()) || ( _role == "admin")) 
                await examsCollection.updateOne({ _id:id },{$set:{     
                                                                description : req.body.description,
                                                                seats : req.body.seats,  
                                                                begins : req.body.begins,
                                                                duration:req.body.duration
                                                                }}, 
                                             { session: session }); 
       
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message: (((course.author).toString() === author.toString()) || ( _role == "admin")) ?'Update Successful':'Permission Denied', 
                });
            }else{
                res.status(401).json({
                message:'Update Failed'
                });
            }

            } finally {
            session.endSession(); 
            
            await client.close();
            // next();
            } 
         
    },

   
    /**
     * ExamController.remove()
     */
     remove: async (req, res, next) => {
        var _userId = req.userData.userId; 
        var _role = req.userData.role; 
        var course;
        var exam;
        var students = [];
        var author = new mongoose.Types.ObjectId(_userId);
        var id = new mongoose.Types.ObjectId(req.params.id);
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
            const coursesCollection = client.db('auchandb').collection('courses');
            const examsCollection = client.db('auchandb').collection('exams');
            const profilesCollection = client.db('auchandb').collection('profiles');
            const auditsCollection = client.db('auchandb').collection('audits');

            exam =  await examsCollection.findOne({ _id:id }, { session: session });
            var courseId = new mongoose.Types.ObjectId(exam.courseId); 
            course = await coursesCollection.findOne({ _id:courseId }, { session: session });
            profile = await profilesCollection.findOne({ _userId:author }, { session: session });  
            students = course.students;
            if (((course.author).toString() === author.toString()) || ( _role == "admin")) // only delete for admin and author
                 {
                     await examsCollection.deleteOne({ _id:id },  { session: session }); 
                     students.forEach( async student => {
                        var cStudent = new mongoose.Types.ObjectId(student);
                        await profilesCollection.updateOne({_userId:cStudent}, {$pull:{exams:String(id)}}, { session: session }); 
                        await examsCollection.updateOne({_id:exam._id}, {$pull:{students:String(cStudent)}}, { session: session }); 
                        await auditsCollection.insertOne(new AuditModel({
                            action : 'EXAM_DELETE',
                            author : author,
                            message : `Exam ${exam.description} was Deleted for the Course ${course.name}`,
                            createdAt : Date.now(),
                            _userId : cStudent, 
                        }), { session: session })
                    })
                    await profilesCollection.updateOne({_id:profile._id}, {$pull:{exams:String(id)}}, { session: session });  
                    await coursesCollection.updateOne({_id:course._id}, {$pull:{exams:String(id)}}, { session: session });   
                 }

       
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message: (((course.author).toString() === author.toString()) || ( _role == "admin")) ? 'Deletion Successful':'Insufficient permissions', 
                });
            }else{
                res.status(401).json({
                message:'Deletion Failed'
                });
            }

            } finally {
            session.endSession(); 
            
            await client.close();
            // next();
            } 
    }
};
