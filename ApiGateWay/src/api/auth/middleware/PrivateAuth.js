const User = require('../models/User');
const { access_key  } = require('../../../config/config');

async function isAuthorizedPrivate (req, res, next) {

  const {email, userId} = req.body;

  if (!(email || userId)) {
    return res.status(400).send({ message: 'User email or id are required' });
  }

  const user = await User.findOne({$or: [{ email }, { userId }]}).lean().exec();

  if (!user) {
    return res.status(404).send({ message: 'User does not exist.' });
  }

  if (req.headers.consumer_type !== 'private' || user.role !== 'ADMIN') {
    // since the api key exist (let's say authenticated) we should return forbidden.

    return res.status(403).send({ message: 'Forbidden Action' });
  }


  req.headers.userId = user.userId;
  req.headers.api_key = access_key;
  return next();
}

module.exports = isAuthorizedPrivate;