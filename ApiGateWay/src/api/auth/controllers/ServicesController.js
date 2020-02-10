// updateTravellerPoints
const request = require('request-promise-native');
const Log = require('../models/Log');
const { services } = require('../../../config/config');


const parseError = function (error) {
  let e = error;

  if(typeof error === 'string') {
    e = JSON.parse(e);
  }

  const code = e['code'] || e['statusCode'];
  const message = e['message'] || '';

  return {
    code,
    message
  };
};

async function makeReservation (req, res) {
  
  const path = '/api/bookings';
  const options = {
    url: `${services.business.url}${path}`,
    headers: {
      accept: 'application/json',
      api_key: req.headers.api_key,
      authorization: req.headers.authorization,
      userId: req.headers.userId
    },
    body: req.body,
    json: true
  };

  try {
    const reservation = await request.post(options);

    await Log.create({ path, statusCode: 200, response: reservation, userId: req.headers.userId, payload: req.body });

    return res.status(200).send(reservation);
  }
  catch (error) {
    const e = parseError(error);

    await Log.create({ path, statusCode: e.code, response: error.error, userId: req.headers.userId, payload: req.body });

    console.log('Error while trying to make reservation: ', e.message);

    return res.status(400).send({message: `Couldn\'t make reservation  with error ${e.message}.`});
  }

}

async function abortReservation (req, res) {
  
  const path = `/api/bookings/${req.body.bookingKey}/cancel`;
  const options = {
    url: `${services.business.url}${path}`,
    headers: {
      accept: 'application/json',
      api_key: req.headers.api_key,
      authorization: req.headers.authorization,
      userId: req.headers.userId
    },
    body: req.body,
    json: true
  };

  try {
    const cancelledMsg = await request.post(options);

    await Log.create({ path, statusCode: 200, response: cancelledMsg, userId: req.headers.userId, payload: req.body });

    return res.status(200).send(cancelledMsg);
  }
  catch (error) {
    const e = parseError(error);

    await Log.create({ path, statusCode: e.code, response: error.error, userId: req.headers.userId, payload: req.body });

    console.log(`Error while trying to cancel reservation ${req.body.bookingKey}:  ${e.message}`);

    return res.status(400).send({message: `Couldn\'t cancel reservation  with error ${e.message}.`});
  }

}

async function createRoom (req, res) {
  
  const path = `/api/rooms`;
  const options = {
    url: `${services.business.url}${path}`,
    headers: {
      accept: 'application/json',
      api_key: req.headers.api_key,
      authorization: req.headers.authorization,
      userId: req.headers.userId
    },
    body: req.body,
    json: true
  };

  try {
    const createdRoom = await request.post(options);

    await Log.create({ path, statusCode: 200, response: createdRoom, userId: req.headers.userId, payload: req.body });

    return res.status(200).send(createdRoom);
  }
  catch (error) {
    const e = parseError(error);

    await Log.create({ path, statusCode: e.code, response: error.error, userId: req.headers.userId, payload: req.body });

    console.log(`Error while trying to create room ${req.body.name}:  ${e.message}`);

    return res.status(400).send({message: `Couldn\'t create room with error ${e.message}.`});
  }

}

async function createTraveller (req, res) {
  
  const path = `/api/travellers`;
  const options = {
    url: `${services.business.url}${path}`,
    headers: {
      accept: 'application/json',
      api_key: req.headers.api_key,
      authorization: req.headers.authorization,
      userId: req.headers.userId
    },
    body: req.body,
    json: true
  };

  try {
    const createdTraveller = await request.post(options);

    await Log.create({ path, statusCode: 200, response: createdTraveller, userId: req.headers.userId, payload: req.body });

    return res.status(200).send(createdTraveller);
  }
  catch (error) {
    const e = parseError(error);

    await Log.create({ path, statusCode: e.code, response: error.error, userId: req.headers.userId, payload: req.body });

    console.log(`Error while trying to create traveller ${req.body.email}:  ${e.message}`);

    return res.status(400).send({message: `Couldn\'t create traveller  with error ${e.message}.`});
  }

}

module.exports = {
  makeReservation,
  abortReservation,
  createRoom,
  createTraveller,

}