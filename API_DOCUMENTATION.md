# Shadow Hire - Complete API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📘 USER ENDPOINTS

### Register User
**POST** `/users/register`
- **Description**: Create new user account
- **Auth**: Not required
- **Body**:
```json
{
  "uid": "firebase_uid_string",
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://example.com/photo.jpg",
  "userType": "freelancer" // or "client" or "both"
}
```
- **Response**:
```json
{
  "message": "User registered successfully",
  "user": { ...user_object },
  "token": "JWT_TOKEN"
}
```

### Login User
**POST** `/users/login`
- **Description**: Login with email
- **Auth**: Not required
- **Body**:
```json
{
  "email": "user@example.com"
}
```
- **Response**:
```json
{
  "message": "Login successful",
  "user": { ...user_object },
  "token": "JWT_TOKEN"
}
```

### Get User Profile
**GET** `/users/profile`
- **Description**: Get current user's profile
- **Auth**: Required
- **Response**: User object

### Update User Profile
**PUT** `/users/profile`
- **Description**: Update user information
- **Auth**: Required
- **Body**:
```json
{
  "displayName": "New Name",
  "bio": "Bio text",
  "hourlyRate": 50,
  "availableAfterHours": true,
  "workHourLimit": 8,
  "officeAccess": true,
  "shudivhaService": false
}
```
- **Response**: Updated user object

### Update Skills
**PUT** `/users/skills`
- **Description**: Update user skills
- **Auth**: Required
- **Body**:
```json
{
  "skills": ["React", "Node.js", "MongoDB", "UI Design"]
}
```

### Update Payment Method
**PUT** `/users/payment-method`
- **Description**: Add/update payment method
- **Auth**: Required
- **Body**:
```json
{
  "paymentMethod": "bank", // or "upi", "crypto", "wallet"
  "paymentDetails": {
    // For bank:
    "accountHolder": "John Doe",
    "accountNumber": "1234567890",
    "ifscCode": "IFSC0001234",
    // For UPI:
    "upiId": "johndoe@bank",
    // For crypto:
    "wallet": "0x1234567890abcdef"
  }
}
```

### Get Public Profile
**GET** `/users/public/:userId`
- **Description**: Get user's public profile (name, rating, skills)
- **Auth**: Not required
- **Response**: Limited user object

---

## 💼 JOB ENDPOINTS

### Create Job
**POST** `/jobs`
- **Description**: Post a new job
- **Auth**: Required (client)
- **Body**:
```json
{
  "title": "React Dashboard Development",
  "description": "Need a custom analytics dashboard...",
  "category": "Web Development",
  "requiredSkills": ["React", "JavaScript", "Tailwind CSS"],
  "experienceLevel": "intermediate",
  "budgetType": "fixed", // or "hourly"
  "budgetMin": 500,
  "budgetMax": 1000,
  "deadline": "2025-02-15",
  "estimatedHours": 40,
  "afterHoursOnly": true,
  "visibility": "public" // or "private"
}
```

### Get All Jobs
**GET** `/jobs`
- **Description**: Get jobs with filters
- **Auth**: Not required
- **Query Parameters**:
  - `status`: open, in_progress, completed, cancelled
  - `category`: Web Development, Design, Writing, etc.
  - `skills`: comma-separated list
  - `afterHoursOnly`: true/false
  - `userId`: filter by client
- **Example**: `/jobs?category=Web%20Development&afterHoursOnly=true`

### Get Job Details
**GET** `/jobs/:jobId`
- **Description**: Get specific job with proposals
- **Auth**: Not required
- **Response**: Job object with populated proposals

### Search Jobs
**GET** `/jobs/search?query=react`
- **Description**: Search jobs by title, description, skills
- **Auth**: Not required
- **Query Parameters**:
  - `query`: Search term

### Submit Proposal
**POST** `/jobs/:jobId/proposal`
- **Description**: Apply for a job
- **Auth**: Required (freelancer)
- **Body**:
```json
{
  "proposedRate": 25,
  "message": "I have 3+ years experience with React..."
}
```

### Accept Proposal
**POST** `/jobs/:jobId/proposal/:proposalIndex/accept`
- **Description**: Accept freelancer's proposal
- **Auth**: Required (client who posted job)
- **Response**: Updated job with assignments

### Update Job Status
**PUT** `/jobs/:jobId/status`
- **Description**: Change job status
- **Auth**: Required (client or assigned freelancer)
- **Body**:
```json
{
  "status": "completed" // or "in_progress", "cancelled"
}
```

