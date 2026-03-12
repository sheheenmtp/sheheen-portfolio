# Portfolio Backend

This is the backend service for the portfolio contact form. It handles email sending securely on the server side, preventing exposure of email credentials in the frontend code.

## Features

- Secure email sending via Nodemailer
- Input validation for all fields
- Email format validation
- Rate limiting to prevent spam
- CORS support
- Error handling and logging

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

3. For Gmail users:
   - Enable 2-factor authentication on your Google account
   - Generate an App Password at https://myaccount.google.com/apppasswords
   - Use the App Password as `EMAIL_PASS` (not your regular Gmail password)

4. Start the server:
   ```bash
   npm start
   ```

## Development

- `npm start` - Start the server
- `npm run dev` - Start the server with nodemon for development

## API Endpoints

### GET /
Health check endpoint

**Response:**
```json
{
  "message": "Portfolio backend server is running!"
}
```

### POST /send-email
Send an email through the contact form

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Message sent successfully!"
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "message": "Missing required fields: name, email, message"
}
```

**Response (Email Error):**
```json
{
  "success": false,
  "message": "Failed to send message. Please try again later."
}
```

## Security

- Email credentials are stored in environment variables
- Rate limiting prevents spam (5 requests per IP per minute)
- Input validation prevents injection attacks
- CORS is configured for security