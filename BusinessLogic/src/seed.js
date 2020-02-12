const mongoose = require('mongoose');

const Traveller = require('./api/Traveller/models/Traveller');
const Room = require('./api/Room/models/Room');

const  travellers  = [
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
  }
  catch (error) {
    console.log('Ttaveller Data Already Seeded.')
  }

  try {
    await Room.insertMany(rooms);
    
  } catch (error) {
    console.log('Room Data Already Seeded.')
    
  }

}

module.exports = connectToDb;
