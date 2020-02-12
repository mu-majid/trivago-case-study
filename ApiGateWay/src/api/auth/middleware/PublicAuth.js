const request = require('request-promise-native');
const User = require('../models/User');
const { access_key, services, roles, publicKeySecret  } = require('../../../config/config');
const qs = require('query-string');
const { createHmac } = require('crypto');
const uuid = require('uuid');

async function isAuthorizedPublic (req, res, next) {

  const { consumer_token } = req.headers;
  const emailFromBody  = req.body.email;
  const emailFromQuery = req.query.email;
  const email = emailFromBody || emailFromQuery;

  const userIdFromBody  = req.body.userId;
  const userIdFromParams  = req.params.travellerKey;

  const userId = userIdFromBody || userIdFromParams;
  

  const user = await User.findOne({$or: [{ email }, { userId }]}).lean().exec();

  if (!user) {
    console.log(`Public Error: User ${(userId || email)} was not found`);
    return res.status(404).send({ message: 'User does not exist.' });
  }

  if ((userId && user.userId !== userId) || (email && user.email !== email)) {
    console.log('PublicAuth Error : Unauthorized Operation.');
    return res.status(401).send({ message: 'You are not allowed to execute this operation.' });
  }

  if (consumer_token !== createHmac('SHA256', publicKeySecret).update(user.token).digest('base64')) {
    console.log('PublicAuth Error : Unauthorized Operation. Token Mismatch');
    return res.status(401).send({ message: 'You are not allowed to execute this operation.' });
  }

  req.headers.userId = user.userId;
  req.headers.userRole = user.role;
  return next();
}

module.exports = isAuthorizedPublic;