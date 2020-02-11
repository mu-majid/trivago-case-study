const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const TravellerSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  travellerKey: { type: String, required: true, unique: true },
  bonusPoints: { type: Number, default: 0 }
}, { timestamps: true });

TravellerSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

const travellerModel = model('Traveller', TravellerSchema);

module.exports =  travellerModel;