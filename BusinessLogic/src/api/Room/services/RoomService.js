const Room = require('../models/Room');
const uuid = require('uuid');

async function updateOne(roomKey, updateObj) {
  // find and update query
  let updatedRoom = await Room.findOneAndUpdate(
    { roomKey },
    updateObj,
    {
      omitUndefined: true,
      new: true,
      runValidators: true,
      context: 'query'
    }
  ).lean().exec();

  return updatedRoom;
}


async function findOne(roomKey) {
  const room = await Room.findOne({ roomKey }).lean().exec();

  return room;
}

async function create(data) {
  data.roomKey = uuid.v4();
  const createdRoom = await Room.create(data);

  return {
    roomKey: createdRoom.roomKey,
    roomName: createdRoom.roomName,

    requiredPoints: createdRoom.requiredPoints,
    availableAmount: createdRoom.availableAmount
  }
}

module.exports = {
  updateOne,
  findOne,
  create
}