# Shadow Hire - Setup & Running Guide

## ✅ Project Status

### Backend - READY ✅
- ✅ Express.js server configured with proper CORS
- ✅ MongoDB connection setup
- ✅ All models created (User, Job, Task, Chat, Payment, Rating, Gadget, Order)
- ✅ All controllers implemented
- ✅ All routes configured
- ✅ Authentication middleware ready
- ✅ Error handling setup

### Frontend - READY ✅
- ✅ React + Vite setup
- ✅ React Router configured
- ✅ Firebase Auth integrated
- ✅ TailwindCSS styling
- ✅ API service layer created
- ✅ Auth context & hooks
- ✅ All pages created:
  - Home
  - Login (Backend integrated)
  - Register (Backend integrated)
  - Profile
  - Jobs/JobMatching
  - Chat
  - Task Dashboard
  - Payments
  - Ratings
  - Gadget Shop
  - Chatbot
  - Protected routes

---

## 🚀 Quick Start Guide

### Prerequisites
```
- Node.js v16+ installed
- MongoDB Atlas account (or local MongoDB)
- Firebase project setup
- npm or yarn package manager
```

### Backend Setup

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables (.env):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shadow_hire
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
NODE_ENV=development
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

4. **Start the backend server:**
```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

Backend will run on: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend folder:**
```bash
cd dakat
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables (.env):**
```
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=AIzaSyB00gu_KVI7yHXTXpVCs-pQkZG4LxgD6IU
VITE_FIREBASE_AUTH_DOMAIN=shadowhire-6700a.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=shadowhire-6700a
VITE_FIREBASE_STORAGE_BUCKET=shadowhire-6700a.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=943520230924
VITE_FIREBASE_APP_ID=1:943520230924:web:20527a761027e59e120829
```

4. **Start the frontend development server:**
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🔄 Full Application Flow

### 1. User Registration
- User goes to `/auth/register`
- Fills in email, password, name
- Submits form → Backend creates user in MongoDB
- Receives JWT token
- Token stored in localStorage
- Redirected to profile page

### 2. User Login
- User goes to `/auth/login`
- Enters email
- Submits → Backend verifies email exists
- Returns JWT token
- Token stored in localStorage
- Redirected to dashboard

### 3. Protected Routes
- All routes except `/` and `/auth/*` are protected
- `ProtectedRoute` component checks if user is logged in
- If no user → redirects to `/auth/login`
- If user exists → renders component

### 4. API Calls
- All API calls use `api.js` service layer
- Automatically includes JWT token in headers
- Error handling with try/catch
- Response parsing and validation

---

## 🛠️ Key Features Implemented

### Authentication
- ✅ Firebase Authentication (Google Sign-in ready)
- ✅ MongoDB User storage
- ✅ JWT Token management
- ✅ Protected routes
- ✅ Auto logout on token expiry

### Job Posting & Matching
- ✅ Create, read, update jobs
- ✅ Submit proposals
- ✅ Accept freelancers
- ✅ Job filtering and search

### Task Management
- ✅ Create tasks for jobs
- ✅ Time tracking
- ✅ Task status updates
- ✅ Burnout protection warnings

### Chat System
- ✅ Create conversations
- ✅ Send/receive messages
- ✅ Message history
- ✅ Read receipts

### Payment Management
- ✅ Create payments (escrow)
- ✅ Release payments
- ✅ Refund system
- ✅ Multiple payment methods

### Rating System
- ✅ Create ratings
- ✅ Read user ratings
- ✅ Average rating calculation

### Shop System
- ✅ Browse gadgets
- ✅ Create orders
- ✅ Track shipments
- ✅ Order management

---

## 🔍 Testing the Application

### Test Login Flow
```
1. Go to http://localhost:5173
2. Click "Sign in"
3. Go to http://localhost:5173/auth/register
4. Create account with email, password, name
5. Should redirect to profile page
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Get all jobs
curl http://localhost:5000/api/jobs

# Create a job (requires token)
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{...}'
```

---

## 📁 Project Structure

```
project1/
├── backend/
│   ├── config/        # Database config
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth, error handling
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── .env            # Environment variables
│   ├── server.js       # Express app
│   └── package.json
│
└── dakat/             # Frontend
    ├── src/
    │   ├── components/    # React components
    │   ├── contexts/      # Auth context
    │   ├── firebase/      # Firebase config
    │   ├── hooks/         # Custom hooks
    │   ├── layouts/       # Page layouts
    │   ├── pages/         # Page components
    │   ├── router/        # React Router config
    │   ├── services/      # API service
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env              # Environment variables
    ├── vite.config.js    # Vite config
    └── package.json
```

---

## 🐛 Troubleshooting

### CORS Errors
- Make sure backend is running on port 5000
- Check `VITE_API_URL` in frontend .env
- Backend CORS is configured for localhost:5173

### Database Connection Issues
- Verify MongoDB URI in .env
- Check network access in MongoDB Atlas
- Ensure MongoDB is running

### Auth Token Issues
- Clear localStorage: `localStorage.clear()`
- Login again to get fresh token
- Check JWT_SECRET in backend .env

### Hot Module Replacement (HMR) Issues
- Restart both frontend and backend
- Clear node_modules and reinstall if needed

---

## 📝 Next Steps

1. **Deploy Database**
   - Set up MongoDB Atlas production instance
   - Update connection URI

2. **Configure Firebase**
   - Add real Firebase credentials
   - Enable Google Sign-in

3. **Environment Setup**
   - Create .env files for production
   - Set proper JWT secrets
   - Configure CORS for production URLs

4. **Testing**
   - Write unit tests for controllers
   - Write integration tests
   - Test all API endpoints

5. **Deployment**
   - Deploy backend to cloud (Heroku, AWS, etc.)
   - Deploy frontend to Vercel/Netlify
   - Set up CI/CD pipelines

---

## 📞 Support

For issues or questions:
1. Check error logs in console
2. Verify all environment variables are set
3. Ensure both backend and frontend servers are running
4. Check network tab in browser DevTools for API calls

---

**Status**: ✅ READY FOR DEVELOPMENT
**Last Updated**: December 25, 2025
