const { Schema, model } = require('mongoose')

const ConsumerSchema = new Schema({
  api_key: { type: String, required: true },
  type: { type: String, required: true, enum: ['public', 'private'] },

}, { timestamps: true });

const consumerModel = model('Consumer', ConsumerSchema);

module.exports =  consumerModel;



