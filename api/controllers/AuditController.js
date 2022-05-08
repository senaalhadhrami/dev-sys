var AuditModel = require('../models/AuditModel.js');
const {MongoClient} = require('mongodb'); 
const { db } = require('../config.json');  
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


/**
 * AuditController.js
 *
 * @description :: Server-side logic for managing Audits.
 */
  
const uri =  db;   

module.exports = {

    list:async (req, res, next) => {   
        const client = new  MongoClient(uri, {useNewUrlParser:true, useUnifiedTopology:true});
        var _userId = req.userData.userId; 
        var author = new mongoose.Types.ObjectId(_userId);   
        var audits=[];

        await client.connect();
        
        const session = client.startSession(); 
        
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };
        
        try {
            const transactionResults = await session.withTransaction(async () => { 
            const auditsCollection = client.db('auchandb').collection('audits');
          
            const cursor = auditsCollection
                            .find({_userId:author}, { session })
                            .sort({ createdAt: -1 })
                            .limit(10);
            
            audits = await cursor.toArray();   
            }, transactionOptions);
            if (transactionResults) {
                res.status(200).json({
                message:'Audits Retrieved',
                audits:audits
                });
            }else{
                res.status(401).json({
                message:'Failed to Retrieve Audits'
                });
            }

            } finally {
            session.endSession(); 
            
            await client.close();
           // next();
            }
    },

    /**
     * AuditController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        AuditModel.findOne({_id: id}, function (err, Audit) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Audit.',
                    error: err
                });
            }

            if (!Audit) {
                return res.status(404).json({
                    message: 'No such Audit'
                });
            }

            return res.json(Audit);
        });
    },

    /**
     * AuditController.create()
     */
    create: function (req, res) {
        var Audit = new AuditModel({
			action : req.body.action,
			author : req.body.author,
			message : req.body.message,
			createdAt : req.body.createdAt,
			_userId : req.body._userId
        });

        Audit.save(function (err, Audit) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Audit',
                    error: err
                });
            }

            return res.status(201).json(Audit);
        });
    },

    /**
     * AuditController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        AuditModel.findOne({_id: id}, function (err, Audit) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Audit',
                    error: err
                });
            }

            if (!Audit) {
                return res.status(404).json({
                    message: 'No such Audit'
                });
            }

            Audit.action = req.body.action ? req.body.action : Audit.action;
			Audit.author = req.body.author ? req.body.author : Audit.author;
			Audit.message = req.body.message ? req.body.message : Audit.message;
			Audit.createdAt = req.body.createdAt ? req.body.createdAt : Audit.createdAt;
			Audit._userId = req.body._userId ? req.body._userId : Audit._userId;
			
            Audit.save(function (err, Audit) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Audit.',
                        error: err
                    });
                }

                return res.json(Audit);
            });
        });
    },

    /**
     * AuditController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        AuditModel.findByIdAndRemove(id, function (err, Audit) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Audit.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
