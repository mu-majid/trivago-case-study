const { Schema, model } = require('mongoose')

const RoomSchema = new Schema({
  roomName: { type: String, required: true },
  roomKey: { type: String, required: true, unique: true },
  requiredPoints: { type: Number, default: 0 },
  availableAmount: { type: Number, default: 1 },
}, { timestamps: true });

const roomModel = model('Room', RoomSchema);

module.exports =  roomModel;