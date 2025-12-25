# Shadow Hire - Backend Setup

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup MongoDB**
   - Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
   - Create a cluster and get your connection string
   - The string should look like: `mongodb+srv://username:password@cluster.mongodb.net/shadow_hire?retryWrites=true&w=majority`

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the `.env` file with your MongoDB URI and other values:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

## API Endpoints

### Users (`/api/users`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /skills` - Update user skills
- `PUT /payment-method` - Update payment method
- `GET /public/:userId` - Get public user profile

### Jobs (`/api/jobs`)
- `POST /` - Create new job
- `GET /` - Get all jobs (with filters)
- `GET /search` - Search jobs
- `GET /:jobId` - Get job details
- `POST /:jobId/proposal` - Submit proposal
- `POST /:jobId/proposal/:proposalIndex/accept` - Accept proposal
- `PUT /:jobId/status` - Update job status
- `DELETE /:jobId` - Delete job

### Tasks (`/api/tasks`)
- `POST /` - Create task
- `GET /` - Get tasks
- `GET /:taskId` - Get task details
- `PUT /:taskId` - Update task
- `POST /:taskId/time-entry` - Add time entry
- `GET /burnout-warning` - Get burnout warning
- `DELETE /:taskId` - Delete task

### Chat (`/api/chat`)
- `POST /conversation` - Create/get conversation
- `GET /conversations` - Get all conversations
- `POST /:conversationId/message` - Send message
- `GET /:conversationId/messages` - Get messages
- `PUT /:conversationId/read` - Mark as read
- `DELETE /:conversationId` - Delete conversation

### Payments (`/api/payments`)
- `POST /` - Create payment
- `GET /` - Get payments
- `GET /earnings` - Get earnings
- `GET /:paymentId` - Get payment details
- `POST /:paymentId/release` - Release payment
- `POST /refund` - Refund payment
- `POST /withdraw` - Withdraw earnings

### Ratings (`/api/ratings`)
- `POST /` - Create rating
- `GET /` - Get ratings
- `GET /:userId` - Get user ratings
- `DELETE /:ratingId` - Delete rating

### Shop (`/api/shop`)
- `GET /gadgets` - Get all gadgets
- `GET /gadgets/:gadgetId` - Get gadget details
- `POST /orders` - Create order
- `GET /orders` - Get orders
- `GET /orders/:orderId` - Get order details
- `PUT /orders/:orderId/status` - Update order status
- `POST /orders/:orderId/cancel` - Cancel order

## MongoDB Collections

The following collections will be created automatically:

1. **users** - User accounts and profiles
2. **jobs** - Job postings
3. **tasks** - Task management
4. **chats** - Conversations between users
5. **payments** - Payment records
6. **ratings** - User ratings and reviews
7. **gadgets** - Gadget shop inventory
8. **orders** - Gadget orders

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database Schema Details

See `models/` directory for detailed schema information.

## Development Notes

- Make sure MongoDB is running
- Check `.env` file for configuration
- Use Postman or similar tool to test APIs
- Token expires in 7 days
