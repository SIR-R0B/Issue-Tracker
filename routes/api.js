/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var Handler = require('../controllers/handler.js');

const CONNECTION_STRING = process.env.DB; 

mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true });


var Schema = mongoose.Schema;

var issueModel = new Schema({
project_name: {type: String, required: true},
issue_title: {type: String, required: true},
issue_text: {type: String, required: true},
created_on: Date,
updated_on: { type: Date, default: Date.now },
created_by: String,
assigned_to: String,
open: {type: Boolean, required: true, default: true},
status_text: String
});

var issue = mongoose.model('issue', issueModel);


module.exports = function (app) {
  
  var issueHandler = new Handler();

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
    issue.find({project_name: project},(err,data)=>{
    return (err ? err.stack : res.json(data));
    })
    
    })
    
    .post(function (req, res){
      var project = req.params.project;
        if ((!req.body.issue_title)&&(!req.body.issue_text)&&(!req.body.created_by)) res.json('Required data missing');
      var issueTitle = req.body.issue_title;
      var issueText = req.body.issue_text;
      var createdOn = new Date();
      var createdBy = req.body.created_by;
      var assignedTo = req.body.assigned_to;
      var statusText = req.body.status_text;
      
    var addIssue = new issue({
    project_name: project,
    issue_title: issueTitle,
    issue_text: issueText,
    created_on: createdOn,
    created_by: createdBy,
    assigned_to: assignedTo,
    status_text: statusText
    });
    
    addIssue.save((err,data) => {
    return (err ? err.stack : res.json([data]));
    })
    
    
    })
    
    .put(function (req, res){
    
    //if ((!req.body._id)&&(!req.body.issue_title)&&(!req.body.issue_text)&&(!req.body.created_by)&&(!req.body.assigned_to)&&(!req.body.status_text)&&(!req.body.open)) res.json('Error: No body');
      
      var _id            = req.body._id;
      var setIssueTitle  = req.body.issue_title;
      var setIssueText   = req.body.issue_text;
      var setCreatedBy   = req.body.created_by;
      var setAssignedTo  = req.body.assigned_to;
      var setStatusText  = req.body.status_text;
      var setOpenBool    = req.body.open;
    
    var obj = {
      issue_title: setIssueTitle,
      issue_text: setIssueText,
      created_by: setCreatedBy,
      assigned_to: setAssignedTo,
      status_text: setStatusText,
      open: setOpenBool, //undefined or false if checked
      updated_on: new Date()
    };
    
    issue.findOneAndUpdate({_id: req.body._id},{$set: obj}, {new: true}, (err,data) => {
    
      if(err){ 
        console.log(err.stack);
        return res.json('no updated field sent');
      } 
      else{
        if(data == undefined) return res.json('could not update ' + req.body._id);
        return res.json('successfully updated');
      }
      
    
    });
    
  
    })
    
    .delete(function (req, res){
    issue.findOneAndDelete({_id: req.body._id},(err,data)=>{
    
      
      if(err){ 
        console.log(err.stack);
        return res.json('_id error');
      } 
      else{
        if(data == undefined) return res.json('could not delete ' + req.body._id);
        return res.json('deleted ' + req.body._id);
      }

    });
    
    });
    
};
