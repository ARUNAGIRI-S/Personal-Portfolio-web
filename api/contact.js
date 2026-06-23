const { connectToDatabase } = require('./utils/db');
const { verifyToken } = require('./auth');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let db;
  try {
    const conn = await connectToDatabase();
    db = conn.db;
  } catch (err) {
    return res.status(500).json({ error: 'Database connection failed: ' + err.message });
  }

  const contactsCollection = db.collection('contacts');

  // POST: Create a new contact message (Public)
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields (name, email, subject, message) are required' });
    }

    try {
      const result = await contactsCollection.insertOne({
        name,
        email,
        subject,
        message,
        createdAt: new Date(),
        read: false
      });
      return res.status(201).json({ success: true, messageId: result.insertedId });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save message: ' + err.message });
    }
  }

  // Admin access validation for other methods
  const decoded = verifyToken(req);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized admin access required' });
  }

  // GET: Fetch all messages (Admin only)
  if (req.method === 'GET') {
    try {
      const messages = await contactsCollection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(messages);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve messages: ' + err.message });
    }
  }

  // DELETE: Delete a message (Admin only)
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Message ID is required' });
    }

    try {
      const result = await contactsCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete message: ' + err.message });
    }
  }

  // PATCH: Mark message as read (Admin only)
  if (req.method === 'PATCH') {
    const { id } = req.query;
    const { read } = req.body || {};
    if (!id) {
      return res.status(400).json({ error: 'Message ID is required' });
    }

    try {
      const result = await contactsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { read: read === undefined ? true : read } }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update message status: ' + err.message });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
};
