const { Schema, model } = require('mongoose')

const LogSchema = new Schema({
  userId: { type: Schema.Types.Mixed },
  path: { type: String },
  statusCode: { type: Number },
  response: { type: Schema.Types.Mixed },
  payload: { type: Schema.Types.Mixed }

}, { timestamps: true });

const logModel = model('Log', LogSchema);

module.exports =  logModel;