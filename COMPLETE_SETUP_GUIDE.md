# Shadow Hire - Complete Platform Setup Guide

## Project Structure

```
project1/
├── dakat/ (Frontend - React)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── JobMatching/
│   │   │   ├── Chat/
│   │   │   ├── TaskDashboard/
│   │   │   ├── Ratings/
│   │   │   ├── Payment/
│   │   │   ├── Chatbot/
│   │   │   ├── GadgetShop/
│   │   │   ├── Profile/
│   │   │   └── shared/ (Navbar, Footer)
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── hooks/
│   │   ├── contexts/
│   │   └── router/
│   ├── .env
│   └── package.json
│
└── backend/ (Node.js + Express + MongoDB)
    ├── models/
    │   ├── User.js
    │   ├── Job.js
    │   ├── Task.js
    │   ├── Chat.js
    │   ├── Payment.js
    │   ├── Rating.js
    │   ├── Gadget.js
    │   └── Order.js
    ├── controllers/
    │   ├── userController.js
    │   ├── jobController.js
    │   ├── taskController.js
    │   ├── chatController.js
    │   ├── paymentController.js
    │   ├── ratingController.js
    │   └── shopController.js
    ├── routes/
    │   ├── userRoutes.js
    │   ├── jobRoutes.js
    │   ├── taskRoutes.js
    │   ├── chatRoutes.js
    │   ├── paymentRoutes.js
    │   ├── ratingRoutes.js
    │   └── shopRoutes.js
    ├── middleware/
    │   └── auth.js
    ├── config/
    │   └── database.js
    ├── server.js
    ├── .env
    └── package.json
```

## MongoDB Setup (IMPORTANT!)

### Step 1: Create MongoDB Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new organization
4. Create a new project

### Step 2: Create a Cluster
1. Click "Create" in the Databases section
2. Choose "Shared" (Free tier)
3. Select your preferred cloud provider (AWS/Google/Azure)
4. Choose a region close to you
5. Click "Create Cluster"

### Step 3: Setup Connection
1. In the cluster, click "Connect"
2. Add your IP address or select "Allow access from anywhere"
3. Create a Database User:
   - Username: `shadow_hire_user`
   - Password: Choose a strong password
4. Choose "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your actual password
7. Replace `shadow_hire` with `shadow_hire` (or your db name)

**Connection String Example:**
```
mongodb+srv://shadow_hire_user:YOUR_PASSWORD@cluster.mongodb.net/shadow_hire?retryWrites=true&w=majority
```

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd dakat
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create/update `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Start development server
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create/update `.env`:
```
MONGODB_URI=mongodb+srv://shadow_hire_user:YOUR_PASSWORD@cluster.mongodb.net/shadow_hire?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
```

### 4. Start backend server
```bash
npm run dev
```

Backend will run on `http://localhost:5000`
API Base URL: `http://localhost:5000/api`

## Features Overview

### 1. Job Matching (Smart Freelancer Matching)
- AI-powered job recommendations (95%+ match scores)
- Filter by skills and availability
- After-hours work prioritization
- Proposal system with accept/reject

### 2. In-App Chat
- Real-time messaging between clients and freelancers
- File sharing (designs, requirements, docs)
- No phone number sharing needed
- Conversation history

### 3. Task Management Dashboard
- Kanban board (To Do → In Progress → Done)
- Time tracking per task
- Burnout detection (warns if >8 hours/day)
- Break reminders
- Work hour limits

### 4. Payment Gateway
- Secure escrow system
- Multiple payment methods:
  - Bank Transfer
  - UPI/Mobile Payment
  - Digital Wallet
  - Cryptocurrency
- Hourly and project-based payments
- Invoice generation

### 5. Rating & Review System
- Verified reviews from completed jobs
- Client and freelancer ratings
- Rating distribution charts
- Trust building through transparency

### 6. AI Chatbot Support (24/7)
- Instant help for payments
- Job posting guidance
- Profile setup assistance
- FAQ and common issues

