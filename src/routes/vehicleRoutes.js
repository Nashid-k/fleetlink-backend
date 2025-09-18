import express from "express";
import {addVehicle} from "../controllers/vehicleController.js";
import {getAvailableVehicles} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", addVehicle);
router.get("/available", getAvailableVehicles);



export default router;