var CourseModel = require('../models/CourseModel.js'); 
var AuditModel = require('../models/AuditModel.js'); 
const {MongoClient} = require('mongodb'); 
const { db } = require('../config.json');  
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;



/**
 * CourseController.js
 *
 * @description :: Server-side logic for managing Courses.
 */

const uri =  db;   

module.exports = {

    // .find({_id:{$in:[mongoose.Types.ObjectId("60608161b1c86354742a585a")]}}, { session })
    mylist:async (req, res, next) => {   
        const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
        var _userId = req.userData.userId; 
        var author = new mongoose.Types.ObjectId(_userId);   
        var courses=[], profile;
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
            const profilesCollection = client.db('auchandb').collection('profiles');
            
            profile = await profilesCollection.findOne({ _userId:author }, { session: session });  
             profile.courses.forEach(courseId => {
                courseId = new mongoose.Types.ObjectId(courseId);
                courses.push(courseId);
            }); 
            const cursor = coursesCollection
                            .find({_id:{$in:courses}}, { session })
                            .sort({ title: -1 })
                            .limit(100);
            
            
            courses = await cursor.toArray();  
                
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:'Courses Retrieved',
                courses:courses
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
     * CourseController.list()
     */
    list: async (req, res, next) => {   
        const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
        var courses;
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

             
            const cursor = coursesCollection
                            .find({active:true}, { session }) // get all active courses-
                            .sort({ title: -1 })
                            .limit(200);

            
            courses = await cursor.toArray();  
            courses = courses.map(course => {
                if (course.students.length < course.seats)
                  return course
            })
                    
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:'Courses Retrieved',
                courses:courses
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
     * CourseController.list()
     */
     adminlist: async (req, res, next) => {   
        const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
        var courses;
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

             
            const cursor = coursesCollection
                            .find({active:false}, { session }) // get all active courses-
                            .sort({ title: -1 })
                            .limit(200);

            
            courses = await cursor.toArray(); 
                
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:'Courses Retrieved',
                courses:courses
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
     * CourseController.show()
     */
    show: async (req, res,  next) => {  
        var id = new mongoose.Types.ObjectId(req.params.id); 
        const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
        var course;
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
                 
             
           // course = await coursesCollection.findOne({ _id: new ObjectId("605b31f30f5b0ed441b908bc") }, { session: session }); 
            course = await coursesCollection.findOne({ _id:id }, { session: session }); 
                 
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:'Course Found',
                course:{id:id,  ...course} //adding id to use in frontend rather than _id
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
     * CourseController.searchByTitle()
     */
      searchByTitle: async (req, res, next) => {   
        const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
        var courses;
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
             
            const cursor =  coursesCollection
                            .find({name:{$regex: ".*" + req.body.name + ".*"}}, { session })
                            //.find({name:{$regex:/.*req.body.name.*/i} }, { session }) //{name:/.*data.*/i}
                            .sort({ name: -1 })
                            .limit(200);

            
            courses = await cursor.toArray(); 
                
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:'Courses Retrieved',
                courses:courses
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
     * CourseController.create()
     */
    create: async (req, res,next)=>{
        //ROLES - LOGIC
       /* if(req.userData.role !== 'teacher' && req.userData.role !== 'admin'){ 
           return  res.status(401).json({
                message:'Insufficient Permissions'
            });
        } 
        */ 
        var _userId = req.userData.userId; 
        var author = new mongoose.Types.ObjectId(_userId);   
        
        var createdCourseId='' ;
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
            const profilesCollection = client.db('auchandb').collection('profiles');
            
            profile = await profilesCollection.findOne({ _userId:author }, { session: session });  
            var Course = {
                code : req.body.code,
                credits : req.body.credits,
                name : req.body.name,
                seats : req.body.seats,
                author : author, 
                teacher: profile.lastName + ", " + profile.name,
                students:[],
                exams:[],
                department: req.body.department,
                begins:req.body.begins,
                active:false
            };
            

           // course = await coursesCollection.findOne({ _id: new ObjectId("605b31f30f5b0ed441b908bc") }, { session: session }); 
            await coursesCollection.insertOne(Course, { session: session }).then(data=>{
                createdCourseId = data.insertedId;
            })  
            
            await profilesCollection.updateOne({_id:profile._id}, {$addToSet:{courses:String(createdCourseId)}}, { session: session });
                
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:'Course Created Successfully', 
                });
            }else{
                res.status(401).json({
                message:'Failed to add Course'
                });
            }

            } finally {
            session.endSession(); 
            
            await client.close();
            // next();
            } 
    },

    /**
     * CourseController.update()
     */
    update: async (req, res, next)=> {  
        var _userId = req.userData.userId; 
        var _role = req.userData.role; 
        var course;
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
           
            course = await coursesCollection.findOne({ _id:id }, { session: session });
             
            if (((course.author).toString() === author.toString()) || ( _role == "admin")) // only update for admin and author
            await coursesCollection.updateOne({ _id:id },{$set:{    code : req.body.code,
                                                                    credits : req.body.credits,
                                                                    name : req.body.name,
                                                                    seats : req.body.seats, 
                                                                    department: req.body.department,
                                                                    begins:req.body.begins }}, 
                                                                    { session: session }); 
            
            if (_role == 'admin')
            await coursesCollection.updateOne({ _id:id },{$set:{    active: req.body.active }}, 
                                                                    { session: session });                                                        
       
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:(((course.author).toString() === author.toString()) || ( _role == "admin")) ? 'Update Successful': 'Permission denied', 
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
     * CourseController.approve()
     */
      approve: async (req, res, next)=> {  
        var _userId = req.userData.userId; 
        var _role = req.userData.role; 
        var course; 
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
           
            course = await coursesCollection.findOne({ _id:id }, { session: session });
             
            if (_role == "admin") // only approve for admin  
            await coursesCollection.updateOne({ _id:id },{$set:{    active:true }}, 
                                                                    { session: session });                                                         
       
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:( _role == "admin")? 'Update Successful': 'Permission denied', 
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
     * CourseController.remove()  
     */
    remove: async (req, res, next) => {
        var _userId = req.userData.userId; 
        var _role = req.userData.role; 
        var course;
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
            
            course = await coursesCollection.findOne({ _id:id }, { session: session });
            //(Active Courses Cannot Be Deleted) 
            if ((((course.author).toString() === author.toString()) || ( _role == "admin"))  && (course.active == false)) // only delete for admin and author
            await coursesCollection.deleteOne({ _id:id },  { session: session }); 
       
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message: ((((course.author).toString() === author.toString()) || ( _role == "admin"))  && (course.active == false)) ? 'Deletion Successful':'Insufficient permissions', 
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
