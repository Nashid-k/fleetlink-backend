# FleetLink

A robust backend API for vehicle booking and management system built with Node.js, Express, and MongoDB.

## Features

- Add new vehicles to the fleet
- Get available vehicles for booking based on criteria
- Book vehicles with customer details
- View customer booking history
- Cancel existing bookings
- Comprehensive error handling and validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Testing**: Vitest
- **Environment Management**: dotenv

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory and add your configuration:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

## Running the Server

**Development mode** (with auto-restart):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Vehicles Management

- `POST /vehicles` - Add a new vehicle to the fleet
  - Requires: vehicle details (type, capacity, pincode, etc.)

### Booking Operations

- `GET /bookings/available` - Get available vehicles for booking
  - Query parameters:
    - `capacityRequired` - Minimum capacity needed
    - `fromPincode` - Starting location pincode
    - `toPincode` - Destination pincode
    - `startTime` - Booking start time (ISO format)

- `POST /bookings` - Create a new booking
  - Requires: customer details, vehicle ID, booking timeframe

- `GET /bookings` - Get customer bookings
  - Query parameter: `customerId` - ID of the customer

- `DELETE /bookings/:id` - Cancel a booking
  - Path parameter: `id` - Booking ID to cancel

## Testing

**Run all tests**:

```bash
npm run test
```

**Run tests in watch mode** (development):

```bash
npm run test:watch
```

**Generate test coverage report**:

```bash
npm run test:coverage
```

## Project Structure

```
src/
  ├── controllers/     # Route handlers
  ├── models/         # MongoDB models
  ├── routes/         # Express routes
  ├── middleware/     # Custom middleware
  ├── utils/          # Utility functions
  └── tests/          # Test files
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Resource created
- `400` - Bad request (validation errors)
- `404` - Resource not found
- `500` - Internal server error

## License

MIT License - feel free to use this project for learning and development purposes.
