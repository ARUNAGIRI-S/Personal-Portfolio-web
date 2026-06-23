try {
  require('dns').setServers(['8.8.8.8']);
} catch (e) {
  // Ignore DNS config failure in serverless context if it arises
}
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  // Return a mock or error out. For seeding or local without uri, we warn, but during execution we need it.
  console.warn("WARNING: MONGODB_URI environment variable is missing.");
}

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

async function connectToDatabase() {
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined. Please check your configuration.');
  }
  const conn = await clientPromise;
  const db = conn.db(); // Uses the database in the connection string automatically
  return { db, client: conn };
}

module.exports = { connectToDatabase };
