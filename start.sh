#!/bin/bash

# EduConnect - Start Script
# Kills any existing processes on the frontend and backend ports, then starts both

FRONTEND_PORT=3000
BACKEND_PORT=5000
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🧹 Cleaning up existing processes..."

# Force kill all vite and node server processes
pkill -9 -f vite 2>/dev/null
pkill -9 -f "node server.js" 2>/dev/null
pkill -9 -f "node.*server" 2>/dev/null

# Kill any process on frontend port
FRONTEND_PID=$(lsof -ti:$FRONTEND_PORT 2>/dev/null)
if [ -n "$FRONTEND_PID" ]; then
  echo "  Killing process on port $FRONTEND_PORT (PID: $FRONTEND_PID)"
  kill -9 $FRONTEND_PID 2>/dev/null
fi

# Kill any process on backend port
BACKEND_PID=$(lsof -ti:$BACKEND_PORT 2>/dev/null)
if [ -n "$BACKEND_PID" ]; then
  echo "  Killing process on port $BACKEND_PORT (PID: $BACKEND_PID)"
  kill -9 $BACKEND_PID 2>/dev/null
fi

sleep 1
echo "✅ Ports cleared."

# Copy .env.example to .env if it doesn't exist
if [ ! -f "$PROJECT_DIR/server/.env" ]; then
  echo "📝 Creating server/.env from .env.example..."
  cp "$PROJECT_DIR/server/.env.example" "$PROJECT_DIR/server/.env"
  echo "⚠️  Please edit server/.env with your actual credentials before using in production."
fi

echo ""
echo "🚀 Starting EduConnect..."
echo "   Backend:  http://localhost:$BACKEND_PORT"
echo "   Frontend: http://localhost:$FRONTEND_PORT"
echo ""
echo "   ⚠️  First time? Clear your browser's service worker:"
echo "       chrome://serviceworker-internals/ → Unregister localhost"
echo ""

# Start backend in background
cd "$PROJECT_DIR/server" && node server.js &
BACKEND_PID=$!

# Start frontend on port 3000 (avoids PWA cache conflicts)
cd "$PROJECT_DIR/client" && npx vite --host --port $FRONTEND_PORT &
FRONTEND_PID=$!

# Trap Ctrl+C to kill both processes
trap "
  echo ''
  echo '🛑 Shutting down EduConnect...'
  kill -9 $BACKEND_PID $FRONTEND_PID 2>/dev/null
  pkill -9 -f vite 2>/dev/null
  pkill -9 -f 'node server.js' 2>/dev/null
  echo '👋 Goodbye!'
  exit 0
" SIGINT SIGTERM

# Wait for either process to exit
wait