#!/bin/bash

# Due Date Adjuster Startup Script

echo "Starting Due Date Adjuster..."

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "Python is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Start backend
echo "Starting backend server..."
cd backend
python -m venv venv 2>/dev/null || true
source venv/bin/activate 2>/dev/null || venv\Scripts\activate 2>/dev/null || true
pip install -r requirements.txt > /dev/null 2>&1 || true
uvicorn src.api:app --reload &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
cd ../frontend
npm install > /dev/null 2>&1 || true
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Due Date Adjuster is running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
