import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import { calculateDuration } from "../utils/calculateDuration.js";

export const getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

   
    const capacity = Number(capacityRequired);
    const fromPin = Number(fromPincode);
    const toPin = Number(toPincode);

    const start = new Date(startTime);
    const duration = calculateDuration(fromPin, toPin);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    const vehicles = await Vehicle.find({ capacityKg: { $gte: capacity } });
    const bookings = await Booking.find({
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    const bookedIds = bookings.map(b => b.vehicleId.toString());
    const available = vehicles.filter(v => !bookedIds.includes(v._id.toString()));
    
    const availableWithDuration = available.map(vehicle => ({
      ...vehicle.toObject(),
      estimatedRideDurationHours: duration
    }));

    res.status(200).json({ available: availableWithDuration })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const bookVehicle = async (req, res) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const start = new Date(startTime);
    const duration = calculateDuration(fromPincode, toPincode);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    const conflict = await Booking.findOne({
      vehicleId,
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }]
    });

    if (conflict) return res.status(400).json({ message: "Vehicle already booked" });

    const booking = await Booking.create({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      customerId
    });
    
 
    await booking.populate('vehicleId');
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getBookings = async (req, res) => {
  try {
    const { customerId } = req.query;
    const bookings = await Booking.find({ customerId }).populate('vehicleId').sort({ startTime: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}