const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Bitespeed Backend is running!');
});

// Helper: Find contacts by email or phonenumber
async function findContacts(email, phoneNumber) {
  const { rows } = await pool.query(
    `SELECT * FROM contact WHERE email = $1 OR phonenumber = $2`,
    [email, phoneNumber]
  );
  return rows;
}

// Helper: Insert a new contact
async function insertContact(email, phoneNumber, linkedId, linkPrecedence) {
  // Always log what's being inserted
  console.log('Inserting:', { email, phoneNumber, linkedId, linkPrecedence });
  const { rows } = await pool.query(
    `INSERT INTO contact (email, phonenumber, linkedid, linkprecedence) VALUES ($1, $2, $3, $4) RETURNING *`,
    [email, phoneNumber, linkedId, linkPrecedence]
  );
  return rows[0];
}

// Helper: Get all contacts linked to a primary
async function getAllLinkedContacts(primaryId) {
  const { rows } = await pool.query(
    `SELECT * FROM contact WHERE id = $1 OR linkedid = $1`,
    [primaryId]
  );
  return rows;
}

// /identify endpoint
app.post('/identify', async (req, res) => {
  try {
    // Always coerce phoneNumber to string if present
    let { email, phoneNumber } = req.body;
    email = email ? String(email) : null;
    phoneNumber = phoneNumber ? String(phoneNumber) : null;

    if (!email && !phoneNumber) {
      return res.status(400).json({ error: 'Provide email or phoneNumber' });
    }

    // 1. Find contacts matching email or phoneNumber
    const contacts = await findContacts(email, phoneNumber);

    if (contacts.length === 0) {
      // No match: create new primary
      const newContact = await insertContact(email, phoneNumber, null, 'primary');
      return res.json({
        contact: {
          primaryContatctId: newContact.id,
          emails: [newContact.email],
          phoneNumbers: [newContact.phonenumber],
          secondaryContactIds: []
        }
      });
    }

    // 2. At least one match: find the oldest as primary
    let primary = contacts.find(c => c.linkprecedence === 'primary') || contacts[0];
    for (const c of contacts) {
      if (c.linkprecedence === 'primary' && (!primary || c.createdat < primary.createdat)) {
        primary = c;
      }
    }

    // Get all linked contacts (including secondaries)
    let allContacts = await getAllLinkedContacts(primary.id);

    // 3. Check if new info (email/phone) is missing from any contact
    const emails = [...new Set(allContacts.map(c => c.email).filter(Boolean))];
    const phoneNumbers = [...new Set(allContacts.map(c => c.phonenumber).filter(Boolean))];

    let needNewSecondary = false;
    if (email && !emails.includes(email)) needNewSecondary = true;
    if (phoneNumber && !phoneNumbers.includes(phoneNumber)) needNewSecondary = true;

    if (needNewSecondary) {
      await insertContact(email, phoneNumber, primary.id, 'secondary');
      allContacts = await getAllLinkedContacts(primary.id);
    }

    // 4. Prepare response
    const responseEmails = [primary.email, ...emails.filter(e => e !== primary.email)];
    const responsePhones = [primary.phonenumber, ...phoneNumbers.filter(p => p !== primary.phonenumber)];
    const secondaryIds = allContacts.filter(c => c.linkprecedence === 'secondary').map(c => c.id);

    res.json({
      contact: {
        primaryContatctId: primary.id,
        emails: responseEmails,
        phoneNumbers: responsePhones,
        secondaryContactIds: secondaryIds
      }
    });
  } catch (err) {
    console.error('Error in /identify:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
