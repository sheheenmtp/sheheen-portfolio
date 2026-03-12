# Portfolio Backend Deployment Guide

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Update the `.env` file with your email credentials:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   PORT=3001
   ```

3. **For Gmail Users**:
   - Enable 2-factor authentication on your Google account
   - Generate an App Password at https://myaccount.google.com/apppasswords
   - Use the App Password as EMAIL_PASS (not your regular Gmail password)

4. **Start the Server**:
   ```bash
   npm start
   ```

## Deployment Options

### Option 1: Deploy to Render (Free Tier Available)
1. Create an account at https://render.com
2. Connect your GitHub repository
3. Set up a Web Service with the following settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: Add EMAIL_USER and EMAIL_PASS from your .env file

### Option 2: Deploy to Railway (Free Tier Available)
1. Create an account at https://railway.app
2. Create a new project and connect your GitHub repository
3. Add environment variables in the Railway dashboard
4. Deploy!

### Option 3: Deploy to Vercel (Functions)
Instead of a separate backend, you could create a serverless function in your frontend project:
1. Create a new file at `/api/contact.js` in your frontend project
2. Implement the nodemailer code there
3. Call the function at `/api/contact` from your frontend

## Testing Locally
1. Start the server: `npm start`
2. Test the endpoint with curl:
   ```bash
   curl -X POST http://localhost:3001/send-email \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","message":"Hello World"}'
   ```

## Security Considerations
- Never commit actual credentials to version control
- Use environment variables for all secrets
- Implement rate limiting (already included)
- Consider adding CORS restrictions for production