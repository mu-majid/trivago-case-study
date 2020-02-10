const request = require('request-promise-native');
const User = require('../models/User');
const Consumer = require('../models/Consumer');
const { access_key, services  } = require('../../../config/config');
const qs = require('query-string');

async function isAuthorizedPublic (req, res, next) {

  const {email, userId} = req.body;

  if (!(email || userId)) {
    return res.status(400).send({ message: 'User email (if new user) or id are required' });
  }

  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({ message: 'No authorization headers.' });
  }

  const publicApiKey = req.headers.authorization.split(' ');

  if (publicApiKey.length != 2) {
    return res.status(401).send({ message: 'Malformed Api Key.' });
  }

  const publicKey = publicApiKey[1];
  const consumer = await Consumer.findOne({ api_key: publicKey }).lean().exec();

  if (!consumer || consumer.type !== 'public') {
    return res.status(401).send({ message: 'Consumer Api Key Does Not Exist.' });
  }

  const user = await User.findOne({$or: [{ email }, { userId }]}).lean().exec();

  if (user) {
    req.headers.userId = user.userId;
    req.headers.api_key = access_key;
    return next();
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
      console.log('Business Service Error: ', error.message);
      return res.status(404).send({ message: 'User Was not Found In Our System.' });
    }

    await User.create({ email: traveller.email, userId: traveller.travellerKey, role: 'CUSTOMER' });

    req.headers.userId = traveller.travellerKey;
    req.headers.api_key = access_key;

    return next();
  }
}

module.exports = isAuthorizedPublic;