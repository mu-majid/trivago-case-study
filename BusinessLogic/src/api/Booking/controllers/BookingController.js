const express = require('express');
const bookingService = require('../services/BookingService');

const travellerService = require('../../Traveller/services/TravellerService');
const roomService = require('../../Room/services/RoomService');


async function makeReservation (req, res) {

  const { travellerKey, roomKey } = req.body;
  const requestingUser = req.headers['userid'];

  if (!(travellerKey && roomKey)) {
    return res.status(400).send({
      message: 'Both room key and traveller key are required to make reservation.'
    });
  }

  try {
    const foundTraveller = await travellerService.findOne(travellerKey);
    const foundRoom = await roomService.findOne(roomKey);

    if (!(foundRoom && foundTraveller)) {
      return res.status(404).send({ message: 
        `Could Not find ${foundRoom ? 'Traveller': (foundTraveller ? 'Room' : 'Either Room or Traveller ')} \
        with provided Key(s) ${foundRoom ? travellerKey: (foundTraveller ? roomKey : '.')}` 
      });
    }
    
    // should i check if same traveller booked the same room before ???
    if (foundRoom.availableAmount < 1) {
      // Conflict
      return res.status(409).send({ message: 
        `Could Not Book Room ${foundRoom.roomName} because all are already booked.` 
      });
    }

    const bookingCreated = await bookingService.bookRoom(foundTraveller, foundRoom, requestingUser);

    return res.status(201).send({ data: bookingCreated });
  }
  catch (error) {
    console.log('bookingService ERROR: ', error);
    return res.status(400).send(new Error('Error While Making Reservation!'));
  }
}

async function abortReservation(req, res) {
  const { bookingKey } = req.params;
  const requestingUser = req.headers['userid'];

  try {
    const foundBooking = await bookingService.findOne(bookingKey, requestingUser);

    if (!foundBooking) {
      return res.status(404).send({ message: 
        `Could Not find reservation ${bookingKey}.` 
      });
    }

    if (!foundBooking.active) {
      // conflict
      return res.status(409).send({ message: 
        `Could Not cancel reservation ${bookingKey} because it is already cancelled.` 
      });
    }

    const cancelledBooking = await bookingService.cancelReservation(foundBooking, requestingUser);
    // No Content 204 (entity),?? Just a message
    return res.status(200).send({
      message: `Reservation ${cancelledBooking.bookingKey} has been cancelled successfully.`
    });
  }
  catch (error) {
    console.log('bookingService ERROR: ', error);
    return res.status(400).send(new Error('Error While Cancelling Reservation!'));
  }
}

module.exports = {
  makeReservation,
  abortReservation
};