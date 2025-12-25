# Troubleshooting & Common Issues Guide

## 🔴 Common Issues & Solutions

### 1. CORS Errors in Browser Console

**Error**: `Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solutions**:
```
✅ Ensure backend is running on port 5000
✅ Check VITE_API_URL in frontend .env is correct
✅ Verify backend CORS configuration in server.js
✅ Make sure credentials: 'include' is in fetch options
✅ Browser cache: Clear and refresh (Ctrl+Shift+R)
```

**Backend check**:
```javascript
// This should be in server.js
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
```

---

### 2. API Calls Return 401 Unauthorized

**Error**: `{"error":"No token provided"}` or `{"error":"Invalid token"}`

**Solutions**:
```
✅ Make sure token is stored in localStorage
✅ Verify token is being sent in Authorization header
✅ Check JWT_SECRET in backend .env
✅ Ensure token hasn't expired (7-day expiry)
✅ Try logging out and logging in again
```

**Check token**:
```javascript
// In browser console:
localStorage.getItem('authToken')  // Should return a long token string
localStorage.getItem('shadowUser')  // Should return user object
```

---

### 3. Cannot Connect to MongoDB

**Error**: `Error connecting to MongoDB: MongoServerError: connect ECONNREFUSED` or `getaddrinfo ENOTFOUND`

**Solutions**:
```
✅ Check MONGODB_URI in backend .env
✅ Verify MongoDB Atlas credentials are correct
✅ Ensure IP address is whitelisted in MongoDB Atlas
✅ Check internet connection
✅ Verify cluster is running in MongoDB Atlas
✅ Try connection string without special characters issue
```

**Test connection**:
```bash
# In backend directory
mongo "your_mongodb_uri"
```

---

### 4. Register/Login Not Working

**Error**: `Failed to create account` or `Invalid credentials`

**Solutions**:

**For Registration**:
```
✅ Verify email format is valid
✅ Check password is at least 8 characters
✅ Ensure name is not empty
✅ Verify backend is running and responds to health check
✅ Check network tab in DevTools for exact error
✅ Verify MongoDB is connected
```

**For Login**:
```
✅ Verify email exists in database
✅ Check database has user with that email
✅ Ensure password requirement is correct (backend only checks email)
✅ Try registering a new account first
✅ Check browser console for exact error message
```

**Test Backend**:
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Should return:
# {"status":"Server is running","timestamp":"...","environment":"development","uptime":...}
```

---

### 5. Frontend Won't Load / Blank Page

**Error**: `Blank white/black page, no content`

**Solutions**:
```
✅ Check console for errors (F12 → Console tab)
✅ Verify vite server is running (should say "ready in Xms")
✅ Check if port 5173 is already in use
✅ Clear browser cache: Ctrl+Shift+Delete
✅ Hard refresh: Ctrl+Shift+R (not Ctrl+R)
✅ Try different browser
```

**Kill process on port 5173**:
```bash
# Windows PowerShell
$proc = Get-Process -ErrorAction SilentlyContinue | Where-Object {$_.ProcessName -like "*5173*"}
if ($proc) { Stop-Process -Id $proc.Id -Force }

# Then restart frontend
cd dakat
npm run dev
```

---

### 6. Protected Routes Redirect to Login

**Error**: Always redirected to `/auth/login` even though logged in

**Solutions**:
```
✅ Check localStorage for authToken and shadowUser
✅ Verify token is valid (not expired)
✅ Check AuthContext is providing user
✅ Verify ProtectedRoute component logic
✅ Check Firebase auth state (useAuth hook)
```

**Debug in console**:
```javascript
// Check auth state
localStorage.getItem('authToken')
localStorage.getItem('shadowUser')
JSON.parse(localStorage.getItem('shadowUser'))
```

---

### 7. API Calls Fail with 404

**Error**: `404 Not Found` when calling API endpoints

**Solutions**:
```
✅ Verify route path is correct (case-sensitive)
✅ Check route is registered in server.js
✅ Verify endpoint exists in controller
✅ Check HTTP method is correct (GET, POST, etc)
✅ Ensure {jobId} is replaced with actual ID, not literal
```

**Test endpoint**:
```bash
# These work:
curl http://localhost:5000/api/health
curl http://localhost:5000/api/jobs

# These need corrections:
curl http://localhost:5000/api/job        # ❌ wrong path
curl http://localhost:5000/api/JOBS       # ❌ case sensitive
```

---

### 8. Environment Variables Not Loading

**Error**: `VITE_API_URL is undefined` or `process.env.MONGODB_URI is undefined`

**Solutions**:

**Frontend**:
```
✅ Create .env file in /dakat directory (not /dakat/src)
✅ Variables must start with VITE_ for Vite
✅ Restart frontend server after adding .env
✅ Check for trailing spaces or quotes
```

