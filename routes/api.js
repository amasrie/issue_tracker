/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

let expect = require('chai').expect;
let ObjectId = require('mongodb').ObjectID;
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const CONNECTION_STRING = process.env.DB; 

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = function (app) {
	//create mongo connection
	mongoose.connect(process.env.DB,
	  { useNewUrlParser: true, useUnifiedTopology: true }
	);

	//create a model for projects 
	let projectSchema = new Schema({
		_id: {
			type: ObjectId,
			auto: true
		},
		name: {
			type: String,
			required: true,
			unique: true
		}		
	});

	let Project = mongoose.model("Project_tracker", projectSchema);

	//create an issue model
	let issueSchema = new Schema({
		_id: {
			type: ObjectId,
			auto: true
		},
		issue_title: {
			type: String,
			required: true
		},
		issue_text: {
			type: String,
			required: true
		},
		created_by: {
			type: String,
			required: true
		},
		assigned_to: String,
		status_text: String,
		created_on: {
			type: Date,
			required: true,
			default: Date.now
		},
		updated_on: {
			type: Date,
			required: true,
			default: Date.now
		},
		open: {
			type: Boolean,
			required: true
		},
		project: {
			type: ObjectId, 
			ref: 'Project_tracker'
		}
	});

	let Issue = mongoose.model("Issue_tracker", issueSchema);

	//method that checks if a project exists. Returns the project Id or null
	let projectExists = (name, cb) => {
		Project.find({name: name}, (err, matches) => {
			return err || !matches[0] ? cb(null) : cb(matches[0]._id);
		});
	}

	//method that creates a new issue
	let createIssue = (req, res, projectId) => {
		if(req.body.issue_title && req.body.issue_text && req.body.created_by){
			let newIssue = new Issue({
				issue_title: req.body.issue_title,
				issue_text: req.body.issue_text,
				created_by: req.body.created_by,
				assigned_to: req.body.assigned_to,
				status_text: req.body.status_text,
				open: true,
				project: projectId
			});
			newIssue.save(err => {
				if(err){
					res.status(500).send("An error occured while trying to create a new issue");
				}else{
					res.send(newIssue);
				}
			});
		}else{
			res.status(400).send("Missing required data inputs");
		}
	}

	app.route('/api/issues/:project')
		.get((req, res) => {
			let project = req.params.project;
			projectExists(project, projectId => {
				let json = {
					project: projectId
				};
				for(let i in req.query){
					json[i] = req.query[i];
				}
				Issue.find(json, (err, matches) => {
					if(err){
						res.status(500).send("Server error");
					}else{
						res.send(matches);
					}
				})

			});
		})

		.post((req, res) => {
			let project = req.params.project;
			//if the project doesn't exists, create it before the issue
			projectExists(project, projectId => {
				if(!projectId){
					let newProject = new Project({name: project});
					newProject.save( (err, data) => {
						if(err){
							res.status(500).send({error:"An error occured while trying to create a new project"});
						}else{
							createIssue(req, res, data._id);
						}
					});
				}else{
					createIssue(req, res, projectId);
				}
			});
		})
	    	    
		.put((req, res) => {
			//though the use story ask for a single valdiation on all the fields, the check for the _id should be done before the others or else we may get a title without id, throwing an error while trying to update an unknown issue
			if(!req.body._id){
				res.status(404).send("No issue id especified");
			}else if(!req.body.issue_title && !req.body.issue_text && !req.body.created_by && !req.body.assigned_to && !req.body.status_text){
				res.status(412).send("no updated field sent");
			}else{
				//if the checkbox is not selected, the body will not have the value of open. This would mean it's not possible to reopen issues
				let json = {
					updated_on: new Date(),
					open: req.body.open ? req.body.open : true
				};
				if(req.body.issue_title){
					json.issue_title = req.body.issue_title;
				}
				if(req.body.issue_text){
					json.issue_text = req.body.issue_text;
				}
				if(req.body.created_by){
					json.created_by = req.body.created_by;
				}
				if(req.body.assigned_to){
					json.assigned_to = req.body.assigned_to;
				}
				if(req.body.status_text){
					json.status_text = req.body.status_text;
				}
				Issue.findByIdAndUpdate(req.body._id, json, (err) => {
					res.send(err ? "could not update " + req_body._id : "successfully updated");
				});
			}
		})
	    
		.delete((req, res) => {
			if(!req.body._id){
				res.status(412).send("_id error");
			}else{
				Issue.findByIdAndDelete(req.body._id, (err) => {
					res.send(err ? "'could not delete " + req.body._id : "deleted " + req.body._id);
				});
			}
		});
  
};
