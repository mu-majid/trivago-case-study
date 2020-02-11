const User = require('../models/User');
const { roles, privateKeySecret  } = require('../../../config/config');
const { createHmac } = require('crypto');

async function isAuthorizedPrivate (req, res, next) {

  const { email, userId } = req.body;
  const { consumer_token } = req.headers;

  const user = await User.findOne({$or: [{ email }, { userId }]}).lean().exec();
  
  if (!user) {
    console.log(`PrivateAuth Error: User ${(userId || email)} was not found`);
    return res.status(404).send({ message: 'User does not exist.' });
  }

  if (consumer_token !== createHmac('SHA256', privateKeySecret).update(user.token).digest('base64')) {
    console.log('PrivateAuth Error : Unauthorized Operation. Token Mismatch');
    return res.status(401).send({ message: 'You are not allowed to execute this operation.' });
  }

  if (req.headers.consumer_type !== 'private') {
    console.log(`PrivateAuth Error: User ${(userId || email)} did not send private api key.`);
    return res.status(401).send({ message: 'Unauthorized Action' });
  }

  if (user.role !== roles.ADMIN) {
    // since the api key exist (let's say authenticated) we should return forbidden.

    console.log(`PrivateAuth Error: User ${(userId || email)} sent private key, but his role is not ${roles.ADMIN}.`);
    return res.status(403).send({ message: 'Forbidden Action' });
  }

  req.headers.userId = user.userId;
  return next();
}

module.exports = isAuthorizedPrivate;