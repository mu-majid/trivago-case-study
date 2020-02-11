const mongoose = require('mongoose');

const Consumer = require('./api/auth/models/Consumer');
const User = require('./api/auth/models/User');

const  users  = [
	{
		email:  "admin@admin.com",
		userId:  '111',
		role:  'ADMIN',
		name:  'John Admin'
	},
	{
		email:  "test@test.com",
		role:  'CUSTOMER',
		userId:  'KeyOne',
		name: 'JohnDoe'
	},
	{
		email:  "test2@test.com",
		role:  'CUSTOMER',
		userId:  'KeyTwo',
		name: 'JohnDoe2'
	},
	{
		email:  "test3@test.com",
		role:  'CUSTOMER',
		userId:  'KeyThree',
		name: 'JohnDoe3'
	}
];

const  consumers  = [
	{
		api_key:  "public-api-secret",
		type:  'public'
	},
	{
		api_key:  "private-api-secret",
		type:  'private'
	}
];

const connectToDb = async (connectionStr, options) => {
  await mongoose.connect(connectionStr, options);
  
  try {
    await User.insertMany(users);
    await Consumer.insertMany(consumers);
  }
  catch (error) {
    console.log('Data Already Seeded.')
  }
}

module.exports = connectToDb;
