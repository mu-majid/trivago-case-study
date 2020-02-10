const User = require('../models/User');
const Consumer = require('../models/Consumer');
const { access_key  } = require('../../../config/config');
const qs = require('query-string');

async function isAuthorizedPrivate (req, res, next) {

  const {email, userId} = req.body;

  if (!(email || userId)) {
    return res.status(400).send({ message: 'User email or id are required' });
  }

  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({ message: 'No authorization headers.' });
  }

  const privateApiKey = req.headers.authorization.split(' ');

  if (privateApiKey.length != 2) {
    return res.status(401).send({ message: 'Malformed Api Key.' });
  }

  const privateKey = privateApiKey[1];
  const consumer = await Consumer.findOne({ api_key: privateKey }).lean().exec();

  if (!consumer || consumer.type !== 'private') {
    return res.status(401).send({ message: 'Consumer Api Key Does Not Exist.' });
  }

  const user = await User.findOne({$or: [{ email }, { userId }]}).lean().exec();

  if (!user || user.role !== 'ADMIN') {
    // since the api key exist (let's say authenticated) we should return forbidden.
    return res.status(403).send({ message: 'Forbidden Action' });
  }
  req.headers.userId = user.userId;
  req.headers.api_key = access_key;
  return next();
}

module.exports = isAuthorizedPrivate;