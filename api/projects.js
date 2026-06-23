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

  const projectsCollection = db.collection('projects');

  // GET: Fetch all projects (Public)
  if (req.method === 'GET') {
    try {
      const projects = await projectsCollection.find({}).sort({ order: 1, createdAt: -1 }).toArray();
      return res.status(200).json(projects);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve projects: ' + err.message });
    }
  }

  // Admin access validation for other methods
  const decoded = verifyToken(req);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized admin access required' });
  }

  // POST: Create a new project (Admin only)
  if (req.method === 'POST') {
    const { title, description, details, tags, githubLink, liveLink, image, order } = req.body || {};

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and Description are required' });
    }

    try {
      const newProject = {
        title,
        description,
        details: Array.isArray(details) ? details : [],
        tags: Array.isArray(tags) ? tags : [],
        githubLink: githubLink || '',
        liveLink: liveLink || '',
        image: image || '',
        order: Number(order) || 0,
        createdAt: new Date()
      };

      const result = await projectsCollection.insertOne(newProject);
      return res.status(201).json({ success: true, projectId: result.insertedId });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to create project: ' + err.message });
    }
  }

  // PUT: Update an existing project (Admin only)
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { title, description, details, tags, githubLink, liveLink, image, order } = req.body || {};

    if (!id) {
      return res.status(400).json({ error: 'Project ID is required in query params' });
    }
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and Description are required' });
    }

    try {
      const updateData = {
        title,
        description,
        details: Array.isArray(details) ? details : [],
        tags: Array.isArray(tags) ? tags : [],
        githubLink: githubLink || '',
        liveLink: liveLink || '',
        image: image || '',
        order: Number(order) || 0,
        updatedAt: new Date()
      };

      const result = await projectsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update project: ' + err.message });
    }
  }

  // DELETE: Delete a project (Admin only)
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Project ID is required in query params' });
    }

    try {
      const result = await projectsCollection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete project: ' + err.message });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
};
