const Consumer = require('../api/auth/models/Consumer');

async function gateWayAuth (req, res, next) {
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({ message: 'No authorization headers.' });
  }

  const apiKey = req.headers.authorization.split(' ');

  if (apiKey.length != 2) {
    return res.status(401).send({ message: 'Malformed Api Key.' });
  }

  const privateKey = apiKey[1];
  const consumer = await Consumer.findOne({ api_key: privateKey }).lean().exec();
  
  if (!consumer) {
    return res.status(401).send({ message: 'Consumer Api Key Does Not Exist.' });
  }

  req.headers.consumer_type = consumer.type;

  return next();
}

module.exports = gateWayAuth;