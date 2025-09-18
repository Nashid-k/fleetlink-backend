import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAvailableVehicles, bookVehicle, getBookings, deleteBooking } from '../controllers/bookingController.js';
import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import { calculateDuration } from '../utils/calculateDuration.js';

// Mock the models and utils
vi.mock('../models/Booking.js');
vi.mock('../models/Vehicle.js');
vi.mock('../utils/calculateDuration.js');

describe('Booking Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      query: {},
      body: {},
      params: {}
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAvailableVehicles', () => {
    it('should return available vehicles with estimated duration', async () => {
      const mockVehicles = [
        { _id: '1', name: 'Truck A', capacityKg: 1000, toObject: () => ({ _id: '1', name: 'Truck A', capacityKg: 1000 }) },
        { _id: '2', name: 'Truck B', capacityKg: 2000, toObject: () => ({ _id: '2', name: 'Truck B', capacityKg: 2000 }) }
      ];

      const mockBookings = [
        { vehicleId: { toString: () => '1' } }
      ];

      mockReq.query = {
        capacityRequired: '500',
        fromPincode: '100001',
        toPincode: '100020',
        startTime: '2024-01-01T10:00:00Z'
      };

      Vehicle.find.mockResolvedValue(mockVehicles);
      Booking.find.mockResolvedValue(mockBookings);
      calculateDuration.mockReturnValue(5);

      await getAvailableVehicles(mockReq, mockRes);

      expect(Vehicle.find).toHaveBeenCalledWith({ capacityKg: { $gte: 500 } });
      expect(Booking.find).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        available: expect.arrayContaining([
          expect.objectContaining({
            _id: '2',
            estimatedRideDurationHours: 5
          })
        ])
      });
    });

    it('should handle errors', async () => {
      mockReq.query = {
        capacityRequired: '500',
        fromPincode: '100001',
        toPincode: '100020',
        startTime: '2024-01-01T10:00:00Z'
      };

      Vehicle.find.mockRejectedValue(new Error('Database error'));

      await getAvailableVehicles(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('bookVehicle', () => {
    it('should successfully book a vehicle', async () => {
      const mockVehicle = { _id: '1', name: 'Truck A' };
      const mockBooking = {
        _id: 'booking1',
        vehicleId: mockVehicle,
        populate: vi.fn().mockResolvedValue({
          _id: 'booking1',
          vehicleId: mockVehicle
        })
      };

      mockReq.body = {
        vehicleId: '1',
        fromPincode: '100001',
        toPincode: '100020',
        startTime: '2024-01-01T10:00:00Z',
        customerId: 'customer123'
      };

      Vehicle.findById.mockResolvedValue(mockVehicle);
      Booking.findOne.mockResolvedValue(null);
      Booking.create.mockResolvedValue(mockBooking);
      calculateDuration.mockReturnValue(5);

      await bookVehicle(mockReq, mockRes);

      expect(Vehicle.findById).toHaveBeenCalledWith('1');
      expect(Booking.findOne).toHaveBeenCalled();
      expect(Booking.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should return 404 if vehicle not found', async () => {
      mockReq.body = {
        vehicleId: 'nonexistent',
        fromPincode: '100001',
        toPincode: '100020',
        startTime: '2024-01-01T10:00:00Z',
        customerId: 'customer123'
      };

      Vehicle.findById.mockResolvedValue(null);

      await bookVehicle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Vehicle not found' });
    });

    it('should return 400 if vehicle already booked', async () => {
      const mockVehicle = { _id: '1', name: 'Truck A' };
      const mockConflict = { _id: 'conflict' };

      mockReq.body = {
        vehicleId: '1',
        fromPincode: '100001',
        toPincode: '100020',
        startTime: '2024-01-01T10:00:00Z',
        customerId: 'customer123'
      };

      Vehicle.findById.mockResolvedValue(mockVehicle);
      Booking.findOne.mockResolvedValue(mockConflict);
      calculateDuration.mockReturnValue(5);

      await bookVehicle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Vehicle already booked' });
    });
  });

  describe('getBookings', () => {
    it('should return bookings for a customer', async () => {
      const mockBookings = [
        { _id: '1', customerId: 'customer123', vehicleId: { name: 'Truck A' } }
      ];

      mockReq.query = { customerId: 'customer123' };
      Booking.find.mockReturnValue({
        populate: vi.fn().mockReturnValue({
          sort: vi.fn().mockResolvedValue(mockBookings)
        })
      });

      await getBookings(mockReq, mockRes);

      expect(Booking.find).toHaveBeenCalledWith({ customerId: 'customer123' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockBookings);
    });
  });

  describe('deleteBooking', () => {
    it('should successfully delete a booking', async () => {
      const mockBooking = { _id: '1' };

      mockReq.params = { id: '1' };
      Booking.findByIdAndDelete.mockResolvedValue(mockBooking);

      await deleteBooking(mockReq, mockRes);

      expect(Booking.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Booking cancelled successfully' });
    });

    it('should return 404 if booking not found', async () => {
      mockReq.params = { id: 'nonexistent' };
      Booking.findByIdAndDelete.mockResolvedValue(null);

      await deleteBooking(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Booking not found' });
    });
  });
});