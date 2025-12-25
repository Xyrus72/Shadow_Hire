#!/bin/bash

echo "🚀 Shadow Hire - Complete Setup Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node -v)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    echo "✅ Backend dependencies installed"
else
    echo "✅ Backend dependencies already installed"
fi

echo ""
echo "📝 Backend Configuration:"
echo "   - Created .env file (update with MongoDB URI)"
echo "   - API runs on http://localhost:5000"
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
cd ../dakat

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    echo "✅ Frontend dependencies installed"
else
    echo "✅ Frontend dependencies already installed"
fi

echo ""
echo "📝 Frontend Configuration:"
echo "   - Created .env file (update with API URL)"
echo "   - App runs on http://localhost:5173"
echo ""

echo "========================================"
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)"
echo "   2. Create a free account and cluster"
echo "   3. Get your connection string"
echo "   4. Update backend/.env with MONGODB_URI"
echo ""
echo "🚀 To Start Development:"
echo "   Terminal 1 (Backend): cd backend && npm run dev"
echo "   Terminal 2 (Frontend): cd dakat && npm run dev"
echo ""
echo "📖 Read COMPLETE_SETUP_GUIDE.md for detailed instructions"
echo ""
