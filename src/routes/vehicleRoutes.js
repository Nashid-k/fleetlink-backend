import express from "express";
import {addVehicle} from "../controllers/vehicleController.js";
import {getAvailableVehicle} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", addVehicle);
router.get("/available", getAvailableVehicle);



export default router;