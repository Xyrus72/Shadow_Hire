# Quick Start: Skill Management & Job Matching Feature

## 🚀 Getting Started

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- User logged in (Firebase + JWT)

## Step-by-Step Testing

### 1️⃣ Navigate to Skills Page
```
1. Click on "🎯 Skills" in the navbar
2. URL should be: http://localhost:5173/skills
```

### 2️⃣ Select Your Skills
```
1. Browse available skills in categories:
   - Frontend (React, Vue.js, Angular, etc.)
   - Backend (Node.js, Python, Java, etc.)
   - Database (MongoDB, PostgreSQL, MySQL, etc.)
   - DevOps (Docker, Kubernetes, AWS, etc.)
   - Other (REST API, Machine Learning, etc.)

2. Click on any skill to select/deselect it
3. Selected skills show with ✓ checkmark and green highlight
4. Skill count displays at the top
```

### 3️⃣ Save Skills
```
1. Click "💾 Save Skills" button
2. Wait for success message
3. Message: "✓ Skills updated successfully!"
```

### 4️⃣ Navigate to Job Matching
```
1. Click "💼 Jobs" in navbar OR "→ Go to Job Matching" button
2. URL should be: http://localhost:5173/jobs
```

### 5️⃣ View Jobs with Skill Match
```
Expected Display:
┌─────────────────────────────────────────┐
│ Job Title                               │
│ Description...                          │
│ Required Skills: [React] [Node.js] [...] │
│                                         │
│ Match Score Circle                      │
│ 85% High Match                          │
│ 5/6 skills matched                      │
│                                         │
│ Budget: $500-1000                       │
│ Duration: 7 days                        │
│ [Apply Now] button                      │
└─────────────────────────────────────────┘
```

### 6️⃣ Filter Jobs
```
Filter by Category:
- All Categories
- Web Development
- Mobile Development
- Design
- Writing
- Video & Media
- Marketing

Filter by Match Level:
- All Matches
- High Match (80%+)
- Medium Match (50-80%)
- Low Match (<50%)
```

### 7️⃣ Apply to a Job
```
1. Click "📤 Apply Now" on any job card
2. Modal opens showing:
   ├─ Job title and details
   ├─ Match percentage (85%)
   ├─ Matched skills (with ✓ checkmark)
   ├─ Missing skills (with ✗)
   ├─ Bid Amount input
   ├─ Cover Letter textarea
   └─ Submit/Cancel buttons

3. Enter:
   - Bid Amount: e.g., 750
   - Cover Letter: e.g., "I have 5 years of React experience..."

4. Click "Submit Proposal"
5. Success message appears
6. Job list refreshes automatically
```

## 📊 Example Scenarios

### Scenario 1: Perfect Match (90-100%)
```
User Skills: [React, Node.js, MongoDB, JavaScript, TypeScript]
Job Skills:  [React, Node.js, MongoDB]
Match:       5/5 = 100%
Result:      ⭐ Perfect Match (Green)
```

### Scenario 2: High Match (80-89%)
```
User Skills: [React, Vue.js, Node.js, MongoDB]
Job Skills:  [React, Node.js, MongoDB, PostgreSQL]
Match:       3/4 = 75%
Result:      ✓ High Match (Green)
Missing:     PostgreSQL
```

### Scenario 3: Medium Match (50-79%)
```
User Skills: [React, JavaScript, HTML/CSS]
Job Skills:  [React, Node.js, MongoDB, Docker]
Match:       1/4 = 25%
Result:      ⚡ Medium Match (Yellow)
Missing:     Node.js, MongoDB, Docker
```

### Scenario 4: Low Match (<50%)
```
User Skills: [UI Design, Figma]
Job Skills:  [Node.js, Python, Docker, Kubernetes]
Match:       0/4 = 0%
Result:      → Low Match (Red)
Note:        "Apply Now" button is disabled
```

## 🔧 Troubleshooting

### Problem: "Update Your Skills First!" Message
**Solution**: Go to Skills page and select at least one skill

### Problem: Jobs not showing
**Solution**: 
1. Check backend is running: `npm start` in `/backend`
2. Check MongoDB connection
3. Check Jobs collection has data

### Problem: Match percentage shows 0%
**Solution**: 
1. Ensure job has `requiredSkills` field in database
2. Ensure your skills match job's required skills

### Problem: Modal doesn't open
**Solution**: Clear browser cache, hard refresh (Ctrl+Shift+R)

### Problem: Skills not saving
**Solution**:
1. Check network tab in DevTools
2. Verify API token is valid
3. Check backend error logs

## 📝 Database Verification

### Check User Skills in MongoDB
```javascript
// In MongoDB Shell or Compass
db.users.findOne({ email: "your@email.com" })
// Look for: { skills: ["React", "Node.js", ...] }
```

### Check Job RequiredSkills
```javascript
// In MongoDB Shell or Compass
db.jobs.findOne({ title: /React Dashboard/ })
// Look for: { requiredSkills: ["React", "JavaScript", ...] }
```

## 🎨 UI Color Reference

| Match Level | Color | Percentage |
|------------|-------|-----------|
| Perfect Match | 🟢 Green | 80-100% |
| High Match | 🟢 Green | 80-100% |
| Medium Match | 🟡 Yellow | 50-79% |
| Low Match | 🔴 Red | <50% |

## 🔗 Related URLs

- Skills Management: `http://localhost:5173/skills`
- Job Matching: `http://localhost:5173/jobs`
- Profile: `http://localhost:5173/profile`
- Dashboard: `http://localhost:5173/dashboard`

## 📱 Mobile Testing

The feature is fully responsive:
- ✅ Skills page: Grid adapts to 2-4 columns
- ✅ Job cards: Stack vertically on mobile
- ✅ Modal: Optimized for small screens
- ✅ Navbar: Mobile menu includes Skills link

## 🐛 Debug Mode

### Enable Console Logging
Open DevTools (F12) → Console tab
You'll see:
```
API Call: GET http://localhost:5000/api/users/profile
API Call: GET http://localhost:5000/api/jobs
Match percentage calculated: 85%
Skills updated successfully
```

## ✅ Success Indicators

After completing setup, you should see:
1. ✓ Skills page accessible from navbar
2. ✓ Can select and save skills
3. ✓ Jobs display with match percentages
4. ✓ Colors change based on match level
5. ✓ Can apply to jobs with modal
6. ✓ Skill matching calculation works
7. ✓ API calls succeed (no 404/500 errors)

## 🎯 Next Steps

1. Test with different skill combinations
2. Try filtering jobs by category
3. Try filtering by match level
4. Submit proposals and check backend
5. Verify database updates correctly

---

**Need Help?** Check the main documentation:
- [SKILL_MANAGEMENT_FEATURE.md](SKILL_MANAGEMENT_FEATURE.md)
- [TROUBLESHOOTING_GUIDE.md](TROUBLESHOOTING_GUIDE.md)
