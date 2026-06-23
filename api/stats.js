const { connectToDatabase } = require('./utils/db');
const { verifyToken } = require('./auth');

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

  // Admin access validation
  const decoded = verifyToken(req);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized admin access required' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { db } = await connectToDatabase();
    
    const projectsCount = await db.collection('projects').countDocuments();
    const certificatesCount = await db.collection('certificates').countDocuments();
    const totalMessages = await db.collection('contacts').countDocuments();
    const unreadMessages = await db.collection('contacts').countDocuments({ read: false });

    // Fetch the counters directly from profile if present, else fallback
    const profile = await db.collection('profile').findOne({});
    const achievements = profile?.achievements || {
      completedProjects: projectsCount,
      certificationsEarned: certificatesCount,
      workshopsAttended: 12,
      hackathonsParticipated: 4
    };

    return res.status(200).json({
      projectsCount,
      certificatesCount,
      messages: {
        total: totalMessages,
        unread: unreadMessages
      },
      achievements
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve statistics: ' + err.message });
  }
};
