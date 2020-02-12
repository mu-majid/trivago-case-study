const Joi = require('joi');

const makeReservationSchema = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }),

  body: Joi.object({
    roomKey: Joi.string().required(),
    travellerKey: Joi.string().required(),
    userId: Joi.string(),
    email: Joi.string()
  }).or('userId', 'email').required()
});


const cancelReservationSchema = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }),

  params: Joi.object({
    bookingKey: Joi.string().required()
  }),

  body: Joi.object({
    userId: Joi.string(),
    email: Joi.string()
  }).or('userId', 'email').required()
});


const createTravellerSchema = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }),

  body: Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().required()
  })
});


const createRoomSchema = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }),

  body: Joi.object({
    roomName: Joi.string().required(),
    requiredPoints: Joi.number().required(),
    availableAmount: Joi.number().required(),
    email: Joi.string(),
    userId: Joi.string()
  }).or('userId', 'email').required()
});


const updateTravellerPointsSchema = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }),

  params: Joi.object({
    travellerKey: Joi.string().required()
  }),

  body: Joi.object({
    bonusPoints: Joi.number().required(),
    email: Joi.string(),
    userId: Joi.string()
  }).or('userId', 'email').required()
});

const getTravelerBookingsSchema = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }),

  query: Joi.object({
    email: Joi.string().required()
  })
});

const getRoomsSchema = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  })
});

const getTravellerSchema = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }),

  params: Joi.object({
    travellerKey: Joi.string().required()
  })
});

module.exports = {
  makeReservationSchema,
  cancelReservationSchema,
  createTravellerSchema,
  createRoomSchema,
  updateTravellerPointsSchema,
  getTravelerBookingsSchema,
  getRoomsSchema,
  getTravellerSchema
}