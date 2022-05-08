const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {MongoClient} = require('mongodb');
var UserModel = require('../models/UserModel.js');
var ProfileModel = require('../models/ProfileModel.js');
const { secret,db } = require('../config.json');
var helpers = require('../helpers');
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


/**
 * UserController.js
 *
 * @description :: Server-side logic for managing Users.
 */
const uri =  db;    

module.exports = {
    signup: async (req, res, next) =>{
            const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
            var user;
            await client.connect(); 
            const session = client.startSession();
 
            const transactionOptions = {
              readPreference: 'primary',
              readConcern: { level: 'local' },
              writeConcern: { w: 'majority' }
            };
 
            try {
              const hash = await bcrypt.hash(req.body.password, 10); 
              const transactionResults = await session.withTransaction(async () => {
                const users = client.db('auchandb').collection('users');
                const profiles = client.db('auchandb').collection('profiles');
 
                
              // check if email registerd before
              user = await users.findOne({ email: req.body.email}, { session });
              if(!user){
                  var newUser = new UserModel ({
                    email:req.body.email,
                    password:hash,
                    role: 'student', // by default all registered as students
                    active:"no"   // by default all active can be altered later
                  })
                  
                  var createduserId; 
                  user = await users.insertOne(newUser, { session }).then(data=>{
                    createduserId = data.insertedId;
                  });   
                  var author = new mongoose.Types.ObjectId(createduserId);   
                  var Profile = new ProfileModel({
                    name :req.body.name,
                    lastName : req.body.lastName,
                    courses :[],
                    exams :[],
                    email : req.body.email,
                    photoUrl : req.body.photoUrl,
                    _userId : author
                      });
                    
              
                await profiles.insertOne(Profile, { session }); 
              }

                

              }, transactionOptions);
              if (transactionResults) {
                res.status(200).json({
                  message:user? 'Email already exists': 'Registered Successfully',
                  results:transactionResults.email
                 });
              }else{
                res.status(401).json({
                  message:'Failed to Register'
                 });
              }

            } finally {
              session.endSession(); 
              // Close the connection to the MongoDB cluster
              await client.close();
                
            }
    },
    
   
   
    /**
     * UserController.login()
     */
    login: async (req, res,next) =>{
      var user={};
      var profile={};
      var passwordIsValid;
      const client = new MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
      await client.connect(); 
      const session = client.startSession(); 
      const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
      };
 
      try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const transactionResults = await session.withTransaction(async () => {
          const users = client.db('auchandb').collection('users');
          const profiles = client.db('auchandb').collection('profiles');

           user = await users.findOne({ email: req.body.email}, { session });
           profile = await profiles.findOne({ email: req.body.email}, { session });  

         
          passwordIsValid =  user && bcrypt.compareSync(
            req.body.password,
            user.password
          );

        }, transactionOptions);

        if (transactionResults && passwordIsValid) { 
          const token = jwt.sign(
            { email: user.email, userId: user._id, role: user.role, active: user.active},
            secret,
            { expiresIn: "1h" })

          res.status(200).json({
            token: token, 
            role:user.role,
            active:user.active,
            email:user.email,
            userId: user._id,
            expiresIn: 3600, // duration in seconds 
            });
        }else{
          res.status(200).json({
            message:'Failed to Login'
            });
        }

      } finally {
        session.endSession(); 
        await client.close(); 
        //next();
      }

    },
  
   /**
     * UserController.approve()
     */
    approve: async (req, res, next)=> {  
      var _userId = req.userData.userId; 
      var _role = req.userData.role; 
      var user; 
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
          const usersCollection = client.db('auchandb').collection('users');
         
          user = await usersCollection.findOne({ _id:id }, { session: session });
           
          if (_role == "admin") // only approve for admin  
          await usersCollection.updateOne({ _id:id },{$set:{    active:'yes' }}, 
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
     * UserController.list()
     */
    list: async (req, res, next) => {   
      const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
      var users;
      await client.connect();
      
      const session = client.startSession(); 
      
      const transactionOptions = {
          readPreference: 'primary',
          readConcern: { level: 'local' },
          writeConcern: { w: 'majority' }
      };

      
      try {
          const transactionResults = await session.withTransaction(async () => { 
          const usersCollection = client.db('auchandb').collection('users');

           
          const cursor = usersCollection
                          .find({active:"no"}, { session }) // get all active users-
                          .sort({ title: -1 })
                          .limit(200);

          
          users = await cursor.toArray(); 
          users = users.map(user => {
            return {_id:user._id, email:user.email, role:user.role}
          })
              
          }, transactionOptions);
          if (transactionResults) {
              res.status(200).json({
              message:'users Retrieved',
              users:users
              });
          }else{
              res.status(401).json({
              message:'Failed to Retrieve users'
              });
          }

          } finally {
          session.endSession(); 
          
          await client.close();
         // next();
          }
  },
};
