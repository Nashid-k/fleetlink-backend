import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import {calculateDuration} from "../utils/calculateDuration.js";

export const getAvailableVehicles = async (req, res) => {
    try {
        const {capacityRequired, fromPincode, toPincode, startTime} = req.query;

        const start = new Date(startTime);
        const duration = calculateDuration(fromPincode, toPincode);
        const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

        const vehicles = await Vehicle.find({capacityKg:{$gte:capacityRequired}});
        const bookings = await Booking.find({
            $or:[
                {startTime: {$lt: end}, endTime:{ $gt: start}}
            ]
        });

        const bookedIds = bookings.map(b => b.vehicleId.toString());
        const available = vehicles.filter(v => !bookedIds.includes(v._id.toString()));

        res.status(200).json({available, estimateRideDurationHours:duration})
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}


export const bookVehicle = async (req, res) => {
    try {
        const {vehicleId, fromPincode, toPincode, startTime, customerId} = req.body;

        const vehicle = await Vehicle.findById(vehicleId);
        if(!vehicle) return res.status(404).json({messge:"Vehicle not found"});

        const start = new Date(startTime);
        const duration = calculateDuration(fromPincode, toPincode);
        const end = new Date(start.getTime() + 60 * 60 * 1000);

        const conflict = await Booking.findOne({
            vehicleId,
            $or:[{startTime: {$lt: end}, endTime:{ $gt: start}}]
        });

        if(conflict) return res.status(400).json({messge:"Vehicle already booked"});

        const booking = await Booking.create({
            vehicleId,
            fromPincode,
            toPincode,
            startTime : start,
            endTime : end,
            customerId
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}