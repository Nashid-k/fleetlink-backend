import Vehicle from "../models/Vehicle.js";


export const addVehicle = async (req, res) => {
   try {
    const {name, capacityKg, tyres} = req.body;
    if(!name || !capacityKg || !tyres) {
        return res.status(400).json({message:"Fill all details"});
    }
    const vehicle = await Vehicle.create({
        name,
        capacityKg,
        tyres
    })
    res.status(201).json(vehicle);
   } catch (error) {
    res.status(500).json({message:error.message})
   }
}