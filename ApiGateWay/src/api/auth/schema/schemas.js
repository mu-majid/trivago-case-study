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

module.exports = {
  makeReservationSchema,
  cancelReservationSchema
}