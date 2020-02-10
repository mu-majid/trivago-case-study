
const uuid = require('uuid');
const request = require('request-promise-native');

const Traveller = require('../models/Traveller');
const { services } = require('../../../config/config');


async function updateOne(travellerKey, updateObj) {
  // find and update query
  let updatedTraveller = await Traveller.findOneAndUpdate(
    { travellerKey },
    updateObj,
    {
      omitUndefined: true,
      new: true,
      runValidators: true,
      context: 'query'
    }
  ).lean().exec();

  return {
    travellerKey: updatedTraveller.travellerKey,
    bonusPoints: updatedTraveller.bonusPoints,
    email: updatedTraveller.email
  };
}


async function findOne(travellerKey, email) {
  const query = Traveller.findOne({$or: [{ travellerKey }, { email }]});
  const traveller = await query.lean().exec();

  return traveller;
}

async function create(data) {
  data.travellerKey = uuid.v4();
  const createdTraveller = await Traveller.create(data);

  return {
    travellerKey: createdTraveller.travellerKey,
    bonusPoints: createdTraveller.bonusPoints,
    email: createdTraveller.email
  }
}

async function auditTravellerPointsUpdate (travellerKey, userId, bonusPoints) {
  const auditPayload = {
    userId,
    resource: 'Traveller',
    resourceId: travellerKey,
    action: 'Update Bonus Points',
    data: {
      msg: 'Points Updated From System User',
      newValue: bonusPoints
    }
  }
  const auditOptions = {
    url: `${services.monitoring.uri}:${services.monitoring.port}/api/audit`,
    headers:
    {
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    body: auditPayload,
    json: true
  }

  request.post(auditOptions)
    .then(() => console.log(`Audited Traveller ${travellerKey} Points Successfully`))
    .catch((e) => console.log(`Failed to Audit Traveller ${travellerKey} Points Update with error: ${e}`))
}

module.exports = {
  updateOne,
  findOne,
  create,
  auditTravellerPointsUpdate

}