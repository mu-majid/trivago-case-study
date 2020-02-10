const { Schema, model } = require('mongoose')

const LogSchema = new Schema({
  userId: { type: Schema.Types.Mixed },
  method: { type: String },
  status: { type: String },
  path: { type: String },
  statusCode: { type: Number },
  response: { type: Schema.Types.Mixed },
  payload: { type: Schema.Types.Mixed }

}, { timestamps: true });

const logModel = model('Log', LogSchema);

module.exports =  logModel;