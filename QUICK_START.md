# 🚀 QUICK START - Run in 60 Seconds

## Copy & Paste Commands

### Terminal 1: Start Backend

```bash
cd c:\project1\backend
npm install
npm run dev
```

**Expected Output**:
```
╔════════════════════════════════════╗
║      SHADOW HIRE API SERVER       ║
╚════════════════════════════════════╝

  🚀 Server running on port 5000
  📡 API Base URL: http://localhost:5000/api
  ✅ Health Check: http://localhost:5000/api/health
```

---

### Terminal 2: Start Frontend

```bash
cd c:\project1\dakat
npm install
npm run dev
```

**Expected Output**:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

### Terminal 3: Test It

```bash
# Test backend is running
curl http://localhost:5000/api/health

# Should return:
# {"status":"Server is running",...}
```

---

## Step-by-Step Test

1. **Open Browser**: Go to `http://localhost:5173`
2. **See Homepage**: Click "Register" or go to `/auth/register`
3. **Create Account**: 
   - Email: `test@example.com`
   - Password: `password123` (8+ chars)
   - Name: `Test User`
4. **Submit**: Click "Create Account"
5. **Check**: Should show success and redirect to profile
6. **Verify**: You're now logged in!

---

## What's Running

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Backend API | 5000 | http://localhost:5000/api | ✅ Running |
| Frontend | 5173 | http://localhost:5173 | ✅ Running |
| Database | N/A | MongoDB Atlas | ✅ Connected |

---

## Environment Variables Already Set

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=AIzaSyB00gu_KVI7yHXTXpVCs-pQkZG4LxgD6IU
VITE_FIREBASE_PROJECT_ID=shadowhire-6700a
```

✅ **All set! No changes needed!**

---

## API Endpoints Ready

```
POST   /api/users/register          - Register new user
POST   /api/users/login              - Login user
GET    /api/users/profile            - Get user profile
GET    /api/jobs                     - List jobs
POST   /api/jobs                     - Create job
GET    /api/chat/conversations       - Get chats
POST   /api/payments                 - Create payment
GET    /api/shop/gadgets             - Get gadgets
...and more
```

---

## Key Files to Know

| File | Purpose | Location |
|------|---------|----------|
| `server.js` | Backend entry | `backend/server.js` |
| `main.jsx` | Frontend entry | `dakat/src/main.jsx` |
| `api.js` | API service | `dakat/src/services/api.js` |
| `AuthProvider.jsx` | Auth state | `dakat/src/contexts/authcontext/` |
| `.env` | Config | Both directories |

---

## Troubleshooting

### Port Already in Use?
```bash
# Kill process on 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on 5173 (frontend)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Module Not Found?
```bash
# Clear cache and reinstall
cd backend
rm -r node_modules package-lock.json
npm install
```

### Can't Connect to Database?
Check `.env` file has valid `MONGODB_URI`

### API Calls Failing?
Check:
1. Backend is running (port 5000)
2. Frontend .env has correct `VITE_API_URL`
3. Network tab in browser DevTools for error details

---

## First Actions After Starting

✅ Test Homepage: `http://localhost:5173/`
✅ Register New User: `http://localhost:5173/auth/register`
✅ Login: `http://localhost:5173/auth/login`
✅ View Profile: `http://localhost:5173/profile` (after login)
✅ View Jobs: `http://localhost:5173/jobs` (after login)

---

## That's It! 

Your full-stack application is now running with:
- ✅ React frontend
- ✅ Express backend
- ✅ MongoDB database
- ✅ User authentication
- ✅ All API endpoints
- ✅ Complete UI

**Everything works. Start developing!** 🎉

---

## Next: Add Your Features

1. Edit components in `dakat/src/pages/`
2. Add APIs in `backend/controllers/`
3. Changes auto-reload (HMR)
4. Check console for errors

**Happy coding!** 🚀

---

**Last Updated**: December 25, 2025
