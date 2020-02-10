const Booking = require('../models/Booking');
const uuid = require('uuid');
const request = require('request-promise-native');

const travellerService = require('../../Traveller/services/TravellerService');
const roomService = require('../../Room/services/RoomService');
const { services } = require('../../../config/config');

async function findOne(bookingKey, requestingUser) {
  const booking = await Booking.findOne({ bookingKey, travellerKey: requestingUser }).lean().exec();

  return booking;
}

async function updateOne(bookingKey, updateObj) {

  let updatedBooking = await Booking.findOneAndUpdate(
    { bookingKey },
    updateObj,
    {
      omitUndefined: true,
      new: true,
      runValidators: true,
      context: 'query'
    }
  ).lean().exec();

  if (!updatedBooking) {
    return null;
  }

  return {
    bookingKey: updatedBooking.bookingKey,
    active: updatedBooking.active,
    status: updatedBooking.status,
    roomKey: updatedBooking.roomKey,
    travellerKey: updatedBooking.travellerKey
  };
}

function canUsePoints(travellerPoints, roomRequiredPoints) {
  return {
    canBookWithPoints: (travellerPoints >= roomRequiredPoints) ? true : false,
    updatedPoints: (travellerPoints - roomRequiredPoints)
  }
}

async function auditBookingChanges (auditPayload) {
  const auditOptions = {
    url: `${services.monitoring.uri}:${services.monitoring.port}/api/audit`,
    headers:
    {
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    body: auditPayload,
    json: true
  }

  request.post(auditOptions)
    .then(() => console.log(`Audited Booking ${auditPayload.resourceId} Successfully.`))
    .catch((e) => console.log(`Failed to Audit Booking ${auditPayload.resourceId} error: ${e}`))
}

async function bookRoom (traveller, room, userId) {
  let booking;
  const { travellerKey, bonusPoints } = traveller;
  const { roomKey, requiredPoints, availableAmount, name } = room;
  const result = canUsePoints(bonusPoints, requiredPoints);

  if (result.canBookWithPoints) {
    booking = await Booking.create(
      {
        bookingKey: uuid.v4(),
        travellerKey,
        roomKey,
        status: 'RESERVED'
      }
    );
    await travellerService.updateOne(travellerKey, { bonusPoints: result.updatedPoints });
    await roomService.updateOne(roomKey, { availableAmount: (availableAmount - 1) });
  }
  else {
    booking = await Booking.create(
      {
        bookingKey: uuid.v4(),
        travellerKey,
        roomKey,
        status: 'PENDING_APPROVAL'
      }
    );
    await roomService.updateOne(roomKey, { availableAmount: (availableAmount - 1) });
  }
  const auditPayload = {
    userId,
    resource: 'Booking',
    resourceId: booking.bookingKey,
    action: 'Reservation Made',
    data: {
      msg: `Reservation made with status of ${booking.status}.`,
      roomReserved: roomKey,
      roomName: name,
      roomRequiredPoints: requiredPoints,
      currentAvailableRooms: (availableAmount - 1),

      travellerKey,
      viaPoints: result.canBookWithPoints,
      travellerCurrentPoints: (result.canBookWithPoints) ? result.updatedPoints : bonusPoints,
      pointsChange: (result.canBookWithPoints) ? `-${requiredPoints}` : null
    }
  }
  auditBookingChanges(auditPayload);

  return booking;
}

async function cancelReservation(bookingToCancel, userId) {
  const { travellerKey, roomKey, bookingKey, status } = bookingToCancel;
  const updatedBooking = await updateOne(bookingKey, { active: false , status: 'CANCELLED' });
  const updatedRoom = await roomService.updateOne(roomKey, { $inc: { availableAmount: 1 } });

  // If Dates were involved, we can increase traveller points 
  // if cancellation is within predefined period and reservation was made via points

  const auditPayload = {
    userId,
    resource: 'Booking',
    resourceId: bookingKey,
    action: 'Cancel Booking',
    data: {
      msg: `Reservation cancelled and changed status from ${status} to ${updatedBooking.status}.`,
      roomReleased: roomKey,
      travellerKey,
      roomName: updatedRoom.name,
      currentAvailableRooms: updatedRoom.availableAmount,
      previousAvailableRooms: (updatedRoom.availableAmount - 1)
    }
  }
  auditBookingChanges(auditPayload);

  return updatedBooking;
}

module.exports = {
  findOne,
  bookRoom,
  cancelReservation,
  _test: {
    canUsePoints,
    updateOne
  }
}