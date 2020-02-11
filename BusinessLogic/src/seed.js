const mongoose = require('mongoose');

const Traveller = require('./api/Traveller/models/Traveller');
const Room = require('./api/Room/models/Room');

const  travellers  = [
	{
		email:  "test@test.com",
		bonusPoints:  75,
		travellerKey:  'KeyOne',
		name: 'JohnDoe'
	},
	{
		email:  "test2@test.com",
		bonusPoints:  150,
		travellerKey:  'KeyTwo',
		name: 'JohnDoe2'
	},
	{
		email:  "test3@test.com",
		bonusPoints:  35,
		travellerKey:  'KeyThree',
		name: 'JohnDoe3'
	}
];

const  rooms  = [
	{
		roomName:  "Suite C2",
		requiredPoints:  250,
		availableAmount:  2,
		roomKey:  'RoomOne'
	},
	{
		roomName:  "Single Room C2",
		requiredPoints:  100,
		availableAmount:  1,
		roomKey:  'RoomTwo'
	},
	{
		roomName:  "Single Room C3",
		requiredPoints:  100,
		availableAmount:  5,
		roomKey:  'RoomThree'
	}
];

const connectToDb = async (connectionStr, options) => {
  await mongoose.connect(connectionStr, options);

  try {
    await Traveller.insertMany(travellers);
    await Room.insertMany(rooms);
  }
  catch (error) {
    console.log('Data Already Seeded.');
  }

}

module.exports = connectToDb;
