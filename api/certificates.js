const { connectToDatabase } = require('./utils/db');
const { verifyToken } = require('./auth');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
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

  const certificatesCollection = db.collection('certificates');

  // GET: Fetch all certificates (Public)
  if (req.method === 'GET') {
    try {
      const certificates = await certificatesCollection.find({}).sort({ order: 1, createdAt: -1 }).toArray();
      return res.status(200).json(certificates);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve certificates: ' + err.message });
    }
  }

  // Admin access validation for other methods
  const decoded = verifyToken(req);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized admin access required' });
  }

  // POST: Create a new certificate (Admin only)
  if (req.method === 'POST') {
    const { title, issuer, credentialUrl, issueDate, image, order } = req.body || {};

    if (!title || !issuer) {
      return res.status(400).json({ error: 'Title and Issuer are required' });
    }

    try {
      const newCertificate = {
        title,
        issuer,
        credentialUrl: credentialUrl || '',
        issueDate: issueDate || '',
        image: image || '',
        order: Number(order) || 0,
        createdAt: new Date()
      };

      const result = await certificatesCollection.insertOne(newCertificate);
      return res.status(201).json({ success: true, certificateId: result.insertedId });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create certificate: ' + err.message });
    }
  }

  // PUT: Update an existing certificate (Admin only)
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { title, issuer, credentialUrl, issueDate, image, order } = req.body || {};

    if (!id) {
      return res.status(400).json({ error: 'Certificate ID is required in query params' });
    }
    if (!title || !issuer) {
      return res.status(400).json({ error: 'Title and Issuer are required' });
    }

    try {
      const updateData = {
        title,
        issuer,
        credentialUrl: credentialUrl || '',
        issueDate: issueDate || '',
        image: image || '',
        order: Number(order) || 0,
        updatedAt: new Date()
      };

      const result = await certificatesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Certificate not found' });
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update certificate: ' + err.message });
    }
  }

  // DELETE: Delete a certificate (Admin only)
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Certificate ID is required in query params' });
    }

    try {
      const result = await certificatesCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Certificate not found' });
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete certificate: ' + err.message });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
};
