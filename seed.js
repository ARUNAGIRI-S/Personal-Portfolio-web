/**
 * ARUNAGIRI S. PORTFOLIO
 * Database Seeder Script
 * Run with: node seed.js
 */

require('dotenv').config();
try {
  require('dns').setServers(['8.8.8.8']);
} catch (e) {
  console.warn("Could not set DNS servers:", e.message);
}
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("FATAL ERROR: MONGODB_URI is not defined in environment variables or .env file.");
  process.exit(1);
}

const client = new MongoClient(uri);

// Seeding Data Definition
const initialProfile = {
  name: "Arunagiri S",
  title: "Electronics and Communication Engineering Student | Full Stack Developer | IoT Enthusiast",
  about: "Passionate about Full Stack Development, IoT, AIoT, Embedded Systems, and Cloud Technologies. I like bridging the gap between hardware and software, designing responsive web applications, and building connected smart systems that solve real-world problems.",
  cgpa: "7.93",
  college: "Adhi College of Engineering and Technology",
  university: "Anna University",
  degree: "BE Electronics & Communication Engineering",
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

const initialProjects = [
  {
    title: "Smart One Transportation System",
    description: "An IoT-based intelligent transit infrastructure providing real-time tracking, ESP32 device mapping, and mobile application dashboards.",
    details: [
      "IoT-based smart transportation solution",
      "Real-time monitoring",
      "Firebase integration",
      "Flutter application",
      "ESP32-based implementation"
    ],
    tags: ["IoT", "Firebase", "Flutter", "ESP32"],
    githubLink: "https://github.com",
    liveLink: "#",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=60",
    order: 1,
    createdAt: new Date()
  },
  {
    title: "CareLoop – Federated Learning Based AIoT Smart Elder Care System",
    description: "An AIoT elder care monitoring ecosystem utilizing federated learning networks to maintain privacy while sharing healthcare sensor inputs.",
    details: [
      "AIoT healthcare monitoring",
      "Smart sensors",
      "Firebase database",
      "Real-time alerts",
      "Elder care ecosystem"
    ],
    tags: ["AIoT", "Federated Learning", "Firebase", "Sensors"],
    githubLink: "https://github.com",
    liveLink: "#",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=60",
    order: 2,
    createdAt: new Date()
  }
];

const initialCertificates = [
  {
    title: "Oracle Course",
    issuer: "Oracle Academy",
    credentialUrl: "https://academy.oracle.com",
    issueDate: "2025-01",
    image: "",
    order: 1,
    createdAt: new Date()
  },
  {
    title: "AI Fluency for Small Businesses",
    issuer: "LinkedIn Learning / Microsoft",
    credentialUrl: "https://linkedin.com",
    issueDate: "2025-02",
    image: "",
    order: 2,
    createdAt: new Date()
  },
  {
    title: "Claude 101",
    issuer: "Anthropic",
    credentialUrl: "https://anthropic.com",
    issueDate: "2025-03",
    image: "",
    order: 3,
    createdAt: new Date()
  },
  {
    title: "IoT and Smart Home Applications",
    issuer: "Coursera",
    credentialUrl: "https://coursera.org",
    issueDate: "2025-04",
    image: "",
    order: 4,
    createdAt: new Date()
  },
  {
    title: "Computing with Printed and Flexible Electronics",
    issuer: "NPTEL / Anna University Course",
    credentialUrl: "https://nptel.ac.in",
    issueDate: "2025-05",
    image: "",
    order: 5,
    createdAt: new Date()
  },
  {
    title: "Smart India Hackathon Participation",
    issuer: "Government of India / Ministry of Education",
    credentialUrl: "https://sih.gov.in",
    issueDate: "2025-06",
    image: "",
    order: 6,
    createdAt: new Date()
  },
  {
    title: "Prototype Parade Participation",
    issuer: "Adhi College of Engineering & Technology",
    credentialUrl: "#",
    issueDate: "2025-07",
    image: "",
    order: 7,
    createdAt: new Date()
  }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB Atlas Cluster...");
    await client.connect();
    
    const db = client.db(); // uses db specified in connection string
    console.log(`Database selected: "${db.databaseName}"`);

    // 1. Seed Profile
    console.log("Seeding Profile data...");
    const profileCol = db.collection('profile');
    await profileCol.deleteMany({});
    const profResult = await profileCol.insertOne(initialProfile);
    console.log(`Successfully seeded profile configuration. ID: ${profResult.insertedId}`);

    // 2. Seed Projects
    console.log("Seeding Projects data...");
    const projectsCol = db.collection('projects');
    await projectsCol.deleteMany({});
    const projResult = await projectsCol.insertMany(initialProjects);
    console.log(`Successfully seeded ${projResult.insertedCount} projects.`);

    // 3. Seed Certificates
    console.log("Seeding Certificates data...");
    const certsCol = db.collection('certificates');
    await certsCol.deleteMany({});
    const certResult = await certsCol.insertMany(initialCertificates);
    console.log(`Successfully seeded ${certResult.insertedCount} certificates.`);
    
    // Clear Contacts Collection to initialize it cleanly
    console.log("Clearing Inbox messages...");
    const contactsCol = db.collection('contacts');
    await contactsCol.deleteMany({});
    console.log("Inbox cleared.");

    console.log("\nDATABASE SEEDING COMPLETED SUCCESSFULLY.");
  } catch (err) {
    console.error("Database seeding encountered a fatal error:", err);
  } finally {
    await client.close();
  }
}

seed();
