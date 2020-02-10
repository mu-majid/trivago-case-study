const User = require('../models/User');
const { roles  } = require('../../../config/config');

async function isAuthorizedPrivate (req, res, next) {

  const { email, userId } = req.body;

  const user = await User.findOne({$or: [{ email }, { userId }]}).lean().exec();
  
  if (!user) {
    console.log(`PrivateAuth Error: User ${(userId || email)} was not found`);
    return res.status(404).send({ message: 'User does not exist.' });
  }

  if (req.headers.consumer_type !== 'private' || user.role !== roles.ADMIN) {
    // since the api key exist (let's say authenticated) we should return forbidden.

    console.log(`PrivateAuth Error: User ${(userId || email)} sent private key, but his role is not ${roles.ADMIN}.`);
    return res.status(403).send({ message: 'Forbidden Action' });
  }

  req.headers.userId = user.userId;
  return next();
}

module.exports = isAuthorizedPrivate;