import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addVehicle } from '../controllers/vehicleController.js';
import Vehicle from '../models/Vehicle.js';

vi.mock('../models/Vehicle.js');

describe('Vehicle Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    vi.clearAllMocks();
  });

  describe('addVehicle', () => {
    it('should create a new vehicle', async () => {
      const mockVehicle = {
        _id: '1',
        name: 'Truck A',
        capacityKg: 1000,
        tyres: 6
      };

      mockReq.body = {
        name: 'Truck A',
        capacityKg: 1000,
        tyres: 6
      };

      Vehicle.create.mockResolvedValue(mockVehicle);

      await addVehicle(mockReq, mockRes);

      expect(Vehicle.create).toHaveBeenCalledWith({
        name: 'Truck A',
        capacityKg: 1000,
        tyres: 6
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockVehicle);
    });

    it('should return 400 if missing required fields', async () => {
      mockReq.body = {
        name: 'Truck A'
        // Missing capacityKg and tyres
      };

      await addVehicle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Fill all details' });
    });

    it('should handle errors', async () => {
      mockReq.body = {
        name: 'Truck A',
        capacityKg: 1000,
        tyres: 6
      };

      Vehicle.create.mockRejectedValue(new Error('Database error'));

      await addVehicle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
});