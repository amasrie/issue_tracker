/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          
          //fill me in too!
          assert.isNull(err);
	  assert.isNotNull(res.body.issue_title);
	  assert.isNotNull(res.body.issue_text);
	  assert.isNotNull(res.body.created_by);
	  assert.isNotNull(res.body.assigned_to);
	  assert.isNotNull(res.body.created_by);
	  assert.isNotNull(res.body._id);
	  assert.isNotNull(res.body.updated_on);
	  assert.isNotNull(res.body.created_on);
	  assert.isNotNull(res.body.open);
	  assert.isNotNull(res.body.project);
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'something missing',
          issue_text: 'there is something failing in this code',
          created_by: 'someone',
	  assigned_to: '',
	  status_text: "Waiting"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isNull(err);
	  assert.isNotNull(res.body.issue_title);
	  assert.isNotNull(res.body.issue_text);
	  assert.isNotNull(res.body.created_by);
	  assert.isNotNull(res.body.assigned_to);
	  assert.isNotNull(res.body.created_by);
	  assert.isNotNull(res.body._id);
	  assert.isNotNull(res.body.updated_on);
	  assert.isNotNull(res.body.created_on);
	  assert.isNotNull(res.body.open);
	  assert.isNotNull(res.body.project);
          done();
        });        
      });
      
      test('Missing required fields', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
        })
        .end(function(err, res){
          assert.notEqual(res.status, 200);
          assert.isNotNull(err);
          done();
        });
        
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
        })
        .end(function(err, res){
          assert.notEqual(res.status, 200);
	  assert.equal(res.text, "No issue id especified");
          done();
        });        
        
      });
      
      test('One field to update', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
		_id: "5871dda29faedc3491ff93bb",
		issue_title:"test"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
	  assert.equal(res.text, "successfully updated");
          done();
        });        
        
      });
      
      test('Multiple fields to update', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
		_id: "5871dda29faedc3491ff93bb",
		issue_title:"test",
		created_by: "ABC"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
	  assert.equal(res.text, "successfully updated");
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
		open: true
	})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });        
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
		open: true,
		assigned_to: ""
	})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });        
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
       chai.request(server)
        .delete('/api/issues/test')
        .send({
        })
        .end(function(err, res){
          assert.notEqual(res.status, 200);
	  assert.equal(res.text, "_id error");
          done();
        });        
      });
      
      test('Valid _id', function(done) {
       const id = "5e06e007c6d23a2a6c22bdd4";
       chai.request(server)
        .delete('/api/issues/test')
        .send({
		_id: id
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
	  assert.equal(res.text, "deleted " + id);
          done();
        });        
      });
      
    });

});
