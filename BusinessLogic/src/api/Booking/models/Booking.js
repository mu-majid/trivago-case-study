const { Schema, model } = require('mongoose');

const BookingSchema = new Schema({
  bookingKey: {type: String, required: true, unique: true },
  travellerKey: { type: String, required: true },
  roomKey: { type: String, required: true },
  status: { type: String, enum: ['RESERVED', 'PENDING_APPROVAL', 'CANCELLED'] },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const bookingModel = model('Booking', BookingSchema);

module.exports =  bookingModel;