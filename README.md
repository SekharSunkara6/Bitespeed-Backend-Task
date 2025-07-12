# Bitespeed Backend Task

A robust Node.js + Express API for contact identification and linking, built for the Bitespeed engineering challenge.  
This backend service processes requests to identify, merge, and link user contacts by email and phone number, with all data managed in a Supabase PostgreSQL database and deployed on Render.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Using the API with Postman](#using-the-api-with-postman)
- [Data Storage in Supabase](#data-storage-in-supabase)
- [Deployment](#deployment)
- [Submission Details](#submission-details)
- [Notes](#notes)

## Project Overview

This backend exposes a REST API endpoint to:
- Identify users by email and/or phone number
- Link contacts as primary or secondary according to business logic
- Return all linked emails and phone numbers for a user

No frontend is included; this is a pure backend API intended for use with tools like Postman, curl, or integration into other services.

## Features

- **POST `/identify`**: Main endpoint for contact identification and linking
- **Express.js**: Minimal, fast Node.js backend
- **Supabase PostgreSQL**: Managed, scalable relational database
- **Environment-based configuration**: Secure, flexible deployment
- **Production deployment**: Hosted on Render for public access

## Tech Stack

- **Node.js** (v18+)
- **Express.js**
- **pg** (PostgreSQL client)
- **dotenv** (environment management)
- **Supabase** (PostgreSQL database as a service)
- **Render** (cloud deployment)
- **Postman** (for API testing and demonstration)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SekharSunkara6/Bitespeed-Backend-Task.git
cd Bitespeed-Backend-Task
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
PGUSER=your_supabase_pguser
PGPASSWORD=your_supabase_password
PGHOST=your_supabase_pooler_host
PGDATABASE=postgres
PGPORT=5432
```

*See [Environment Variables](#environment-variables) for details.*

### 4. Start the server locally

```bash
npm run dev
```

Server will run at [http://localhost:3000](http://localhost:3000).

## Environment Variables

The app uses the following environment variables (required for both local and production):

| Key         | Example Value                                    | Description                         |
|-------------|--------------------------------------------------|-------------------------------------|
| PGUSER      | your_supabase_pguser                             | Supabase pooler username            |
| PGPASSWORD  | your-supabase-password                           | Supabase database password          |
| PGHOST      | your_supabase_pooler_host                        | Supabase session pooler host        |
| PGDATABASE  | postgres                                         | Database name (default: postgres)   |
| PGPORT      | 5432                                             | Database port (default: 5432)       |

**Note:**  
- Use the **session pooler** connection details from your Supabase dashboard for Render/cloud deployments.
- Never commit your real `.env` file to version control.

## Database Schema

All contact data is stored in the `contact` table in Supabase.

| Column         | Type      | Description                                          |
|----------------|-----------|------------------------------------------------------|
| id             | integer   | Primary key for each contact                         |
| phoneNumber    | text      | User’s phone number                                  |
| email          | text      | User’s email address                                 |
| linkedId       | integer   | Points to primary contact (if this is secondary)     |
| linkPrecedence | text      | `'primary'` or `'secondary'`                         |
| createdAt      | timestamp | Row creation time                                    |
| updatedAt      | timestamp | Last update time                                     |
| deletedAt      | timestamp | Deletion time (null if not deleted)                  |

- **Primary contacts**: `linkPrecedence = 'primary'`, `linkedId = NULL`
- **Secondary contacts**: `linkPrecedence = 'secondary'`, `linkedId` points to primary contact’s `id`

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

## Using the API with Postman

You can test and interact with the API using [Postman](https://www.postman.com/):

### **Step-by-Step Guide**

1. **Open Postman** and create a new request.
2. **Set the request type** to `POST`.
3. **Enter the request URL:**
   ```
   https://bitespeed-backend-task-mnst.onrender.com/identify
   ```
4. **Go to the "Body" tab** and select `raw` and `JSON` as the format.
5. **Paste your JSON payload**, for example:
   ```json
   {
     "email": "mcfly@hillvalley.edu",
     "phoneNumber": "123456"
   }
   ```
6. **Click "Send".**
7. **View the response** in the lower section. You should see a JSON object with contact details.

**You can also use the API with `curl` or any HTTP client.**

## Data Storage in Supabase

- All contact data is securely stored in your Supabase PostgreSQL database, specifically in the `contact` table. Whenever a request is made to the `/identify` endpoint, your backend reads from and writes to this table in Supabase.  
- You can view, query, and manage the data in the `contact` table directly from your Supabase dashboard. All new contacts, updates, and links created by your API logic are reflected in this table, ensuring your data is always up to date and accessible for future API calls.

## Deployment

The backend is deployed on Render for public access.

- **Production URL:**  
  `https://bitespeed-backend-task-mnst.onrender.com/`
- **Health Check:**  
  Visiting the root URL (`/`) returns:  
  `Bitespeed Backend is running!`
- **API Endpoint:**  
  `/identify` (POST)

## Submission Details

- **Github Repository:**  
  [https://github.com/yourusername/Bitespeed-Backend-Task](https://github.com/yourusername/Bitespeed-Backend-Task)
- **Hosted Endpoint:**  
  [https://bitespeed-backend-task-mnst.onrender.com/](https://bitespeed-backend-task-mnst.onrender.com/)

## Notes

- This is a backend API only; no frontend is included.
- Use Postman, curl, or similar tools to interact with the API.
- All contact data is securely stored in Supabase and managed via the backend.
- For questions or issues, contact [sekharsunkara2002@gmail.com].
