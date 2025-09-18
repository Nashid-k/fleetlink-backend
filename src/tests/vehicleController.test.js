import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addVehicle } from '../controllers/vehicleController.js';
import Vehicle from '../models/Vehicle.js';

vi.mock('../models/Vehicle.js');

describe('Vehicle Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    vi.clearAllMocks();
  });

  describe('addVehicle', () => {
    it('creates a new vehicle', async () => {
      const mockVehicle = { _id: '1', name: 'Truck A', capacityKg: 1000, tyres: 6 };
      req.body = { name: 'Truck A', capacityKg: 1000, tyres: 6 };
      Vehicle.create.mockResolvedValue(mockVehicle);

      await addVehicle(req, res);

      expect(Vehicle.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockVehicle);
    });

    it('returns 400 if missing fields', async () => {
      req.body = { name: 'Truck A' }; 
      await addVehicle(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Fill all details' });
    });

    it('handles errors', async () => {
      req.body = { name: 'Truck A', capacityKg: 1000, tyres: 6 };
      Vehicle.create.mockRejectedValue(new Error('DB error'));
      await addVehicle(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });
});
