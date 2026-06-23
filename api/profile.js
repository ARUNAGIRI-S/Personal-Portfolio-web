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

  let db;
  try {
    const conn = await connectToDatabase();
    db = conn.db;
  } catch (err) {
    return res.status(500).json({ error: 'Database connection failed: ' + err.message });
  }

  const profileCollection = db.collection('profile');

  // GET: Fetch the profile document (Public)
  if (req.method === 'GET') {
    try {
      let profile = await profileCollection.findOne({});
      
      // If no profile document exists, return standard defaults
      if (!profile) {
        profile = {
          name: "Arunagiri S",
          title: "Electronics and Communication Engineering Student | Full Stack Developer | IoT Enthusiast",
          about: "Passionate about Full Stack Development, IoT, AIoT, Embedded Systems, and Cloud Technologies. I like bridging the gap between hardware and software, designing responsive web applications, and building connected smart systems that solve real-world problems.",
          cgpa: "7.93",
          college: "Adhi College of Engineering and Technology",
          university: "Anna University",
          resumeUrl: "#",
          githubUrl: "https://github.com",
          linkedinUrl: "https://linkedin.com",
          email: "arunagiri.ece@gmail.com",
          skills: [
            { name: "HTML", percentage: 95, category: "Frontend" },
            { name: "CSS", percentage: 90, category: "Frontend" },
            { name: "JavaScript", percentage: 88, category: "Frontend" },
            { name: "React", percentage: 80, category: "Frontend" },
            { name: "Node.js", percentage: 85, category: "Backend" },
            { name: "Express.js", percentage: 82, category: "Backend" },
            { name: "MongoDB", percentage: 80, category: "Database" },
            { name: "MySQL", percentage: 75, category: "Database" },
            { name: "Firebase", percentage: 85, category: "Database" },
            { name: "Git", percentage: 85, category: "Tools" },
            { name: "GitHub", percentage: 90, category: "Tools" },
            { name: "Python", percentage: 80, category: "Languages" },
            { name: "C", percentage: 85, category: "Languages" },
            { name: "C++", percentage: 80, category: "Languages" },
            { name: "Flutter", percentage: 78, category: "Mobile" }
          ],
          achievements: {
            completedProjects: 8,
            certificationsEarned: 7,
            workshopsAttended: 12,
            hackathonsParticipated: 4
          }
        };
      }
      return res.status(200).json(profile);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve profile: ' + err.message });
    }
  }

  // Admin access validation for other methods
  const decoded = verifyToken(req);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized admin access required' });
  }

  // PUT: Update the profile document (Admin only)
  if (req.method === 'PUT') {
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Update data is required' });
    }

    // Strip MongoDB generated _id if it's sent in the body to avoid immutable field error
    if (updateData._id) {
      delete updateData._id;
    }

    try {
      // Find one and update, or insert if empty (upsert)
      const result = await profileCollection.findOneAndUpdate(
        {},
        { $set: updateData },
        { upsert: true, returnDocument: 'after' }
      );

      return res.status(200).json({ success: true, profile: result });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update profile: ' + err.message });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
};
