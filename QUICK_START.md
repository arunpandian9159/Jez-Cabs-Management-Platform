# Jez Cabs Management Platform - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **Node.js 18+** and npm
- ✅ **Docker Desktop** (for Windows)
- ✅ **Git**

### Step 1: Start Infrastructure Services

1. **Start Docker Desktop** on your Windows machine

2. **Start the database and supporting services:**
   ```bash
   docker-compose up -d postgres mongodb redis rabbitmq
   ```

3. **Verify services are running:**
   ```bash
   docker-compose ps
   ```

   You should see:
   - `jezcabs-postgres` (PostgreSQL database)
   - `jezcabs-mongodb` (MongoDB database)
   - `jezcabs-redis` (Redis cache)
   - `jezcabs-rabbitmq` (RabbitMQ message broker)

### Step 2: Start the Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Start the development server:**
   ```bash
   npm run start:dev
   ```

3. **Wait for the server to start.** You should see:
   ```
   📚 Swagger documentation available at: http://localhost:3000/api/docs
   🚀 Application is running on: http://localhost:3000/api
   ```

### Step 3: Test the API

#### Option A: Using Swagger UI (Recommended)

1. **Open your browser and navigate to:**
   ```
   http://localhost:3000/api/docs
   ```

2. **Test the registration endpoint:**
   - Click on `POST /api/auth/register`
   - Click "Try it out"
   - Use this sample data:
     ```json
     {
       "companyName": "Jez Cabs Ltd",
       "companyEmail": "contact@jezcabs.com",
       "companyAddress": "123 Main Street, City",
       "companyPhone": "+1234567890",
       "firstName": "John",
       "lastName": "Doe",
       "email": "owner@jezcabs.com",
       "password": "SecurePass@123",
       "phoneNumber": "+1234567890"
     }
     ```
   - Click "Execute"
   - You should receive a 201 response with a JWT token

3. **Test the login endpoint:**
   - Click on `POST /api/auth/login`
   - Click "Try it out"
   - Use these credentials:
     ```json
     {
       "email": "owner@jezcabs.com",
       "password": "SecurePass@123"
     }
     ```
   - Click "Execute"
   - Copy the `token` from the response

4. **Authorize Swagger with the token:**
   - Click the "Authorize" button at the top right
   - Paste the token in the "Value" field
   - Click "Authorize"
   - Now you can test protected endpoints!

5. **Test the profile endpoint:**
   - Click on `GET /api/auth/me`
   - Click "Try it out"
   - Click "Execute"
   - You should see your user profile

#### Option B: Using cURL

1. **Register a company:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "companyName": "Jez Cabs Ltd",
       "companyEmail": "contact@jezcabs.com",
       "firstName": "John",
       "lastName": "Doe",
       "email": "owner@jezcabs.com",
       "password": "SecurePass@123"
     }'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "owner@jezcabs.com",
       "password": "SecurePass@123"
     }'
   ```

3. **Get your profile (replace YOUR_TOKEN with the token from login):**
   ```bash
   curl -X GET http://localhost:3000/api/auth/me \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

#### Option C: Using Postman

1. **Import the API:**
   - Open Postman
   - Import from URL: `http://localhost:3000/api/docs-json`

2. **Create a new request:**
   - Method: POST
   - URL: `http://localhost:3000/api/auth/register`
   - Body (JSON):
     ```json
     {
       "companyName": "Jez Cabs Ltd",
       "companyEmail": "contact@jezcabs.com",
       "firstName": "John",
       "lastName": "Doe",
       "email": "owner@jezcabs.com",
       "password": "SecurePass@123"
     }
     ```

3. **Send the request and copy the token**

4. **Test protected endpoints:**
   - Add header: `Authorization: Bearer YOUR_TOKEN`

---

## 🎯 What's Working Now

### ✅ Fully Functional Features

1. **Company Registration**
   - Multi-tenant company creation
   - Automatic owner account creation
   - Email uniqueness validation

