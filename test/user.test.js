const server = require('../index');
const models = require('../lib/models');
const helpers = require('./helpers');

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('Users', () => {
  before((done) => {
    models.User.findOneAndRemove({email: helpers.userTemplate.email})
      .then(() => {
        done();
      });
  });

  it('should create a user', (done) => {
    chai.request(server)
      .post('/api/user')
      .send(helpers.userTemplate)
      .end((err, res) => {
        helpers.checkErr(err);
        res.should.have.status(201);
        done();
      });
  });

  it('should get a user', (done) => {
    models.User.find({email: helpers.userTemplate.email})
      .then((user) => {
        helpers.setAuth(
          chai.request(server)
            .get('/api/users/' + user.id),
          user.id,
          false
        ).end((err) => {
          if (err === undefined) {
            throw err;
          }
          done();
        });
      });
  });
});