### Delete Job
**DELETE** `/jobs/:jobId`
- **Description**: Delete job posting
- **Auth**: Required (job creator)
- **Conditions**: Only possible if no proposals accepted

---

## ✅ TASK ENDPOINTS

### Create Task
**POST** `/tasks`
- **Description**: Create milestone/task for job
- **Auth**: Required
- **Body**:
```json
{
  "jobId": "job_id",
  "title": "Design Homepage",
  "description": "Create responsive homepage design",
  "milestone": "Phase 1",
  "estimatedHours": 16,
  "deadline": "2025-01-20"
}
```

### Get Tasks
**GET** `/tasks`
- **Description**: Get tasks with filters
- **Auth**: Required
- **Query Parameters**:
  - `jobId`: Filter by job
  - `status`: todo, in_progress, done, blocked
  - `userId`: Filter by freelancer

### Get Task Details
**GET** `/tasks/:taskId`
- **Description**: Get specific task
- **Auth**: Required
- **Response**: Task with time entries and attachments

### Update Task
**PUT** `/tasks/:taskId`
- **Description**: Update task status/progress
- **Auth**: Required (assigned freelancer)
- **Body**:
```json
{
  "status": "in_progress", // or "done", "blocked"
  "progress": 50,
  "description": "Updated description"
}
```

### Add Time Entry
**POST** `/tasks/:taskId/time-entry`
- **Description**: Log work hours
- **Auth**: Required
- **Body**:
```json
{
  "hours": 4.5,
  "description": "Completed homepage design mockups",
  "date": "2025-01-15"
}
```

### Get Burnout Warning
**GET** `/tasks/burnout-warning`
- **Description**: Check if user exceeded daily limit
- **Auth**: Required
- **Response**:
```json
{
  "totalHours": 9.5,
  "hoursLimit": 8,
  "warning": true,
  "message": "You've exceeded daily limit by 1.5 hours"
}
```

### Delete Task
**DELETE** `/tasks/:taskId`
- **Description**: Remove task
- **Auth**: Required (task creator)

---

## 💬 CHAT ENDPOINTS

### Create/Get Conversation
**POST** `/chat/conversation`
- **Description**: Start or get existing conversation
- **Auth**: Required
- **Body**:
```json
{
  "otherUserId": "other_user_id",
  "jobId": "job_id" // optional
}
```
- **Response**: Conversation object

### Get All Conversations
**GET** `/chat/conversations`
- **Description**: Get all user conversations
- **Auth**: Required
- **Response**: Array of conversations (sorted by last message)

### Send Message
**POST** `/chat/:conversationId/message`
- **Description**: Send message
- **Auth**: Required
- **Body**:
```json
{
  "content": "Message text",
  "attachments": ["url1", "url2"] // optional
}
```

### Get Messages
**GET** `/chat/:conversationId/messages?limit=50&offset=0`
- **Description**: Get conversation messages
- **Auth**: Required
- **Query Parameters**:
  - `limit`: Number of messages (default: 50)
  - `offset`: Pagination offset

### Mark as Read
**PUT** `/chat/:conversationId/read`
- **Description**: Mark all messages as read
- **Auth**: Required

### Delete Conversation
**DELETE** `/chat/:conversationId`
- **Description**: Remove conversation
- **Auth**: Required

---

## 💰 PAYMENT ENDPOINTS

### Create Payment
**POST** `/payments`
- **Description**: Create payment (held in escrow)
- **Auth**: Required (client)
- **Body**:
```json
{
  "jobId": "job_id",
  "freelancerId": "freelancer_id",
  "amount": 750,
  "paymentMethod": "bank", // or "card", "upi", "crypto"
  "milestone": "50% - Design Approved"
}
```

### Get Payments
**GET** `/payments?userId=id&role=freelancer`
- **Description**: Get payments
- **Auth**: Required
- **Query Parameters**:
  - `userId`: User ID to filter
  - `role`: "client" or "freelancer"

### Get Payment Details
**GET** `/payments/:paymentId`
- **Description**: Get specific payment info
- **Auth**: Required

### Release Payment
**POST** `/payments/:paymentId/release`
- **Description**: Release escrow payment to freelancer
- **Auth**: Required (client)
- **Effect**: Updates freelancer totalEarnings

### Refund Payment
**POST** `/payments/refund`
- **Description**: Refund payment
- **Auth**: Required (client)
- **Body**:
```json
{
  "paymentId": "payment_id",
  "reason": "Quality not met"
}
```

