# Bitespeed Backend Task

A Node.js + Express backend for contact identification and linking, built for the Bitespeed engineering challenge.  
This service provides an API endpoint to identify and merge user contacts based on email and/or phone number, storing data in a Supabase PostgreSQL database.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Local Development](#setup--local-development)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Sample Requests](#sample-requests)
- [Submission Details](#submission-details)

## Overview

This backend service exposes a REST API to:
- Identify contacts by email and/or phone number
- Link contacts as primary or secondary based on matching logic
- Return all linked emails and phone numbers for a user

## Features

- **POST `/identify`**: Main endpoint for contact identification and linking
- **Express.js**: Fast, minimalist backend framework
- **Supabase PostgreSQL**: Managed relational database
- **Environment-based configuration**: Secure credentials via environment variables
- **Production-ready deployment**: Hosted on Render

## Tech Stack

- **Node.js** (v18+)
- **Express.js**
- **PostgreSQL** (Supabase)
- **pg** (Postgres client)
- **dotenv** (environment variable management)
- **Render** (deployment)

## Setup & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SekharSunkara6/Bitespeed-Backend-Task.git
   cd Bitespeed-Backend-Task
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory:
   ```
   PGUSER=your_pg_user
   PGPASSWORD=your_pg_password
   PGHOST=your_pg_host
   PGDATABASE=your_pg_database
   PGPORT=5432
   ```

4. **Start the server locally:**
   ```bash
   npm run dev
   ```
   The server runs at [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env` file with the following keys (replace values with your actual credentials):

```env
PGUSER=postgres
PGPASSWORD=your_supabase_password
PGHOST=your_supabase_host
PGDATABASE=postgres
PGPORT=5432
```

## API Documentation

### **POST `/identify`**

**Description:**  
Identify and link contacts by email and/or phone number.

**Request Body:**
```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```
- At least one of `email` or `phoneNumber` is required.

**Response:**
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

**Error Responses:**
- `400 Bad Request` if both email and phone number are missing.
- `500 Internal Server Error` for unexpected issues.

## Database Schema

**Table: `contact`**

| Column         | Type      | Description                                  |
|----------------|-----------|----------------------------------------------|
| id             | integer   | Primary key                                  |
| phoneNumber    | text      | Phone number                                 |
| email          | text      | Email address                                |
| linkedId       | integer   | Points to primary contact (if secondary)     |
| linkPrecedence | text      | 'primary' or 'secondary'                     |
| createdAt      | timestamp | When the contact was created                 |
| updatedAt      | timestamp | When the contact was last updated            |
| deletedAt      | timestamp | If deleted, when                             |

## Deployment

This project is deployed on [Render](https://render.com/).

**Production URL:**  
`https://bitespeed-backend-task-mnst.onrender.com/`

- The root (`/`) route returns a health check message.
- The `/identify` endpoint is available for POST requests.

## Sample Requests

**POST `/identify`**

```bash
curl -X POST https://bitespeed-backend-task-mnst.onrender.com/identify \
  -H "Content-Type: application/json" \
  -d '{"email":"mcfly@hillvalley.edu","phoneNumber":"123456"}'
```

**Sample Response**
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

## Submission Details

- **Github Repository Link:** [https://github.com/yourusername/Bitespeed-Backend-Task](https://github.com/yourusername/Bitespeed-Backend-Task)
- **Hosted Endpoint:** [https://bitespeed-backend-task-mnst.onrender.com/](https://bitespeed-backend-task-mnst.onrender.com/)

## Notes

- This is a backend API only; no frontend/UI is provided.
- Use Postman, curl, or similar tools to interact with the API.
- For questions or issues, please contact [sekharsunkara2002@gmail.com].
