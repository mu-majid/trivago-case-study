const express = require('express');
const roomCtrl = express.Router();

const roomService = require('../services/RoomService');



async function createRoom (req, res) {
  const roomData = req.body;
  if (!(roomData.roomName && roomData.requiredPoints && roomData.availableAmount)) {
    return res.status(400).send({ message: '(name, requiredPoints, availableAmount) Are Required!' });
  }
  try {
    const createdRoom = await roomService.create(roomData);    

    return res.status(201).send({ data: createdRoom });
  }
  catch (error) {
    console.log('roomService ERROR: ', error);
    return res.status(400).send(new Error('Error While Creating Room!'));
  }
}

async function getRooms (req, res) {

  try {
    const foundRooms = await roomService.find();    

    return res.status(200).send({ data: foundRooms });
  }
  catch (error) {
    console.log('roomService ERROR: ', error);
    return res.status(400).send(new Error('Error While Fetching Rooms!'));
  }
}

module.exports = {
  createRoom,
  getRooms
};