import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    vehicleId:{
        type:mongoose.Schema.Types.ObjectId, ref:"Vehicle",
        required:true
    },
    fromPincode:{
        type:Number,
        required:true
    },
    toPincode:{
        type:Number,
        required:true
    },
    startTime:{
        type:Date,
        required:true
    },
    endTime:{
        type:Date,
        required:true
    },
    customerId:{
        type:String,
        required:true
    }
},{timestamps:true})


export default mongoose.model("Booking", bookingSchema);