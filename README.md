# MedKura - Medical Report Management System

A full-stack web application for managing and analyzing medical reports with real-time status tracking, file uploads, and AI-powered summaries.

## 🎯 Project Overview

MedKura is a complete medical report management solution designed to streamline the handling and analysis of medical documents. Users can securely register, upload PDF reports, and track them through a 3-stage workflow (UPLOADED → PROCESSING → COMPLETED) with automatically generated summaries.

---

## 🏗️ Architecture Overview (5-10 Lines Summary)

MedKura is a full-stack medical report management system with a React SPA frontend and Express.js backend. The frontend communicates with the backend via RESTful API using JWT authentication and stores user sessions in localStorage. The backend manages user accounts, file uploads, and report status workflows in a MySQL database. Reports follow a linear 3-stage workflow (UPLOADED → PROCESSING → COMPLETED) with automatic timestamp tracking. File uploads are handled securely with Multer, passwords are hashed with bcryptjs, and all database operations use prepared statements to prevent SQL injection.

---

## 📋 Project Structure

```
MedKura/
├── medical-backend/              # Node.js Express API server
│   ├── config/
│   │   ├── db.js                 # Database connection pool
│   │   └── schema.sql            # Database schema initialization
│   ├── controllers/
│   │   ├── authController.js     # Auth business logic
│   │   └── reportController.js   # Report operations logic
│   ├── middleware/
│   │   ├── auth.js               # JWT verification middleware
│   │   └── upload.js             # File upload middleware (Multer)
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   └── reports.js            # Report CRUD routes
│   ├── uploads/                  # Uploaded files storage
│   ├── .env                       # Environment configuration
│   ├── server.js                 # Express app entry point
│   ├── package.json              # Backend dependencies
│   └── README.md                 # Backend documentation
│
├── src/                          # React frontend application
│   ├── pages/
│   │   ├── Login.jsx             # User authentication page
│   │   ├── Dashboard.jsx         # Reports listing and management
│   │   ├── UploadReport.jsx      # File upload interface
│   │   └── ReportDetail.jsx      # Individual report details
│   ├── components/
│   │   ├── Navbar.jsx            # Navigation bar with logout
│   │   ├── ProtectedRoute.jsx    # Auth-protected route wrapper
│   │   └── ReportCard.jsx        # Report card component
│   ├── context/
│   │   └── AuthContext.jsx       # Global auth state management
│   ├── api/
│   │   └── axios.js              # Axios instance with JWT interceptors
│   ├── assets/css/               # Tailwind CSS style definitions
│   ├── App.jsx                   # Main React app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
│
├── public/                       # Static files
├── node_modules/                 # Frontend dependencies
├── package.json                  # Frontend dependencies
├── vite.config.js                # Vite build configuration
├── eslint.config.js              # ESLint configuration
├── index.html                    # HTML entry point
└── README.md                     # Project documentation
```

---

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  INDEX idx_email (email)
);
```

### Reports Table

```sql
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(100) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  status ENUM('UPLOADED', 'PROCESSING', 'COMPLETED') DEFAULT 'UPLOADED',
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);
```

**Key Columns:**

- `user_id` - Foreign key linking to users table with CASCADE delete
- `status` - ENUM field with three values: UPLOADED, PROCESSING, COMPLETED
- `summary` - Text field populated when status reaches COMPLETED
- `created_at` & `updated_at` - Automatic timestamps for audit trail

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **MySQL** v8 or higher
- **npm** or **yarn** package manager
- **Git** (for version control)

### Quick Start (Complete Setup)

#### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/medkura.git
cd medkura
```

#### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd medical-backend

# Install dependencies
npm install

# Create .env file with your configuration
cat > .env << EOF
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=medical_reports
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
EOF

# Initialize database
mysql -u root -p < config/schema.sql

# Start backend server (development mode with auto-reload)
npm run dev

# The backend will start at http://localhost:5000
```

**Verification:** You should see in terminal:

```
✅ Database connected successfully
✅
Server running on http://localhost:5000
```

#### Step 3: Frontend Setup

```bash
# In a new terminal, navigate to project root
cd medkura

# Install dependencies
npm install

# Start development server
npm run dev

# The frontend will start at http://localhost:5173
```

**Verification:** You should see:

```
Local: http://localhost:5173
```

#### Step 4: Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

---

## 🔑 Default Test Credentials

Use these credentials to test the application:

```
Email:
Password
```

If account doesn't exist, you can sign up with any email/password (minimum 6 characters).

---

## 📚 API Endpoints

### Authentication Endpoints

#### Register/Sign Up

```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (201 Created):
{
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "email": "user@example.com" }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "email": "user@example.com" }
}
```

### Report Endpoints (All require JWT token in Authorization header)

#### Get All Reports

```http
GET /api/reports
Authorization: Bearer {token}

Response (200 OK):
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Blood Test",
    "type": "Lab Report",
    "file_path": "uploads/report_1.pdf",
    "status": "COMPLETED",
    "summary": "Report analysis completed...",
    "created_at": "2026-02-15T10:30:00Z",
    "updated_at": "2026-02-15T10:35:00Z"
  }
]
```

#### Get Report by ID

```http
GET /api/reports/:id
Authorization: Bearer {token}

