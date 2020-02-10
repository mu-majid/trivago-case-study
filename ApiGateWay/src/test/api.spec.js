const { expect } = require('chai');
const request = require('request-promise-native');
const requestTest = require('supertest');
const chai = require('chai');
const mongoose = require('mongoose');
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
const { describe, it, afterEach, beforeEach } = require('mocha');

const {app} = require('../server');
const Consumer = require('../api/auth/models/Consumer');
const User = require('../api/auth/models/User');
const { database } = require('../config/config');

// request = request(app);
const users = [
  {
    email: "admin@admin.com",
    userId: '111',
    role: 'ADMIN',
    name: 'John Doe'
  },
  {
    email: "guest@guest.com",
    userId: '222',
    role: 'CUSTOMER',
    name: 'Jane Doe'
  }
];

const consumers = [
  {
    api_key: "public-secret",
    type: 'public'
  },
  {
    api_key: "private-secret",
    type: 'private'
  }
];


before(async function ()  {
  await mongoose.connect(
    `mongodb://${database.host}:${database.port}/${(process.env.NODE_ENV === 'testing') ? database.dbNameTesting : 'api_gateway_testing_db' }`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  );
});

after(async () => {  
  await mongoose.connection.close();
});

describe('publicAuth Middleware Unit Test', () => {
  const sandbox = sinon.createSandbox();

  before(async function ()  {
    sandbox.stub(console, 'log').callsFake(() => {});

    await User.insertMany(users);
    await Consumer.insertMany(consumers);
  });
  
  after(async function () {
    console.log.restore();
    await User.deleteMany({});
    await Consumer.deleteMany({});
  });

  beforeEach(() => {
    sandbox.stub(request, 'get').callsFake(() => Promise.resolve(
      {
        email: "traveller@traveller.com",
        bonusPoints: 50,
        travellerKey: 'travellerOne',
        name: 'Test Traveller'
      }
    ));
    sandbox.stub(request, 'post').callsFake(() => Promise.resolve({done: true}));
    sandbox.stub(request, 'put').callsFake(() => Promise.resolve({done: true}));

  });

  afterEach(() => {
    request.get.restore(); // Unwraps the spy
    request.post.restore(); // Unwraps the spy
    request.put.restore(); // Unwraps the spy


  });

  describe('POST /api/bookings', () => {

    it('Should throw not authorized error, no auth headers.', async () => {
      return requestTest(app).post('/api/bookings')
      .set('Accept', 'application/json')
      .expect(401)
      .then( response => {
        expect(response.body.message).to.equal('No authorization headers.')
      });
    });

    it('Should throw not unauthorized error, malformed key', async () => {
      return requestTest(app).post('/api/bookings')
      .set('Accept', 'application/json')
      .set('authorization', 'malformed')

      .expect(401)
      .then( response => {
        expect(response.body.message).to.equal('Malformed Api Key.')
      });
    });

    it('Should throw unauthorized error, consumer not found', async () => {
      return requestTest(app).post('/api/bookings')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key non-existent')

      .expect(401)
      .then( response => {
        expect(response.body.message).to.equal('Consumer Api Key Does Not Exist.');
      });
    });

    it('Should throw validation error', async () => {
      return requestTest(app).post('/api/bookings')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key public-secret')
      .expect(422)
      .then( response => {
        expect(response.body.error).to.include(
          '"roomKey" is required,"travellerKey" is required,"value" must contain at least one of [userId, email]'
        );
      });
    });

    it('Should get traveller from business service and insert him in api users collection', async () => {
      return requestTest(app).post('/api/bookings')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key public-secret')
      .send({roomKey: 'rmk', travellerKey: 'trk', email: 'traveller@traveller.com'})
      .expect(200)
      .then( response => {
        expect(response.body).deep.equal({ done: true });
      });
    });

    it('Should throw error, returned user from business is not the requesting user', async () => {
      return requestTest(app).post('/api/bookings')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key public-secret')
      .send({roomKey: 'rmk', travellerKey: 'trk', email: 'hacker@traveller.com'})
      .expect(401)
      .then( response => {
        expect(response.body).deep.equal({ message: 'You are not allowed to execute this operation.' });
      });
    });

    it('Should create reservation.', async () => {
      return requestTest(app).post('/api/bookings')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key public-secret')
      .send({roomKey: 'rmk', travellerKey: 'trk', email: 'admin@admin.com'})
      .expect(200)
      .then( response => {
        expect(response.body).to.deep.equal({done: true});
      });
    });


  });


  describe('POST /api/bookings/:bookingKey/cancel', () => {
    
    it('Should throw not authorized error, no auth headers.', async () => {
      return requestTest(app).post('/api/bookings/1/cancel')
      .set('Accept', 'application/json')
      .expect(401)
      .then( response => {
        expect(response.body.message).to.equal('No authorization headers.')
      });
    });

    it('Should throw not unauthorized error, malformed key', async () => {
      return requestTest(app).post('/api/bookings/1/cancel')
      .set('Accept', 'application/json')
      .set('authorization', 'malformed')

      .expect(401)
      .then( response => {
        expect(response.body.message).to.equal('Malformed Api Key.')
      });
    });

    it('Should throw unauthorized error, consumer not found', async () => {
      return requestTest(app).post('/api/bookings/1/cancel')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key non-existent')

      .expect(401)
      .then( response => {
        expect(response.body.message).to.equal('Consumer Api Key Does Not Exist.');
      });
    });

    it('Should throw validation error', async () => {
      return requestTest(app).post('/api/bookings/1/cancel')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key public-secret')
      .expect(422)
      .then( response => {
        expect(response.body.error).to.include(
          '"value" must contain at least one of [userId, email]'
        );
      });
    });

    it('Should cancel reservation successfully. ', async () => {
      return requestTest(app).post('/api/bookings/1/cancel')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key public-secret')
      .send({roomKey: 'rmk', travellerKey: 'trk', email: 'admin@admin.com'})
      .expect(200)
      .then( response => {
        expect(response.body).to.deep.equal({done: true});
      });
    });

  });


  describe('POST /api/rooms', () => {
    
    it('Should throw not authorized error, no auth headers.', async () => {
      return requestTest(app).post('/api/rooms')
      .set('Accept', 'application/json')
      .expect(401)
      .then( response => {
        expect(response.body.message).to.equal('No authorization headers.')
      });
    });

    it('Should throw not unauthorized error, malformed key', async () => {
      return requestTest(app).post('/api/rooms')
      .set('Accept', 'application/json')
      .set('authorization', 'malformed')

      .expect(401)
      .then( response => {
        expect(response.body.message).to.equal('Malformed Api Key.')
      });
    });

    it('Should throw unauthorized error, consumer not found', async () => {
      return requestTest(app).post('/api/rooms')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key non-existent')

      .expect(401)
      .then( response => {
        expect(response.body.message).to.equal('Consumer Api Key Does Not Exist.');
      });
    });

    it('Should throw  validation error', async () => {
      return requestTest(app).post('/api/rooms')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key public-secret')
      .expect(422)
      .then( response => {
        expect(response.body.error).to.include(
          '"value" must contain at least one of [userId, email]'
        );
      });
    });

    it('Should throw  validation error', async () => {
      return requestTest(app).post('/api/rooms')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key public-secret')
      .send({roomKey: 'rmk', travellerKey: 'trk', email: 'admin@admin.com'})
      .expect(422)
      .then( response => {
        
        expect(response.body.error).to.include('"roomName" is required,"requiredPoints" is required,"availableAmount" is required');
      });
    });

    it('Should throw unauth error, because user accessing private route with public api key', async () => {
      return requestTest(app).post('/api/rooms')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key public-secret')
      .send({roomName: 'rmk', requiredPoints: 200, availableAmount: 5, email: 'admin@admin.com'})
      .expect(401)
      .then( response => {
        expect(response.body).to.deep.equal({ message: 'Unauthorized Action' });
      });
    });

    it('Should throw forbidden error, because REGULAR user is executing ADMIN operation.', async () => {
      return requestTest(app).post('/api/rooms')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key private-secret')
      .send({roomName: 'rmk', requiredPoints: 200, availableAmount: 5, email: 'guest@guest.com'})
      .expect(403)
      .then( response => {
        expect(response.body).to.deep.equal({ message: 'Forbidden Action' });
      });
    });

    it('Should throw forbidden error, because REGULAR user is executing ADMIN operation.', async () => {
      return requestTest(app).post('/api/rooms')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key private-secret')
      .send({roomName: 'rmk', requiredPoints: 200, availableAmount: 5, email: 'admin@admin.com'})
      .expect(200)
      .then( response => {
        expect(response.body).to.deep.equal({done: true});
      });
    });

  });


  describe('POST /api/travellers', () => {

    it('Should throw not authorized error, no auth headers.', async () => {
      return requestTest(app).post('/api/travellers')
      .set('Accept', 'application/json')
      .expect(401)
      .then( response => {        
        expect(response.body.message).to.equal('No authorization headers.')
      });
    });

    it('Should throw not unauthorized error, malformed key', async () => {
      return requestTest(app).post('/api/travellers')
      .set('Accept', 'application/json')
      .set('authorization', 'malformed')
      .expect(401)
      .then( response => {        
        expect(response.body.message).to.equal('Malformed Api Key.')
      });
    });

    it('Should throw unauthorized error, consumer not found', async () => {
      return requestTest(app).post('/api/travellers')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key non-existent')
      .expect(401)
      .then( response => {
        expect(response.body.message).to.equal('Consumer Api Key Does Not Exist.');
      });
    });

    it('Should throw validation error', async () => {
      return requestTest(app).post('/api/travellers')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key public-secret')
      .expect(422)
      .then( response => {
        expect(response.body.error).to.include(
          '"email" is required'
        );
      });
    });

    it('Should create traveller.', async () => {
      return requestTest(app).post('/api/travellers')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key public-secret')
      .send({email: 'traveller@guest.com'})
      .expect(200)
      .then( response => {
        expect(response.body).to.deep.equal({done: true});
      });
    });


  });

  describe('PUT /api/travellers/:travellerKey/points', () => {

    it('Should throw not authorized error, no auth headers.', async () => {
      return requestTest(app).put('/api/travellers/1/points')
      .set('Accept', 'application/json')
      .expect(401)
      .then( response => {        
        expect(response.body.message).to.equal('No authorization headers.')
      });
    });

    it('Should throw not unauthorized error, malformed key', async () => {
      return requestTest(app).put('/api/travellers/1/points')
      .set('Accept', 'application/json')
      .set('authorization', 'malformed')
      .expect(401)
      .then( response => {        
        expect(response.body.message).to.equal('Malformed Api Key.')
      });
    });

    it('Should throw unauthorized error, consumer not found', async () => {
      return requestTest(app).put('/api/travellers/1/points')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key non-existent')
      .expect(401)
      .then( response => {
        expect(response.body.message).to.equal('Consumer Api Key Does Not Exist.');
      });
    });

    it('Should throw validation error', async () => {
      return requestTest(app).put('/api/travellers/1/points')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key public-secret')
      .expect(422)
      .then( response => {
        expect(response.body.error).to.include(
          '"bonusPoints" is required,"value" must contain at least one of [userId, email]'
        );
      });
    });

    it('Should throw validation error', async () => {
      return requestTest(app).put('/api/travellers/1/points')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key public-secret')
      .send({email: 'traveller@guest.com'})
      .expect(422)
      .then( response => {        
        expect(response.body).to.deep.equal({ error: '"bonusPoints" is required' });
      });
    });

    it('Should throw not found error, user not found', async () => {
      return requestTest(app).put('/api/travellers/1/points')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key public-secret')
      .send({email: 'traveller@guest.com', bonusPoints: 50})
      .expect(404)
      .then( response => {    
        expect(response.body).to.deep.equal({ "message": "User does not exist." });
      });
    });

    it('Should throw unauthorized action, user is admin but sent public key.', async () => {
      return requestTest(app).put('/api/travellers/1/points')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key public-secret')
      .send({email: 'admin@admin.com', bonusPoints: 50})
      .expect(401)
      .then( response => {            
        expect(response.body).to.deep.equal({ "message": "Unauthorized Action" });
      });
    });

    it('Should throw forbidden error, user is not admin but sent private key.', async () => {
      return requestTest(app).put('/api/travellers/1/points')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key private-secret')
      .send({email: 'guest@guest.com', bonusPoints: 50})
      .expect(403)
      .then( response => {            
        expect(response.body).to.deep.equal({ "message": "Forbidden Action" });
      });
    });

    it('Should update traveller points.', async () => {
      return requestTest(app).put('/api/travellers/1/points')
      .set('Accept', 'application/json')
      .set('authorization', 'api_key private-secret')
      .send({email: 'admin@admin.com', bonusPoints: 50})
      .expect(200)
      .then( response => {          
        expect(response.body).to.deep.equal({ done: true });
      });
    });

  });

});