# API Reference & Documentation

Base URL: `http://localhost:5000/api`

## Authentication (`/auth`)
- `POST /auth/send-otp` - Send SMS OTP to farmer mobile.
- `POST /auth/verify-otp` - Verify OTP and receive JWT.
- `POST /auth/register` - Create farmer user.

## Farmer & Farms (`/farmers`)
- `GET /farmers/profile` - Get logged-in farmer profile.
- `PUT /farmers/profile` - Update profile & land info.
- `GET /farmers/farms` - List registered farms.

## Crops (`/crops`)
- `GET /crops` - List crops for farmer.
- `POST /crops` - Register a new crop season.
- `GET /crops/:id` - Crop detail view.

## AI Endpoints (`/ai`)
- `POST /ai/crop-advisory` - Get tailored advice for crop stage.
- `POST /ai/detect-disease` - Vision plant disease scan.
- `POST /ai/chat` - Conversational agri assistant.
