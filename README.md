# Arunagiri S. — Full Stack Portfolio & Admin Controls

An industrial-grade, high-fidelity Full Stack Personal Portfolio Website designed for an Electronics & Communication Engineering (ECE) student, Full Stack Developer, and IoT Enthusiast. 

The application utilizes a dark-themed glassmorphism frontend coupled with a secure **Admin Control Dashboard** to manage contact logs, projects, certifications, and statistics dynamically.

---

## 🚀 Key Features

### Premium UI/UX Design
- **Futuristic Dark-Theme Layout**: Dark space background accented with neon indigo, cyan, and violet gradients. Fully supports clean Light Theme toggle swaps.
- **Glassmorphic Interfaces**: Dynamic blurring backdrop panels with refined semi-transparent borders.
- **Canvas Particles System**: Performance-optimized constellation particle network flowing natively on a background HTML5 `<canvas>`.
- **Custom Cursor Overlay**: Precise cursor point followed by a lag-ring shadow that scales and changes color over interactive components.
- **Hero Circuit schematic**: An animated, high-quality vector schematic SVG illustrating Arunagiri's ECE hardware background.
- **Typing Animation**: Real-time role rotation in the Hero statement.
- **Intersection Animations**: Scroll-triggered sliding fades and counter ticks (achievements start counting when scrolled into viewport).
- **Academic Rating indicator**: Dynamic SVG stroke calculation tracing Arunagiri's **7.93 CGPA**.

### Complete Admin Panel
- **Security Check Screen**: Session-secured JWT login block preventing unauthorized configuration edits.
- **Unified Controls**: Sidebar layout to view dashboard stats, view/delete unread visitor inbox messages, append/edit/delete projects, certificates, and alter profile constants (college names, bio text, counter benchmarks, social networks).

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla ES6 JavaScript (zero heavy framework dependencies for loading speed).
- **Backend API**: Node.js & Express-like functions deployed on **Vercel Serverless Functions**.
- **Database**: **MongoDB Atlas** (cloud cluster).
- **Authentication**: Stateless sessions signed with **JSON Web Tokens (JWT)**.
- **Deployment**: **Vercel** serverless routing.

---

## 📁 Repository Directory Structure

```
├── api/                   # Vercel Serverless API Functions
│   ├── utils/
│   │   └── db.js          # Cached MongoDB connection pool handler
│   ├── auth.js            # Admin login & JWT validator
│   ├── contact.js         # Visitor submissions & inbox logs CRUD
│   ├── projects.js        # Dynamic Project CRUD
│   ├── certificates.js    # Certification credentials CRUD
│   ├── profile.js         # Core CV constants & skills array manager
│   └── stats.js           # Administrative dashboard counters
├── css/
│   └── style.css          # Central stylesheet (Variables, animations, UI grids)
├── js/
│   ├── main.js            # Client-side loops, particles, scrolls, form requests
│   └── admin.js           # Admin panel JWT verify, forms handling & toast alerts
├── index.html             # Core landing portfolio page
├── admin.html             # Security & control dashboard layout page
├── package.json           # Backend dependency lists & build scripts
├── seed.js                # Database seeder utility script
├── vercel.json            # Vercel Serverless routing & clean URL configurations
└── README.md              # Project documentation
```

---

## ⚙️ Local Development Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Vercel CLI](https://vercel.com/cli) (to run Serverless Functions locally)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) Cluster (Free Shared M0 instance is perfect)

### 2. Installation
Clone the workspace files, open a shell in the root directory, and execute:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root folder with the following variables:
```env
# MongoDB Atlas connection string (replace credentials and database name)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/portfolio?retryWrites=true&w=majority

# Administrative Password to access /admin
ADMIN_PASSWORD=your_secure_password_here

# Secret string used to sign JWT session keys
JWT_SECRET=a_long_random_cryptographic_string_here
```

### 4. Database Seeding
To populate the database with default ECE project templates, certifications, and biography details for Arunagiri S., run the seeder:
```bash
npm run seed
```

### 5. Running the Local Dev Server
Initialize Vercel's local compilation tool:
```bash
npx vercel dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser. The static page handles the client UI, while local proxy routes map `/api/*` requests to your serverless functions under `api/` directory.

---

## 🚀 Deployment to Vercel

The repository contains `vercel.json` indicating serverless API routing endpoints.

1. **Vercel Console**:
   - Push your project to a GitHub repository.
   - Go to your Vercel Dashboard, select **Add New Project**, and import your repository.
   - Expand the **Environment Variables** section and add the three configurations:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `ADMIN_PASSWORD`
   - Click **Deploy**. Vercel will automatically link pages, clean `.html` URL extensions, and activate Serverless Functions.

2. **Vercel CLI**:
   - Run the deployment command in your terminal:
     ```bash
     vercel --prod
     ```
   - Follow prompts to link your project and submit production variables.
