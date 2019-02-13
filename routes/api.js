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

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = {project_name: req.params.project};
    
    var obj = Object.assign(project, req.query);
    
    issue.find(obj,(err,data)=>{
    return (err ? err.stack : res.json(data));
    });
    
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
    
    var fieldsToSet = {};
    var reqFields = [{updated_on: new Date()}];
     
    // take only the fields that were input to update the DB; first, create an array of only fields containing user input
    
    for (let elem in req.body) {
    
      var obj = {[elem]: req.body[elem]}
      
      if (req.body[elem]) reqFields.push(obj);

    }
    
    // if (reqFields.length < 3) res.json(''); // optional prevent use case submit valid _id field alone, auto updates the 'updated on' value
    // convert the array back to an object so it can be used in the update call to the DB
    
  for(let i = 0; i < reqFields.length; i++){
    
   fieldsToSet = Object.assign(fieldsToSet, reqFields[i]);
    
  }
   //update the DB 
    issue.findOneAndUpdate({_id: req.body._id},{$set: fieldsToSet}, {new: true}, (err,data) => {
    
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
      
        if(data == undefined) return res.json('could not delete ' + req.body._id);
        return res.json('deleted ' + req.body._id);


    });
    
    });
    
};
