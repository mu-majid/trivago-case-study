const Consumer = require('../api/auth/models/Consumer');
const { access_key  } = require('../config/config');

async function gateWayAuth (req, res, next) {
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({ message: 'No authorization headers.' });
  }

  const authHeader = req.headers.authorization.split(' ');

  if (authHeader.length != 2) {
    return res.status(401).send({ message: 'Malformed Api Key.' });
  }

  const consumer_token = authHeader[1];
  const consumer = await Consumer.findOne({ api_key: consumer_token }).lean().exec();
  
  if (!consumer) {
    return res.status(401).send({ message: 'Consumer Api Key Does Not Exist.' });
  }

  req.headers.consumer_type = consumer.type;
  req.headers.consumer_token = consumer_token;
  req.headers.api_key = access_key;
  return next();
}

module.exports = gateWayAuth;