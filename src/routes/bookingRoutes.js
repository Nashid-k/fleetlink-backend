import express from "express";
import {bookVehicle} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", bookVehicle);

export default router;