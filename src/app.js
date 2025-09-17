//imports 
import express from "express";
import cors from "cors";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);


export default app;