2. **User Authentication**
   - JWT token-based login
   - Secure password hashing (bcrypt)
   - Token expiration (7 days)

3. **User Management**
   - Create users with different roles (OWNER, MANAGER, STAFF)
   - Role-based access control
   - User activation/deactivation
   - Multi-tenant data isolation

4. **API Documentation**
   - Interactive Swagger UI
   - Auto-generated from code
   - Try-it-out functionality

### 🔒 Security Features Active

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT token authentication
- ✅ Role-based access control (RBAC)
- ✅ Multi-tenant data isolation
- ✅ Input validation
- ✅ CORS protection

---

## 📊 Available Endpoints

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new company |
| POST | `/api/auth/login` | Login with email and password |

### Protected Endpoints (Authentication Required)

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/auth/me` | Get current user profile | Any |
| POST | `/api/users` | Create a new user | OWNER, MANAGER |
| GET | `/api/users` | Get all users in company | Any |
| GET | `/api/users/:id` | Get specific user | Any |
| DELETE | `/api/users/:id` | Deactivate a user | OWNER, MANAGER |

---

## 🗄️ Database Access

### PostgreSQL

**Connection Details:**
- Host: `localhost`
- Port: `5432`
- Database: `jezcabs`
- Username: `postgres`
- Password: `postgres`

**Connect using psql:**
```bash
docker exec -it jezcabs-postgres psql -U postgres -d jezcabs
```

**View tables:**
```sql
\dt
SELECT * FROM companies;
SELECT * FROM users;
```

### MongoDB

**Connection Details:**
- Host: `localhost`
- Port: `27017`
- Database: `jezcabs`
- Username: `admin`
- Password: `admin`

**Connect using mongosh:**
```bash
docker exec -it jezcabs-mongodb mongosh -u admin -p admin --authenticationDatabase admin
```

**View collections:**
```javascript
use jezcabs
show collections
db.checklists.find()
db.telematics_logs.find()
```

### RabbitMQ Management UI

**Access the management interface:**
- URL: `http://localhost:15672`
- Username: `rabbitmq`
- Password: `rabbitmq`

### Redis

**Connect using redis-cli:**
```bash
docker exec -it jezcabs-redis redis-cli
```

---

## 🛠️ Development Commands

### Backend

```bash
# Start development server with hot reload
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Check code formatting
npm run format

# Lint code
npm run lint
```

### Docker

```bash
# Start all services
docker-compose up -d

# Start specific services
docker-compose up -d postgres mongodb

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend

# Rebuild services
docker-compose up -d --build
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
1. Ensure Docker Desktop is running
2. Check if PostgreSQL container is running: `docker ps`
3. Restart the database: `docker-compose restart postgres`

### Issue: "Port 3000 already in use"

**Solution:**
1. Find the process using port 3000: `netstat -ano | findstr :3000`
2. Kill the process or change the port in `.env`

### Issue: "Module not found"

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Docker containers won't start"

**Solution:**
1. Check Docker Desktop is running
2. Check available disk space
3. Try: `docker-compose down -v` then `docker-compose up -d`

---

## 📚 Next Steps

1. **Explore the Swagger documentation** to understand all available endpoints
2. **Create multiple users** with different roles to test RBAC
3. **Check the database** to see how data is stored
4. **Review the code** in `backend/src/modules/iam` to understand the implementation
5. **Wait for the next modules** to be implemented (Cab Management, Bookings, etc.)

---

## 💡 Tips

- Use the Swagger UI for easy API testing
- Keep Docker Desktop running while developing
- Check the backend logs for debugging: `docker-compose logs -f backend`
- The database schema is auto-created (synchronize: true in development)
- JWT tokens expire after 7 days

---

## 📞 Need Help?

- Check `IMPLEMENTATION_STATUS.md` for current progress
- Review `README.md` for detailed documentation
- Check the backend logs for error messages
- Ensure all prerequisites are installed

---

**Happy Coding! 🚀**

