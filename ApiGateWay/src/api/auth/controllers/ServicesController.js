const request = require('request-promise-native');
const { createHmac } = require('crypto');
const Log = require('../models/Log');
const Consumer = require('../models/Consumer');

const uuid = require('uuid');
const User = require('../models/User');

const { services, publicKeySecret, roles } = require('../../../config/config');

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
    await Log.create({ path,
      statusCode: 200,
      method: 'POST',
      status: 'SUCCESS',
      response: reservation, 
      userId: req.headers.userId, 
      payload: req.body 
    });

    return res.status(200).send(reservation);
  }
  catch (error) {
    const e = parseError(error);

    await Log.create({ path,
      statusCode: e.code,
      method: 'POST',
      status: 'ERROR',
      response: error.error, 
      userId: req.headers.userId, 
      payload: req.body 
    });

    console.log('Error while trying to make reservation: ', e.message);

    return res.status(400).send({message: `Couldn\'t make reservation  with error ${e.message}.`});
  }

}

async function abortReservation (req, res) {
  
  const path = `/api/bookings/${req.params.bookingKey}/cancel`;
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

    await Log.create({ path,
      statusCode: 200, 
      method: 'POST',
      status: 'SUCCESS',
      response: cancelledMsg, 
      userId: req.headers.userId, 
      payload: req.body 
    });

    return res.status(200).send(cancelledMsg);
  }
  catch (error) {
    const e = parseError(error);

    await Log.create({ path, 
      statusCode: e.code,
      method: 'POST',
      status: 'ERROR',
      response: error.error, 
      userId: req.headers.userId, 
      payload: req.body 
    });

    console.log(`Error while trying to cancel reservation ${req.params.bookingKey}:  ${e.message}`);

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

    await Log.create({ path,
      statusCode: 200, 
      method: 'POST', 
      status: 'SUCCESS',
      response: createdRoom, 
      userId: req.headers.userId, 
      payload: req.body 
    });

    return res.status(200).send(createdRoom);
  }
  catch (error) {
    const e = parseError(error);

    await Log.create({ path, 
      statusCode: e.code, 
      method: 'POST',
      status: 'ERROR',
      response: error.error, 
      userId: req.headers.userId, 
      payload: req.body 
    });

    console.log(`Error while trying to create room ${req.body.roomName}:  ${e.message}`);

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
    
    await Log.create({ path,
      statusCode: 200,
      method: 'POST',
      status: 'SUCCESS',
      response: createdTraveller,
      userId: req.headers.userId,
      payload: req.body 
    });
    const token = uuid.v4();

    await User.create({ 
      email: createdTraveller.data.email, 
      userId: createdTraveller.data.travellerKey, 
      role: roles.CUSTOMER,
      name: createdTraveller.data.name,
      token
    });

    const userPublicToken = createHmac('SHA256', publicKeySecret).update(token).digest('base64');
    await Consumer.create({
      api_key: userPublicToken,
      type: 'public'
    });

    createdTraveller.data.token = userPublicToken;
    return res.status(200).send(createdTraveller);
  }
  catch (error) {
    const e = parseError(error);

    await Log.create({ path,
      statusCode: e.code,
      method: 'POST',
      status: 'ERROR',
      response: error.error,
      userId: req.headers.userId,
      payload: req.body 
    });

    console.log(`Error while trying to create traveller ${req.body.email}:  ${e.message}`);

    return res.status(400).send({message: `Couldn\'t create traveller  with error ${e.message}.`});
  }

}

