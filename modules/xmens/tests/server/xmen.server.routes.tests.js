'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Xmen = mongoose.model('Xmen'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, xmen;

/**
 * Xmen routes tests
 */
describe('Xmen CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Xmen
    user.save(function () {
      xmen = {
        name: 'Xmen name'
      };

      done();
    });
  });

  it('should be able to save a Xmen if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Xmen
        agent.post('/api/xmens')
          .send(xmen)
          .expect(200)
          .end(function (xmenSaveErr, xmenSaveRes) {
            // Handle Xmen save error
            if (xmenSaveErr) {
              return done(xmenSaveErr);
            }

            // Get a list of Xmens
            agent.get('/api/xmens')
              .end(function (xmensGetErr, xmensGetRes) {
                // Handle Xmen save error
                if (xmensGetErr) {
                  return done(xmensGetErr);
                }

                // Get Xmens list
                var xmens = xmensGetRes.body;

                // Set assertions
                (xmens[0].user._id).should.equal(userId);
                (xmens[0].name).should.match('Xmen name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Xmen if not logged in', function (done) {
    agent.post('/api/xmens')
      .send(xmen)
      .expect(403)
      .end(function (xmenSaveErr, xmenSaveRes) {
        // Call the assertion callback
        done(xmenSaveErr);
      });
  });

  it('should not be able to save an Xmen if no name is provided', function (done) {
    // Invalidate name field
    xmen.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Xmen
        agent.post('/api/xmens')
          .send(xmen)
          .expect(400)
          .end(function (xmenSaveErr, xmenSaveRes) {
            // Set message assertion
            (xmenSaveRes.body.message).should.match('Please fill Xmen name');

            // Handle Xmen save error
            done(xmenSaveErr);
          });
      });
  });

  it('should be able to update an Xmen if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Xmen
        agent.post('/api/xmens')
          .send(xmen)
          .expect(200)
          .end(function (xmenSaveErr, xmenSaveRes) {
            // Handle Xmen save error
            if (xmenSaveErr) {
              return done(xmenSaveErr);
            }

            // Update Xmen name
            xmen.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Xmen
            agent.put('/api/xmens/' + xmenSaveRes.body._id)
              .send(xmen)
              .expect(200)
              .end(function (xmenUpdateErr, xmenUpdateRes) {
                // Handle Xmen update error
                if (xmenUpdateErr) {
                  return done(xmenUpdateErr);
                }

                // Set assertions
                (xmenUpdateRes.body._id).should.equal(xmenSaveRes.body._id);
                (xmenUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Xmens if not signed in', function (done) {
    // Create new Xmen model instance
    var xmenObj = new Xmen(xmen);

    // Save the xmen
    xmenObj.save(function () {
      // Request Xmens
      request(app).get('/api/xmens')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Xmen if not signed in', function (done) {
    // Create new Xmen model instance
    var xmenObj = new Xmen(xmen);

    // Save the Xmen
    xmenObj.save(function () {
      request(app).get('/api/xmens/' + xmenObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', xmen.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Xmen with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/xmens/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Xmen is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Xmen which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Xmen
    request(app).get('/api/xmens/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Xmen with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Xmen if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Xmen
        agent.post('/api/xmens')
          .send(xmen)
          .expect(200)
          .end(function (xmenSaveErr, xmenSaveRes) {
            // Handle Xmen save error
            if (xmenSaveErr) {
              return done(xmenSaveErr);
            }

            // Delete an existing Xmen
            agent.delete('/api/xmens/' + xmenSaveRes.body._id)
              .send(xmen)
              .expect(200)
              .end(function (xmenDeleteErr, xmenDeleteRes) {
                // Handle xmen error error
                if (xmenDeleteErr) {
                  return done(xmenDeleteErr);
                }

                // Set assertions
                (xmenDeleteRes.body._id).should.equal(xmenSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Xmen if not signed in', function (done) {
    // Set Xmen user
    xmen.user = user;

    // Create new Xmen model instance
    var xmenObj = new Xmen(xmen);

    // Save the Xmen
    xmenObj.save(function () {
      // Try deleting Xmen
      request(app).delete('/api/xmens/' + xmenObj._id)
        .expect(403)
        .end(function (xmenDeleteErr, xmenDeleteRes) {
          // Set message assertion
          (xmenDeleteRes.body.message).should.match('User is not authorized');

          // Handle Xmen error error
          done(xmenDeleteErr);
        });

    });
  });

  it('should be able to get a single Xmen that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Xmen
          agent.post('/api/xmens')
            .send(xmen)
            .expect(200)
            .end(function (xmenSaveErr, xmenSaveRes) {
              // Handle Xmen save error
              if (xmenSaveErr) {
                return done(xmenSaveErr);
              }

              // Set assertions on new Xmen
              (xmenSaveRes.body.name).should.equal(xmen.name);
              should.exist(xmenSaveRes.body.user);
              should.equal(xmenSaveRes.body.user._id, orphanId);

              // force the Xmen to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Xmen
                    agent.get('/api/xmens/' + xmenSaveRes.body._id)
                      .expect(200)
                      .end(function (xmenInfoErr, xmenInfoRes) {
                        // Handle Xmen error
                        if (xmenInfoErr) {
                          return done(xmenInfoErr);
                        }

                        // Set assertions
                        (xmenInfoRes.body._id).should.equal(xmenSaveRes.body._id);
                        (xmenInfoRes.body.name).should.equal(xmen.name);
                        should.equal(xmenInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Xmen.remove().exec(done);
    });
  });
});
