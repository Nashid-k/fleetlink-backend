import mongoose, { Schema } from "mongoose";

const vehicleSchema = new mongoose.Schema({
    name: {
        type:String,
        requried:true
    },
    capacityKg:{
        type:Number,
        requried:true
    },
    tyres:{
        type:Number,
        requried:true
    }
},{timestamps:true})


export default mongoose.model("Vehicle", vehicleSchema);