### Get Earnings
**GET** `/payments/earnings`
- **Description**: Get freelancer earnings summary
- **Auth**: Required (freelancer)
- **Response**:
```json
{
  "totalEarnings": 2500,
  "completedJobs": 5,
  "payments": [...],
  "breakdown": {
    "released": 2500,
    "pending": 0,
    "thisMonth": 500
  }
}
```

### Withdraw Earnings
**POST** `/payments/withdraw`
- **Description**: Withdraw earnings
- **Auth**: Required
- **Body**:
```json
{
  "amount": 500,
  "paymentMethod": "bank"
}
```

---

## ⭐ RATING ENDPOINTS

### Create Rating
**POST** `/ratings`
- **Description**: Rate a user
- **Auth**: Required
- **Body**:
```json
{
  "toUserId": "user_to_rate_id",
  "jobId": "completed_job_id",
  "rating": 5,
  "comment": "Excellent work, very professional",
  "ratingType": "overall" // or "communication", "quality", etc.
}
```

### Get Ratings
**GET** `/ratings?userId=id&type=given`
- **Description**: Get ratings
- **Auth**: Not required
- **Query Parameters**:
  - `userId`: User who gave/received ratings
  - `type`: "given" or "received"

### Get User Ratings
**GET** `/ratings/:userId`
- **Description**: Get all ratings for a user with statistics
- **Auth**: Not required
- **Response**:
```json
{
  "userId": "user_id",
  "averageRating": 4.8,
  "totalReviews": 12,
  "distribution": {
    "5": 10,
    "4": 2,
    "3": 0,
    "2": 0,
    "1": 0
  },
  "ratings": [...]
}
```

### Delete Rating
**DELETE** `/ratings/:ratingId`
- **Description**: Remove rating
- **Auth**: Required (rating creator)

---

## 🛍️ SHOP ENDPOINTS

### Get All Gadgets
**GET** `/shop/gadgets?category=laptop&search=pro`
- **Description**: Get gadgets with filters
- **Auth**: Not required
- **Query Parameters**:
  - `category`: laptop, keyboard, mouse, headphones
  - `minPrice`: Minimum price
  - `maxPrice`: Maximum price
  - `search`: Search by name/description

### Get Gadget Details
**GET** `/shop/gadgets/:gadgetId`
- **Description**: Get specific gadget
- **Auth**: Not required

### Create Order
**POST** `/shop/orders`
- **Description**: Order gadget
- **Auth**: Required
- **Body**:
```json
{
  "gadgetId": "gadget_id",
  "quantity": 2,
  "paymentMethod": "card",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

### Get Orders
**GET** `/shop/orders?status=shipped&userId=id`
- **Description**: Get orders
- **Auth**: Required
- **Query Parameters**:
  - `status`: pending, confirmed, shipped, delivered, cancelled
  - `userId`: Filter by user

### Get Order Details
**GET** `/shop/orders/:orderId`
- **Description**: Get specific order
- **Auth**: Required

### Update Order Status
**PUT** `/shop/orders/:orderId/status`
- **Description**: Update order status (admin/system)
- **Auth**: Required
- **Body**:
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456"
}
```

### Cancel Order
**POST** `/shop/orders/:orderId/cancel`
- **Description**: Cancel order
- **Auth**: Required (order creator)
- **Effect**: Refunds payment and restores stock

---

## 🔧 ERROR RESPONSES

All error responses follow this format:
```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes**:
- `200`: Success
- `201`: Created
- `400`: Bad request
- `401`: Unauthorized (no token)
- `403`: Forbidden (no permission)
- `404`: Not found
- `500`: Server error

---

## 📝 EXAMPLE WORKFLOWS

### Complete Freelancing Job Workflow

1. **Freelancer searches for jobs**
   ```
   GET /jobs?afterHoursOnly=true&skills=React
   ```

2. **Freelancer applies**
   ```
   POST /jobs/{jobId}/proposal
   ```

3. **Client accepts proposal**
   ```
   POST /jobs/{jobId}/proposal/0/accept
   ```

4. **Freelancer creates tasks**
   ```
   POST /tasks (for each milestone)
   ```

5. **Freelancer logs time**
   ```
   POST /tasks/{taskId}/time-entry
   ```

6. **Freelancer updates progress**
   ```
   PUT /tasks/{taskId}
   ```

7. **Client creates payment**
   ```
   POST /payments (after work completion)
   ```

8. **Client releases payment**
   ```
   POST /payments/{paymentId}/release
   ```

9. **Both rate each other**
   ```
   POST /ratings (freelancer and client)
   ```

---

**Last Updated**: December 25, 2025