async function updateTravellerPoints (req, res) {
  const path = `/api/travellers/${req.params.travellerKey}/points`;
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
    const createdTraveller = await request.put(options);
    await Log.create({ path,
      statusCode: 200,
      method: 'PUT',
      status: 'SUCCESS',
      response: createdTraveller,
      userId: req.headers.userId,
      payload: req.body 
    });

    return res.status(200).send(createdTraveller);
  }
  catch (error) {
    const e = parseError(error);

    await Log.create({ path,
      statusCode: e.code,
      method: 'PUT',
      status: 'ERROR',
      response: error.error,
      userId: req.headers.userId,
      payload: req.body 
    });

    console.log(`Error while trying to update traveller ${req.body.email} bonus points:  ${e.message}`);

    return res.status(400).send({message: `Couldn\'t update traveller bonus points with error ${e.message}.`});
  }
}

async function getTravelerBookings (req, res) {
  const path = `/api/bookings`;
  const options = {
    url: `${services.business.url}${path}`,
    headers: {
      accept: 'application/json',
      api_key: req.headers.api_key,
      authorization: req.headers.authorization,
      userId: req.headers.userId
    },
    json: true
  };

  try {
    const bookings = await request.get(options);

    await Log.create({ path,
      statusCode: 200, 
      method: 'GET', 
      status: 'SUCCESS',
      response: bookings, 
      userId: req.headers.userId, 
      payload: req.body 
    });

    return res.status(200).send(bookings);
  }
  catch (error) {
    const e = parseError(error);

    await Log.create({ path, 
      statusCode: e.code, 
      method: 'GET',
      status: 'ERROR',
      response: error.error, 
      userId: req.headers.userId, 
      payload: req.body 
    });

    console.log(`Error while trying to fetch traveller ${req.headers.userId} bookings. :  ${e.message}`);

    return res.status(400).send({message: `Couldn\'t fetch traveller ${req.headers.userId} bookings error ${e.message}.`});
  }
}

async function getRooms (req, res) {
  
  const path = `/api/rooms`;
  const options = {
    url: `${services.business.url}${path}`,
    headers: {
      accept: 'application/json',
      api_key: req.headers.api_key,
      authorization: req.headers.authorization,
      userId: req.headers.userId
    },
    json: true
  };

  try {
    const rooms = await request.get(options);

    await Log.create({ path,
      statusCode: 200, 
      method: 'GET', 
      status: 'SUCCESS',
      response: rooms, 
      userId: req.headers.userId, 
      payload: req.body 
    });

    return res.status(200).send(rooms);
  }
  catch (error) {
    const e = parseError(error);

    await Log.create({ path, 
      statusCode: e.code, 
      method: 'GET',
      status: 'ERROR',
      response: error.error, 
      userId: req.headers.userId, 
      payload: req.body 
    });

    console.log(`Error while trying to get all rooms:  ${e.message}`);

    return res.status(400).send({message: `Couldn\'t get all rooms with error ${e.message}.`});
  }
}

async function getTraveller (req, res) {
  const path = `/api/travellers/${req.params.travellerKey}`;
  const options = {
    url: `${services.business.url}${path}`,
    headers: {
      accept: 'application/json',
      api_key: req.headers.api_key,
      authorization: req.headers.authorization,
      userId: req.headers.userId
    },
    json: true
  };

  try {
    const traveller = await request.get(options);

    await Log.create({ path,
      statusCode: 200, 
      method: 'GET', 
      status: 'SUCCESS',
      response: traveller, 
      userId: req.headers.userId, 
      payload: req.body 
    });

    return res.status(200).send(traveller);
  }
  catch (error) {
    const e = parseError(error);

    await Log.create({ path, 
      statusCode: e.code, 
      method: 'GET',
      status: 'ERROR',
      response: error.error, 
      userId: req.headers.userId, 
      payload: req.body 
    });

    console.log(`Error while trying to get traveller ${req.params.travellerKey}:  ${e.message}`);

    return res.status(400).send({message: `Couldn\'t get all traveller ${req.params.travellerKey} with error ${e.message}.`});
  }
}


module.exports = {
  makeReservation,
  abortReservation,
  createRoom,
  createTraveller,
  updateTravellerPoints,
  getTravelerBookings,
  getRooms,
  getTraveller
}