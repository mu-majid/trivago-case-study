const { Schema, model } = require('mongoose')

const TravellerSchema = new Schema({
  email: { type: String, required: true },
  travellerKey: { type: String, required: true },
  bonusPoints: { type: Number, default: 0 }
}, { timestamps: true });

const travellerModel = model('Traveller', TravellerSchema);

module.exports =  travellerModel;