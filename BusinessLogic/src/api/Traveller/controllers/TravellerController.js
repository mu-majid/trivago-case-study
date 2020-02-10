const travellerService = require('../services/TravellerService');

async function getTraveller(req, res) {
  const { userId, email } = req.query;
  console.log({ userId, email });
  
  const traveller = await travellerService.findOne(userId, email);

  if (!traveller) {
    return res.status(404).json({
      statusCode: 404,
      message: `Traveller Was Not Found`
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
    // handle existing travellers
    const createdTraveller = await travellerService.create(travellerData);

    return res.status(201).send({ data: createdTraveller });
  }
  catch (error) {
    console.log('TravellerService ERROR: ', error);
    return res.status(400).send(new Error('Error While Creating Guest!'));
  }
}

async function updateTravellerPoints(req, res) {
  const { travellerKey } = req.params;
  const { bonusPoints } = req.body;
  // handle private api_key
  // const api_key = req.headers.authorization;
  // user Will be sent on request
  try {
    const updatedTraveller = await travellerService.updateOne(travellerKey, { bonusPoints });

    if (updatedTraveller) {
      travellerService.auditTravellerPointsUpdate(travellerKey, 'REQUESTING_SYS_USR', bonusPoints);
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