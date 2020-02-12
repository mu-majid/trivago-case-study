const travellerService = require('../services/TravellerService');

async function getTraveller(req, res) {
  const { travellerKey } = req.params;
  const traveller = await travellerService.findOne(travellerKey);

  if (!traveller) {
    return res.status(404).json({
      statusCode: 404,
      message: `Traveller ${travellerKey} Was Not Found`
    });
  };

  return res.status(200).send(traveller);
}

async function createTraveller(req, res) {
  const travellerData = req.body;

  if (!travellerData.email) {
    return res.status(400).send({ message: 'Email Is Required!' });
  }

  try {
    const createdTraveller = await travellerService.create(travellerData);

    return res.status(201).send({ data: createdTraveller });
  }
  catch (error) {    
    if (error.errors && error.errors.email) {
      console.log('TravellerService ERROR: ', error.message);
      return res.status(409).send({
        message: `This ${travellerData.email} already exists.`
      });
    }
    console.log('TravellerService ERROR: ', error.message);
    return res.status(400).send({
      message: `Error While creating Traveller ${travellerData.email} with error: ${error.message}`
    });
  }
}

async function updateTravellerPoints(req, res) {
  const { travellerKey } = req.params;
  const { bonusPoints } = req.body;
  const requestingUser = req.headers['userid'];
  try {
    const updatedTraveller = await travellerService.updateOne(travellerKey, { bonusPoints });

    if (updatedTraveller) {
      travellerService.auditTravellerPointsUpdate(travellerKey, requestingUser, bonusPoints);
    }
    else{
      console.log('TravellerService ERROR: Could not find traveller with key ', travellerKey);
      return res.status(404).send({
        message: `Couldn\'t Update traveller ${travellerKey} points, because resource was not found.`
      });
    }

    return res.status(200).send({ data: updatedTraveller });
  }
  catch (error) {
    console.log('TravellerService ERROR: ', error);
    return res.status(400).send(new Error('Error While Updating Traveller!'));
  }
}

module.exports = {
  createTraveller,
  updateTravellerPoints,
  getTraveller
};