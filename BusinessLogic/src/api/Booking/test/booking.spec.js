const { expect } = require('chai');
const request = require('request-promise-native');
const chai = require('chai');
const mongoose = require('mongoose');
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
const { describe, it, afterEach, beforeEach } = require('mocha');
const Traveller = require('../../Traveller/models/Traveller');
const Room = require('../../Room/models/Room');
const Booking = require('../models/Booking');
const bookingService = require('../services/BookingService');
const { database } = require('../../../config/config');
const travellers = [
  {
    email: "test@test.com",
    bonusPoints: 75,
    travellerKey: 'KeyOne'
  },
  {
    email: "test2@test.com",
    bonusPoints: 150,
    travellerKey: 'KeyTwo'
  },
  {
    email: "test3@test.com",
    bonusPoints: 35,
    travellerKey: 'KeyThree'
  }
];

const rooms = [
  {
    name: "Suite C2",
    requiredPoints: 250,
    availableAmount: 2,
    roomKey: 'RoomOne'
  },
  {
    name: "Single Room C2",
    requiredPoints: 100,
    availableAmount: 1,
    roomKey: 'RoomTwo'
  },
  {
    name: "Single Room C3",
    requiredPoints: 100,
    availableAmount: 1,
    roomKey: 'dummyRoom'
  }
];

const bookings = [
  {
    travellerKey: 'dummyTraveller',
    roomKey: 'dummyRoom',
    bookingKey: 'BookingOne',
    active: true,
    status: 'RESERVED'
  }
];

before(async function ()  {
  await mongoose.connect(
    `mongodb://${database.host}:${database.port}/${(process.env.NODE_ENV === 'testing') ? database.dbNameTesting : database.dbName }`,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
  );
});

after(async () => {
  await mongoose.connection.close();
});

describe('bookingService Unit Test', () => {
  const sandbox = sinon.createSandbox();

  before(async function ()  {
    await Traveller.insertMany(travellers);
    await Room.insertMany(rooms);
    await Booking.insertMany(bookings);
  });
  
  after(async function () {
    await Traveller.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});
  });

  beforeEach(() => {
    sandbox.stub(request, 'post').callsFake(() => Promise.resolve());
  });

  afterEach(() => {
    request.post.restore(); // Unwraps the spy
  });

  describe('findOne', () => {
    it('Should find booking record', async () => {
      const result = await bookingService.findOne('BookingOne');
      expect(result).to.haveOwnProperty('_id');
    });

    it('Should return null if no booking was found', async () => {
      const result = await bookingService.findOne('NonExistent');
      expect(result).to.be.null;
    });
  });

  describe('updateOne', () => {
    it('Should update record if found', async () => {
      const result = await bookingService._test.updateOne(bookings[0].bookingKey, {active: false});
      const updated = await Booking.findOne({bookingKey: bookings[0].bookingKey})
      expect(updated.active).to.be.false;
    });

    it('Should return null if nothing was updated', async () => {
      const result = await bookingService._test.updateOne('NotExistent', {active: false});
      expect(result).to.be.null;
    });
  });

  describe('bookRoom', () => {

    it('Should book a room with bonus points.', async () => {
      const result = await bookingService.bookRoom(travellers[1], rooms[1], 'USER_ID');
      const updatedTraveller = await Traveller.findOne({travellerKey: travellers[1].travellerKey});
      const updatedRoom = await Room.findOne({roomKey: rooms[1].roomKey});

      expect(result.toObject()).to.haveOwnProperty('_id');
      expect(result.status).to.equal('RESERVED');
      expect(updatedTraveller.bonusPoints).to.equal(50);
      expect(updatedRoom.availableAmount).to.equal(0);
    });

    it('Should book a room without bonus points.', async () => {
      const result = await bookingService.bookRoom(travellers[0], rooms[0], 'USER_ID');
      const updatedTraveller = await Traveller.findOne({travellerKey: travellers[0].travellerKey});
      const updatedRoom = await Room.findOne({roomKey: rooms[0].roomKey});

      expect(result.toObject()).to.haveOwnProperty('_id');
      expect(result.status).to.equal('PENDING_APPROVAL');
      expect(updatedTraveller.bonusPoints).to.equal(75);
      expect(updatedRoom.availableAmount).to.equal(1);
    });
  });

  describe('cancelReservation', () => {

    it('Should cancel reservation and update corresponding room and traveller', async () => {
      const result = await bookingService.cancelReservation(bookings[0], 'userId');
      const updatedRoom = await Room.findOne({ roomKey: rooms[2].roomKey });
      expect(result.bookingKey).to.equal(bookings[0].bookingKey);
      expect(result.status).to.equal('CANCELLED');
      expect(updatedRoom.availableAmount).to.equal(2);
    });
  });

  describe('canUsePoints', () => {

    it('Should check if traveller can use points to book room. (case 1)', async () => {
      const result = bookingService._test.canUsePoints(250, 250);
      expect(result.canBookWithPoints).to.be.true;
      expect(result.updatedPoints).to.equal(0);
    });

    it('Should check if traveller can use points to book room. (case 2)', async () => {
      const result = bookingService._test.canUsePoints(250, 350);
      expect(result.canBookWithPoints).to.be.false;
      expect(result.updatedPoints).to.equal(-100);
    });
  });

});