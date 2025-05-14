# Movie Theater Management System API

A RESTful API for managing a movie theater system, built with Node.js, Express.js, and MongoDB.

## Features

- User authentication and authorization
- Movie management
- Booking management
- Score system for members
- Role-based access control
- Swagger API documentation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-theater
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/movie_theater
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

The server will start on http://localhost:3000

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
http://localhost:3000/api-docs

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user profile

### Movies
- GET /api/movies - Get all movies
- GET /api/movies/:id - Get movie by ID
- POST /api/movies - Create a new movie (Admin only)
- PUT /api/movies/:id - Update a movie (Admin only)
- DELETE /api/movies/:id - Delete a movie (Admin only)

### Bookings
- GET /api/bookings - Get all bookings (Admin/Employee only)
- GET /api/bookings/user - Get user's bookings
- POST /api/bookings - Create a new booking
- PUT /api/bookings/:id - Update booking status (Admin/Employee only)

## User Roles

- Admin: Full access to all features
- Employee: Can manage bookings and view movies
- Member: Can book tickets and view movies

## Score System

- Members earn 10% of their booking amount as score
- Score can be used to pay for tickets
- Score is refunded if booking is cancelled

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security

- Passwords are hashed using bcrypt
- JWT authentication
- Role-based access control
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 