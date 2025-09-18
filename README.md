Here’s a **simple README** you can use for your Git repo. It’s short, clear, and covers setup, usage, and testing:

````markdown
# Vehicle Booking Backend

Simple backend API for vehicle booking and management using Node.js, Express, and MongoDB.

## Features

- Add new vehicles
- Get available vehicles for booking
- Book a vehicle
- View customer bookings
- Cancel bookings

## Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- Vitest for testing

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd backend
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file and add your MongoDB connection string:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

## Running the Server

```bash
npm run dev   # for development with nodemon
npm start     # for production
```

Server runs on `http://localhost:5000` by default.

## API Endpoints

### Vehicles

* `POST /vehicles` – Add a new vehicle

### Bookings

* `GET /bookings/available?capacityRequired=&fromPincode=&toPincode=&startTime=` – Get available vehicles
* `POST /bookings` – Book a vehicle
* `GET /bookings?customerId=` – Get customer bookings
* `DELETE /bookings/:id` – Cancel a booking

## Testing

Run all tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## License

MIT

```

This is simple but **fully informative** for anyone cloning your repo.  

If you want, I can also make a **slightly fancier version with examples of request/response payloads** for clarity. Do you want me to do that?
```
