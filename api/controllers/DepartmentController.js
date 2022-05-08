var DepartmentModel = require('../models/DepartmentModel.js');
var CourseModel = require('../models/CourseModel.js'); 
const {MongoClient} = require('mongodb'); 
const { db } = require('../config.json');  
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

/**
 * DepartmentController.js
 *
 * @description :: Server-side logic for managing Departments.
 */

const uri =  db;   
module.exports = {

    /**
     * DepartmentController.list()
     */
     list: async (req, res, next) => {   
        const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
        var departments;
        await client.connect();
        
        const session = client.startSession(); 
        
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };


        try {
            const transactionResults = await session.withTransaction(async () => { 
            const departmentsCollection = client.db('auchandb').collection('departments');

             
            const cursor = departmentsCollection
                            .find({}, { session })
                            .sort({ title: -1 })
                            .limit(200);

            
            departments = await cursor.toArray(); 
                
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:'Departments Retrieved',
                departments:departments
                });
            }else{
                res.status(401).json({
                message:'Failed to Retrieve Departments'
                });
            }

            } finally {
            session.endSession(); 
            
            await client.close();
           // next();
            }
    },

    /**
     * DepartmentController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        DepartmentModel.findOne({_id: id}, function (err, Department) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Department.',
                    error: err
                });
            }

            if (!Department) {
                return res.status(404).json({
                    message: 'No such Department'
                });
            }

            return res.json(Department);
        });
    },

    /**
     * DepartmentController.create()
     */
    create: function (req, res) {
        var Department = new DepartmentModel({
			name : req.body.name,
			description : req.body.description,
			courses : req.body.courses,
			_userId : req.body._userId
        });

        Department.save(function (err, Department) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Department',
                    error: err
                });
            }

            return res.status(201).json(Department);
        });
    },

    /**
     * DepartmentController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        DepartmentModel.findOne({_id: id}, function (err, Department) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Department',
                    error: err
                });
            }

            if (!Department) {
                return res.status(404).json({
                    message: 'No such Department'
                });
            }

            Department.name = req.body.name ? req.body.name : Department.name;
			Department.description = req.body.description ? req.body.description : Department.description; 
			
            Department.save(function (err, Department) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Department.',
                        error: err
                    });
                }

                return res.json(Department);
            });
        });
    },

    /**
     * DepartmentController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        DepartmentModel.findByIdAndRemove(id, function (err, Department) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Department.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