### 7. Gadget Discount Shop
- 20-45% discount on tech products
- Laptops, keyboards, mice, headphones
- Order management and tracking
- Exclusive for registered workers

### 8. Office & Local Support (Unique!)
- Physical co-working office
- Quiet workspace after hours
- Meeting rooms for team projects
- Drop & Pick service (Shuvidha) for late-hour workers

## API Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "firebase_uid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "userType": "freelancer"
  }'
```

### Create a Job
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Dashboard Development",
    "description": "Build a custom dashboard for analytics",
    "category": "Web Development",
    "requiredSkills": ["React", "JavaScript", "Tailwind CSS"],
    "budgetType": "fixed",
    "budgetMin": 500,
    "budgetMax": 1000,
    "deadline": "2025-02-15",
    "estimatedHours": 40,
    "afterHoursOnly": true
  }'
```

### Submit a Proposal
```bash
curl -X POST http://localhost:5000/api/jobs/{jobId}/proposal \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "proposedRate": 25,
    "message": "I can complete this in 3 weeks with high quality"
  }'
```

### Create a Payment
```bash
curl -X POST http://localhost:5000/api/payments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "job_id",
    "freelancerId": "freelancer_id",
    "amount": 750,
    "paymentMethod": "bank",
    "milestone": "50% - Design Complete"
  }'
```

## Database Collections

### Users
```javascript
{
  uid, email, displayName, photoURL,
  userType, bio, skills, hourlyRate,
  availableAfterHours, workHourLimit,
  averageRating, totalReviews,
  bankDetails, upiId, cryptoWallet,
  totalEarnings, projectsCompleted,
  totalHoursWorked, officeAccess
}
```

### Jobs
```javascript
{
  clientId, title, description, category,
  requiredSkills, budgetType, budgetMin, budgetMax,
  deadline, estimatedHours, afterHoursOnly,
  status, proposals[], assignedTo,
  attachments, visibility
}
```

### Tasks
```javascript
{
  jobId, freelancerId, title, description,
  milestone, status, estimatedHours, actualHours,
  deadline, completedAt, progress,
  timeEntries[], attachments
}
```

### Payments
```javascript
{
  jobId, clientId, freelancerId, amount,
  paymentMethod, milestone, status,
  escrowReleaseDate, escrowReleased,
  transactionId, invoiceNumber
}
```

### Ratings
```javascript
{
  fromUserId, toUserId, jobId,
  rating (1-5), comment, ratingType, verified
}
```

## Troubleshooting

### Backend won't connect to MongoDB
- Check MongoDB connection string in `.env`
- Ensure IP is whitelisted in MongoDB Atlas
- Verify username/password are correct
- Check if cluster is active

### CORS Error
- Make sure backend is on `http://localhost:5000`
- Frontend will be on `http://localhost:5173`
- CORS is enabled in `server.js`

### JWT Token Issues
- Token expires in 7 days
- Always include `Authorization: Bearer {token}` header
- Check if JWT_SECRET matches in backend

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows
```

## Next Steps

1. Setup MongoDB and get connection string
2. Configure `.env` files in both frontend and backend
3. Install dependencies: `npm install`
4. Start backend: `npm run dev` (in backend folder)
5. Start frontend: `npm run dev` (in dakat folder)
6. Test APIs using Postman or curl
7. Connect frontend to backend via API service
8. Deploy to production (Vercel/Heroku)

## Production Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Heroku/Railway)
```bash
git push heroku main
```

Update `.env` variables with production URLs.

## Support & Documentation

- Frontend: Built with React, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB
- Authentication: JWT + Firebase
- Payment: Escrow system (mock implementation)
- Chat: Real-time messaging infrastructure ready

## Security Notes

- Change JWT_SECRET in production
- Use HTTPS for all API calls
- Validate all inputs on backend
- Hash sensitive data
- Use environment variables for secrets
- Enable SSL/TLS on MongoDB
- Rate limit API endpoints
- Implement proper access control

---

**Happy Coding! 🚀**