Response (200 OK): { Single report object }
```

#### Upload Report

```http
POST /api/reports
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Fields:
- file: [PDF file]
- name: "Report Name"
- type: "Report Type"

Response (201 Created):
{
  "message": "Report uploaded successfully",
  "report": { ...report object... }
}
```

#### Update Report Status

```http
PATCH /api/reports/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "PROCESSING"
}

Valid statuses: UPLOADED, PROCESSING, COMPLETED

Response (200 OK):
{
  "message": "Status updated successfully",
  "report": { ...updated report object... }
}
```

#### Health Check

```http
GET /api/health

Response (200 OK):
{
  "status": "ok",
  "timestamp": "2026-02-15T12:20:10.055Z"
}
```

---

## ✨ Key Features

### 🔐 User Authentication

- Secure registration with email validation
- Login with JWT token-based authentication
- Protected routes that require valid tokens
- Auto-logout on token expiration
- Persistent session storage in localStorage

### 📄 Report Management

- Upload PDF medical reports securely
- View all personal reports in an organized dashboard
- Filter reports by status (All, Uploaded, Processing, Completed)
- Search reports by name or type
- View detailed report information with full history

### 🔄 Status Workflow

- **UPLOADED** - Report successfully uploaded to system
- **PROCESSING** - Report is being analyzed
- **COMPLETED** - Analysis complete with generated summary

Users can manually advance reports through stages using the "Move to next stage" button in the dashboard.

### 🎯 Responsive Design

- Mobile-friendly interface that adapts to any screen size
- Clean, modern UI built with Tailwind CSS
- Real-time status updates across the application
- Intuitive navigation and user experience

### 🛡️ Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token authentication with expiration
- SQL injection prevention with parameterized queries
- Secure file upload with Multer validation
- CORS protection for cross-origin requests
- Environment variables for sensitive configuration

---

## 📦 Tech Stack

### Frontend

- **React 18** - UI library and component management
- **React Router v6** - Client-side routing and navigation
- **Vite** - Modern build tool and dev server with HMR
- **Axios** - HTTP client with JWT interceptors
- **Tailwind CSS** - Utility-first CSS framework

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework and routing
- **MySQL2/Promise** - Database driver with async/await support
- **jsonwebtoken** - JWT authentication and token generation
- **Multer** - File upload handling and validation
- **bcryptjs** - Password hashing and verification
- **CORS** - Cross-origin resource sharing middleware
- **dotenv** - Environment variable management

---

## 🔄 Development Workflow

### Running Both Servers Simultaneously

**Terminal 1 - Backend:**

```bash
cd medical-backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

**Terminal 3 - (Optional) MySQL Client:**

```bash
# Windows
mysql -u root -p

# Linux/Mac
mysql -u root -p
```

The application supports hot module replacement (HMR) for live development updates on file changes.

---

## 🐛 Troubleshooting

### Backend Issues

#### "Cannot find module 'express'"

```bash
cd medical-backend
npm install
```

#### "Connect ECONNREFUSED" (Database Connection Error)

- Ensure MySQL server is running: `mysql -u root -p -e "SELECT 1;"`
- Verify `.env` file has correct database credentials
- Check database exists: `mysql -u root -p -e "SHOW DATABASES;"`
- Restart backend server after updating `.env`

#### "Port 5000 already in use"

```bash
# Find and kill the process using port 5000
lsof -i :5000  # Linux/Mac - shows PID
netstat -ano | findstr :5000  # Windows - shows PID

# Kill the process
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

#### "JWT_SECRET not found in .env"

- Verify `.env` file exists in `medical-backend/` directory
- Ensure it contains: `JWT_SECRET=your_secret_key`
- Check file is not hidden or in wrong directory
- Restart backend server

#### Database tables don't exist

```bash
# Reinitialize database
cd medical-backend
mysql -u root -p < config/schema.sql

# Verify tables were created
mysql -u root -p medical_reports -e "SHOW TABLES;"
```

### Frontend Issues

#### "Port 5173 already in use"

```bash
# Find and kill the process
lsof -i :5173  # Linux/Mac
netstat -ano | findstr :5173  # Windows

# Kill the process
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

#### "Cannot connect to backend"

- Verify backend is running: `curl http://localhost:5000/api/health`
- Check browser console for CORS errors (F12 → Console tab)
- Verify axios baseURL is correct: `http://localhost:5000/api`
- Check backend .env PORT matches frontend axios config

#### "Reports not loading (Failed to load reports. Please try again.)"

- Check network tab in DevTools (F12 → Network) for failed API calls
- Verify you're logged in (check token in localStorage via Console)
- Check backend logs for error messages
- Try refreshing the page
- Verify database has reports table (see Database Troubleshooting)

#### "Login not working"

- Check MySQL is running and database exists
- Verify `.env` database credentials are correct
- Try creating a new account via sign-up
- Check browser console for detailed error messages
- Verify backend is responding to auth endpoint

#### "Button freezes when updating status"

