const request = require('request-promise-native');
const User = require('../models/User');
const { access_key, services, roles  } = require('../../../config/config');
const qs = require('query-string');

async function isAuthorizedPublic (req, res, next) {

  const {email, userId} = req.body;

  const user = await User.findOne({$or: [{ email }, { userId }]}).lean().exec();

  if (user) {

    if ((userId && user.userId !== userId) || (email && user.email !== email)) {
      console.log('PublicAuth Error : Unauthorized Operation.');
      return res.status(401).send({ message: 'You are not allowed to execute this operation.' });
    }
  
    req.headers.userId = user.userId;
    req.headers.userRole = user.role;
  }
  else {
    // check if user is traveller and is in business DB
    const query = qs.stringify({ userId, email });    
    const options = {
      url: `${services.business.url}/api/travellers?${query}`,
      headers: {
        accept: 'application/json',
        api_key: access_key,
        authorization: req.headers.authorization
      },
      json: true
    };

    let traveller;
    try {
      traveller = await request.get(options);
    }
    catch (error) {
      console.log('PublicAuth Business Service Error: ', error.message);
      return res.status(404).send({ message: 'User Was not Found In Our System.' });
    }

    const createdUser = await User.create({ email: traveller.email, userId: traveller.travellerKey, role: roles.CUSTOMER });

    if ((userId && traveller.travellerKey !== userId) || (email && traveller.email !== email)) {
      console.log('PublicAuth Error : Unauthorized Operation.');
      return res.status(401).send({ message: 'You are not allowed to execute this operation.' });
    }
    req.headers.userId = traveller.travellerKey;
    req.headers.userRole = createdUser.role;
  }

  return next();
}

module.exports = isAuthorizedPublic;