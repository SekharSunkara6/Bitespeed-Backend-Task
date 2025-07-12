# Bitespeed Backend Task: Identity Reconciliation

## Overview

This project implements the backend for Bitespeed’s identity reconciliation challenge.  
It provides a RESTful API endpoint `/identify` that links customer contacts (email/phone) to unique identities, even when customers use different details across orders.

## Features

- **POST /identify**: Accepts an email and/or phone number, and returns the consolidated contact record.
- **Primary/secondary contact logic**: Links all related contacts, ensuring the oldest is always the primary.
- **SQL database**: Uses PostgreSQL for persistent storage.

## Tech Stack

- **Backend**: Node.js (Express)
- **Database**: PostgreSQL

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/SekharSunkara6/Bitespeed-Backend-Task.git
cd Bitespeed-Backend-Task
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Database

- Ensure PostgreSQL is running.
- Create the database and the `contact` table:

```sql
CREATE DATABASE bitespeed;

\c bitespeed

CREATE TABLE contact (
  id SERIAL PRIMARY KEY,
  phonenumber VARCHAR(20),
  email VARCHAR(255),
  linkedid INT,
  linkprecedence VARCHAR(10) CHECK (linkprecedence IN ('primary', 'secondary')),
  createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deletedat TIMESTAMP
);
```

- Update `db.js` with your PostgreSQL credentials if needed.

### 4. Run the Application

```bash
npm run dev
```

The server will start on [http://localhost:3000](http://localhost:3000).

## API Usage

### POST `/identify`

#### **Request Body**

```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```
- Either `email`, `phoneNumber`, or both must be provided.

#### **Response Example**

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

#### **Other Valid Request Examples**

```json
{ "email": "mcfly@hillvalley.edu" }
{ "phoneNumber": "123456" }
{ "email": "lorraine@hillvalley.edu" }
```

## Example cURL Request

```bash
curl -X POST https://your-deployed-url.onrender.com/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "mcfly@hillvalley.edu", "phoneNumber": "123456"}'
```

## Deployment

The app is deployed at:  
**[https://your-deployed-url.onrender.com](https://your-deployed-url.onrender.com)**

You can test the `/identify` endpoint using the deployed URL.

## Project Structure

```
.
├── db.js
├── index.js
├── package.json
├── README.md
└── ...
```

## Notes

- Only JSON request bodies are supported.
- Table and column names are all lowercase as per PostgreSQL conventions.
- The service is idempotent: repeated requests with the same data yield the same result.

**Replace `https://your-deployed-url.onrender.com` with your actual deployed URL after deployment!**

If you need help with deployment or have any other questions, just ask! 🚀
