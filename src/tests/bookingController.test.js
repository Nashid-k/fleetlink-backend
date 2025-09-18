import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAvailableVehicles, bookVehicle, getBookings, deleteBooking } from '../controllers/bookingController.js';
import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import { calculateDuration } from '../utils/calculateDuration.js';

vi.mock('../models/Booking.js');
vi.mock('../models/Vehicle.js');
vi.mock('../utils/calculateDuration.js');

describe('Booking Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { query: {}, body: {}, params: {} };
    res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    vi.clearAllMocks();
  });

  describe('getAvailableVehicles', () => {
    it('returns available vehicles with duration', async () => {
      Vehicle.find.mockResolvedValue([{ _id: '1', name: 'Truck A', toObject: () => ({ _id: '1' }) }]);
      Booking.find.mockResolvedValue([]);
      calculateDuration.mockReturnValue(5);

      req.query = { capacityRequired: '500', fromPincode: '100001', toPincode: '100020', startTime: '2024-01-01T10:00:00Z' };
      await getAvailableVehicles(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        available: expect.arrayContaining([{ _id: '1', estimatedRideDurationHours: 5 }])
      }));
    });

    it('handles errors', async () => {
      Vehicle.find.mockRejectedValue(new Error('DB error'));
      req.query.capacityRequired = '500';
      await getAvailableVehicles(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('bookVehicle', () => {
    it('books vehicle successfully', async () => {
      Vehicle.findById.mockResolvedValue({ _id: '1' });
      Booking.findOne.mockResolvedValue(null);
      Booking.create.mockResolvedValue({ _id: 'b1', populate: vi.fn().mockResolvedValue({ _id: 'b1' }) });
      calculateDuration.mockReturnValue(5);

      req.body = { vehicleId: '1', fromPincode: '100001', toPincode: '100020', startTime: '2024-01-01T10:00:00Z', customerId: 'c1' };
      await bookVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('returns 404 if vehicle not found', async () => {
      Vehicle.findById.mockResolvedValue(null);
      req.body.vehicleId = 'x';
      await bookVehicle(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('returns 400 if vehicle already booked', async () => {
      Vehicle.findById.mockResolvedValue({ _id: '1' });
      Booking.findOne.mockResolvedValue({ _id: 'b1' });
      req.body.vehicleId = '1';
      await bookVehicle(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getBookings', () => {
    it('returns customer bookings', async () => {
      const mockPopulateSort = { sort: vi.fn().mockResolvedValue([{ _id: '1' }]) };
      Booking.find.mockReturnValue({ populate: vi.fn().mockReturnValue(mockPopulateSort) });
      req.query.customerId = 'c1';
      await getBookings(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteBooking', () => {
    it('deletes booking', async () => {
      Booking.findByIdAndDelete.mockResolvedValue({ _id: '1' });
      req.params.id = '1';
      await deleteBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('returns 404 if not found', async () => {
      Booking.findByIdAndDelete.mockResolvedValue(null);
      req.params.id = 'x';
      await deleteBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
