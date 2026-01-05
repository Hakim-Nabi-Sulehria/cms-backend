Features
🔐 Authentication & Security
JWT-based authentication with bcrypt password hashing

Role-Based Access Control (ADMIN, EDITOR, VIEWER)

Middleware protection for all sensitive routes

Input validation with Zod schema validation

Rate limiting to prevent abuse

Security headers with Helmet.js

CORS configuration for frontend integration

📝 Article Management API
Full CRUD operations for articles

Rich content support with HTML content storage

Article status management (DRAFT, PUBLISHED)

Author ownership system with permissions

Pagination & filtering with search capabilities

Public endpoints for unauthenticated access

🗄️ Database & ORM
Prisma ORM for type-safe database operations

PostgreSQL database with Neon serverless support

Automatic migrations with Prisma Migrate

Database seeding with sample data

Connection pooling for performance

Query optimization with Prisma client

⚡ Performance & Reliability
Asynchronous operations with async/await

Centralized error handling

Request validation middleware

Response standardization

Health check endpoints

Graceful shutdown handling

📋 Prerequisites
Node.js 18.0.0 or higher

npm 9.0.0 or higher

PostgreSQL database (local or Neon)

Git

🚀 Quick Start
1. Clone the Repository
bash
git clone https://github.com/Hakim-Nabi-Sulehria/cms-backend.git
cd cms-backend
2. Install Dependencies
bash
npm install
3. Environment Configuration
Copy the example environment file:

bash
cp .env.example .env
Edit .env file with your configuration:

env
# Server
NODE_ENV=development
PORT=5000

# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/cms_workspace?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Frontend
FRONTEND_URL="http://localhost:3000"
4. Database Setup
Option A: Local PostgreSQL
bash
# Create database
createdb cms_workspace

# Run migrations
npx prisma migrate dev --name init

# Seed database
npm run prisma:seed
Option B: Neon PostgreSQL (Serverless)
Create database at neon.tech

Update DATABASE_URL in .env

Run migrations:

bash
npx prisma db push
npm run prisma:seed
5. Start Development Server
bash
npm run dev
Server runs at http://localhost:5000

6. Generate Prisma Client
bash
npx prisma generate
7. Test the API
bash
# Health check
curl http://localhost:5000/health

# Test endpoints
curl http://localhost:5000/api/articles/public
🏗️ Project Structure
text
cms-backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js               # Database seeding script
├── src/
│   ├── config/
│   │   └── database.js       # Database configuration
│   ├── controllers/
│   │   ├── auth.controller.js # Authentication logic
│   │   └── article.controller.js # Article CRUD operations
│   ├── services/
│   │   ├── auth.service.js   # Authentication business logic
│   │   └── article.service.js # Article business logic
│   ├── routes/
│   │   ├── auth.routes.js    # Authentication routes
│   │   └── article.routes.js # Article routes
│   ├── middlewares/
│   │   ├── auth.js           # Authentication middleware
│   │   ├── roleCheck.js      # Role-based access control
│   │   ├── validation.js     # Request validation
│   │   └── errorHandler.js   # Error handling middleware
│   ├── validations/
│   │   ├── auth.validation.js # Auth validation schemas
│   │   └── article.validation.js # Article validation schemas
│   ├── utils/
│   │   ├── constants.js      # Application constants
│   │   ├── helpers.js        # Helper functions
│   │   └── validators.js     # Validation utilities
│   └── app.js               # Express app configuration
├── server.js                # Server entry point
├── .env                     # Environment variables
├── .env.example            # Environment template
└── package.json            # Dependencies and scripts
📡 API Endpoints
Authentication
Method	Endpoint	Description	Access
POST	/api/auth/register	Register new user	Public
POST	/api/auth/login	Login user	Public
GET	/api/auth/profile	Get user profile	Private
PUT	/api/auth/profile	Update user profile	Private
POST	/api/auth/change-password	Change password	Private
POST	/api/auth/logout	Logout user	Private
Articles
Method	Endpoint	Description	Access
GET	/api/articles/public	Get public articles	Public
GET	/api/articles	Get all articles	Private (All roles)
GET	/api/articles/my-articles	Get user's articles	Private (All roles)
GET	/api/articles/:id	Get single article	Private (All roles)
POST	/api/articles	Create new article	Private (Admin/Editor)
PUT	/api/articles/:id	Update article	Private (Owner or Admin)
DELETE	/api/articles/:id	Delete article	Private (Admin only)
🗄️ Database Schema
User Model
prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(VIEWER)
  articles  Article[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
Article Model
prisma
model Article {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  status    Status   @default(DRAFT)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
Enums
prisma
enum Role {
  ADMIN
  EDITOR
  VIEWER
}

enum Status {
  DRAFT
  PUBLISHED
}
🔧 Available Scripts
Script	Description
npm start	Start production server
npm run dev	Start development server with nodemon
npm run prisma:generate	Generate Prisma client
npm run prisma:migrate	Run database migrations
npm run prisma:seed	Seed database with sample data
npm run prisma:studio	Open Prisma Studio for database management
npm run prisma:reset	Reset database and re-seed
npm run test	Run tests (if configured)
npm run lint	Run ESLint
npm run format	Format code with Prettier
🔒 Security Implementation
JWT Authentication
javascript
// Token generation
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN }
);

// Middleware protection
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Verify token and attach user to request
};
Password Hashing
javascript
// Using bcryptjs
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
Role-Based Access Control
javascript
const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
🌐 CORS Configuration
javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-frontend.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
🧪 Testing the API
Using cURL
bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test@123","role":"VIEWER"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'

# Get articles (with token)
curl -X GET http://localhost:5000/api/articles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
Using Postman
Import the Postman collection from docs/postman_collection.json

Set environment variables:

base_url: http://localhost:5000

token: Your JWT token

Test all endpoints
