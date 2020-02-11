const mongoose = require('mongoose');

const Consumer = require('./api/auth/models/Consumer');
const User = require('./api/auth/models/User');

const  users  = [
	{
		email:  "admin@admin.com", // P/oa1XVdX0rkOQLNjNpAvv/2oCdZlC5fwzyaK/mvdPk=
		userId:  '111',
		role:  'ADMIN',
    name:  'John Admin',
    token: 'private-token'
	},
	{
		email:  "test@test.com",
		role:  'CUSTOMER',
		userId:  'KeyOne',
    name: 'JohnDoe',
    token: 'public-token-1' // MXFTroJt3r8037wCXq0wA+gWCTP1QoG884F5fdk39J4=
	},
	{
		email:  "test2@test.com",
		role:  'CUSTOMER',
		userId:  'KeyTwo',
    name: 'JohnDoe2',
    token: 'public-token-2' // t3sgjSE66KsuTBtRI21/PUU7oPUpwwIOrzpAUPrrW/8=
    
	},
	{
		email:  "test3@test.com",
		role:  'CUSTOMER',
		userId:  'KeyThree',
    name: 'JohnDoe3',
    token: 'public-token-3' // vYSYLt1OzKvkWtmYuVUYmCRbSf20H4b/Gr1C1DzBmp8=
    
	}
];

const  consumers  = [
	{
		api_key:  "MXFTroJt3r8037wCXq0wA+gWCTP1QoG884F5fdk39J4=",
		type:  'public'
  },
  {
		api_key:  "t3sgjSE66KsuTBtRI21/PUU7oPUpwwIOrzpAUPrrW/8=",
		type:  'public'
  },
  {
		api_key:  "vYSYLt1OzKvkWtmYuVUYmCRbSf20H4b/Gr1C1DzBmp8=",
		type:  'public'
	},
	{
		api_key:  "P/oa1XVdX0rkOQLNjNpAvv/2oCdZlC5fwzyaK/mvdPk=",
		type:  'private'
	}
];

const connectToDb = async (connectionStr, options) => {
  await mongoose.connect(connectionStr, options);
  
  try {
    await User.insertMany(users);
  }
  catch (error) {
    console.log('User Data Already Seeded.')
  }

  try {
    await Consumer.insertMany(consumers);
    
  } catch (error) {
    console.log('Consumer Data Already Seeded.')
    
  }
}

module.exports = connectToDb;