- Check backend is running and responding
- Open DevTools Console (F12) to see error details
- Check backend terminal for error messages
- Verify database connection
- Try refreshing page and updating again

---

## 🚀 Deployment

### Prerequisites for Production

- Linux/Windows VPS with Node.js v16+
- MySQL v8+ installed and configured
- Git installed on server
- Domain name with SSL certificate (for HTTPS)
- PM2 or similar process manager for Node.js

### Basic Deployment Steps

See [FINAL_CHECKLIST.md](FINAL_CHECKLIST.md) for complete deployment guide.

---

## 📝 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=medical_reports

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### Frontend (Vite)

The frontend connects to backend at `http://localhost:5000/api` by default.
Modify [src/api/axios.js](src/api/axios.js) to change the backend URL.

---

## 🤝 GitHub Repository Setup

### Initial Setup

```bash
# Initialize git (if not already done)
git init

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/medkura.git

# Create .gitignore file
echo "node_modules/
.env
.env.local
.DS_Store
dist/
build/
*.log
.vscode/
.idea/
uploads/*
!uploads/.gitkeep" > .gitignore

# Stage all files
git add .

# Initial commit
git commit -m "Initial commit: MedKura Medical Report Management System"

# Push to GitHub
git branch -M main
git push -u origin main
```

### Required Files for Submission

✅ **Source Code**

- All backend files in `/medical-backend` directory
- All frontend files in `/src` directory
- Configuration files (package.json, vite.config.js, etc.)
- No node_modules or .env files (add to .gitignore)

✅ **Documentation**

- README.md (this file) - Complete with all sections
- ARCHITECTURE.md - System design and diagrams
- FRONTEND.md - React app guide (if separate)
- Database schema (config/schema.sql)

✅ **Screenshots** (optional: create /screenshots folder)

- Login page screenshot
- Dashboard overview
- Upload report form
- Report details page
- Status workflow in action

✅ **.env.example**

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=medical_reports
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
```

---

## 📋 Submission Checklist

Before submitting to GitHub, verify:

### Code & Functionality

- [ ] Backend runs successfully: `npm run dev` in medical-backend/
- [ ] Frontend runs successfully: `npm run dev` in root directory
- [ ] Application accessible at http://localhost:5173 (or 3000)
- [ ] Login/Registration working correctly
- [ ] Report upload functionality working
- [ ] Report status workflow functioning properly
- [ ] Status updates displaying in real-time
- [ ] Search and filter working on dashboard
- [ ] All API endpoints responding with correct status codes
- [ ] No console errors in browser (F12)
- [ ] No critical errors in backend logs

### Documentation

- [ ] README.md complete with all sections (this file)
- [ ] Database schema documented and included
- [ ] Architecture explanation present (5-10 lines)
- [ ] Setup instructions clear and tested
- [ ] API endpoints documented
- [ ] Tech stack listed
- [ ] Troubleshooting section comprehensive

### GitHub Repository

- [ ] Repository created on GitHub
- [ ] All code pushed to main branch
- [ ] .gitignore properly configured (includes .env, node_modules)
- [ ] README visible on GitHub homepage
- [ ] Repository is public

### Screenshots (Optional but Recommended)

- [ ] Login page captured
- [ ] Dashboard with reports captured
- [ ] Upload form captured
- [ ] Report details page captured
- [ ] Screenshots stored in `/screenshots` folder
- [ ] Screenshots referenced in README

### Testing

- [ ] Create account and log in successfully
- [ ] Upload a test report
- [ ] Verify report appears in dashboard
- [ ] Update report status through workflow
- [ ] Search reports by name
- [ ] Filter reports by status
- [ ] Log out and log back in
- [ ] Session persists correctly
- [ ] Responsive design tested on mobile

### Security

- [ ] No hardcoded passwords in code
- [ ] .env file in .gitignore
- [ ] JWT secrets not exposed
- [ ] Database credentials in .env file
- [ ] Passwords hashed (verify in code)

---

## 📖 Additional Documentation

- [Backend API Documentation](./medical-backend/README.md)
- [System Architecture Details](./ARCHITECTURE.md)
- [Frontend Implementation Guide](./FRONTEND.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Final Submission Checklist](./FINAL_CHECKLIST.md)

---

## 📞 Support & Questions

For issues or questions:

1. Check [TESTING_GUIDE.md](TESTING_GUIDE.md) for common problems
2. Review browser console (F12 → Console tab) for client-side errors
3. Check backend terminal for server errors
4. Verify database connection with MySQL client
5. Ensure all prerequisites are installed correctly

---

## 📄 License

MIT License - Open source for educational and commercial purposes

---

## ✅ Project Status

**Status:** ✨ Complete and Ready for Submission

- [x] Full backend API implemented with Express.js
- [x] React frontend with routing and auth protection
- [x] User authentication system with JWT tokens
- [x] Report management (upload, read, update, delete)
- [x] Database schema with MySQL
- [x] File upload handling with Multer
- [x] Error handling and logging
- [x] Documentation complete
- [x] Ready for GitHub submission

---

**Version:** 1.0.0  
**Maintainer:** Your Name
