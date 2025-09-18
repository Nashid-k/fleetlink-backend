// routes/booking.js
import express from "express";
import { bookVehicle, getBookings, deleteBooking } from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", bookVehicle);
router.get("/", getBookings);
router.delete("/:id", deleteBooking);

export default router;