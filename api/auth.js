const jwt = require('jsonwebtoken');

// Helper function to verify requests in other serverless functions
function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_local');
  } catch (err) {
    return null;
  }
}

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

  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // Default for local if not set

  if (req.method === 'POST') {
    const { password } = req.body || {};
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (password === adminPassword) {
      // Issue token
      const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '7d' });
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ error: 'Invalid password' });
    }
  }

  if (req.method === 'GET') {
    const decoded = verifyToken(req);
    if (decoded) {
      return res.status(200).json({ valid: true, role: decoded.role });
    } else {
      return res.status(401).json({ valid: false, error: 'Unauthorized' });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
};

// Export helper for other functions
module.exports.verifyToken = verifyToken;