**Backend**:
```
✅ Create .env file in /backend directory
✅ No VITE_ prefix needed in backend
✅ Restart backend server after adding .env
✅ Use dotenv.config() at top of server.js
```

**Frontend .env location**:
```
dakat/
├── .env          ← HERE (not in src/)
├── src/
├── index.html
└── vite.config.js
```

---

### 9. Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5000` or `:5173`

**Solutions**:

```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F

# Or change port in backend
# Edit .env: PORT=5001
```

---

### 10. JSON Response Parse Error

**Error**: `SyntaxError: Unexpected token < in JSON at position 0`

**Solutions**:
```
✅ Check API endpoint returns valid JSON
✅ Verify endpoint exists and is reachable
✅ Check response is not HTML error page
✅ Ensure Content-Type header is application/json
✅ Check request is reaching correct endpoint
```

**Debug response**:
```javascript
// In api.js, before parsing:
const responseText = await response.text();
console.log('Response text:', responseText);
const responseData = JSON.parse(responseText);
```

---

## 🟡 Performance Issues

### App Runs Slowly

**Solutions**:
```
✅ Clear browser cache
✅ Check network tab for slow API calls
✅ Verify database queries are efficient
✅ Check for memory leaks in DevTools
✅ Reduce bundle size (tree shaking in Vite)
```

### API Calls Take Long Time

**Solutions**:
```
✅ Check MongoDB query performance
✅ Add database indexes for frequently queried fields
✅ Reduce data returned from API
✅ Implement pagination
✅ Cache responses in frontend
```

---

## 🟢 Advanced Debugging

### Enable Detailed Logging

**Backend**:
```javascript
// Add to server.js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});
```

**Frontend**:
```javascript
// In api.js
const apiCall = async (endpoint, method = 'GET', data = null) => {
  console.log(`API: ${method} ${endpoint}`, data);
  // ... rest of function
};
```

### Use Browser DevTools

```
1. Open DevTools (F12)
2. Network tab: See all API calls
3. Console tab: See errors
4. Application tab: See localStorage
5. Storage: Check cookies and session
```

### Database Query Testing

```javascript
// In backend, test queries
mongo "your_mongodb_uri"
use shadow_hire
db.users.find()
db.jobs.find()
db.payment.countDocuments()
```

---

## 📋 Pre-Deployment Checklist

### Before Pushing to Production

- [ ] All environment variables set
- [ ] No hardcoded API URLs (use .env)
- [ ] Error messages don't expose internal details
- [ ] CORS configured for production URLs
- [ ] Database has production URI
- [ ] JWT_SECRET is strong and random
- [ ] Passwords hashed (bcryptjs)
- [ ] Rate limiting implemented
- [ ] Request validation in place
- [ ] Logging configured
- [ ] HTTPS enforced
- [ ] Database backups configured
- [ ] Monitoring/alerts set up

---

## 🆘 Getting Help

### If You're Still Stuck:

1. **Check Error Message**
   - Read the full error message
   - Check line number mentioned

2. **Check Console**
   - Browser console (F12 → Console)
   - Terminal where backend is running
   - Check for stack traces

3. **Enable Debug Mode**
   - Add console.log statements
   - Check Network tab in DevTools
   - Check server logs

4. **Restart Services**
   - Stop frontend: Ctrl+C
   - Stop backend: Ctrl+C
   - Clear node_modules (optional)
   - npm install
   - Start fresh

5. **Check Documentation**
   - [Vite Docs](https://vitejs.dev)
   - [Express Docs](https://expressjs.com)
   - [React Docs](https://react.dev)
   - [MongoDB Docs](https://docs.mongodb.com)

---

## 📞 Support Resources

### Useful Commands

```bash
# Check Node version
node --version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -r node_modules package-lock.json
npm install

# Start fresh
npm install
npm run dev

# Test health check
curl http://localhost:5000/api/health
```

### File Locations to Check

```
Backend:
- .env (environment variables)
- server.js (main file)
- config/database.js (MongoDB connection)
- middleware/auth.js (JWT logic)

Frontend:
- .env (environment variables)
- src/main.jsx (entry point)
- src/services/api.js (API calls)
- src/contexts/authcontext/ (auth state)
```

---

## ✅ Testing Checklist

After fixes, test:

- [ ] Backend health check works
- [ ] Can register new user
- [ ] Can login with registered user
- [ ] Protected routes accessible when logged in
- [ ] Redirected to login when not authenticated
- [ ] Can create a job posting
- [ ] Can view job listings
- [ ] Can send a message
- [ ] Can create payment
- [ ] Token persists on page refresh
- [ ] Logout clears token
- [ ] No errors in browser console
- [ ] No errors in backend terminal

---

**Last Updated**: December 25, 2025
**Status**: Complete troubleshooting guide for production readiness
