const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['CUSTOMER', 'ADMIN'] },
  email: { type: String },
  name: { type: String },
  token: { type: String }
}, { timestamps: true });

const userModel = model('User', UserSchema);

module.exports =  userModel;