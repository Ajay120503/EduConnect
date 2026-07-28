#!/bin/bash

# EduConnect - Start Script
# Checks for git updates, then starts both frontend and backend

FRONTEND_PORT=5173
BACKEND_PORT=5000
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🔍 Checking for updates..."

# Fetch latest from remote (silently)
git fetch origin 2>/dev/null

# Get current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

# Compare local vs remote
LOCAL=$(git rev-parse HEAD 2>/dev/null)
REMOTE=$(git rev-parse "origin/$BRANCH" 2>/dev/null)

if [ "$LOCAL" != "$REMOTE" ] && [ -n "$REMOTE" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  ⚠️  UPDATE AVAILABLE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Branch:    $BRANCH"
  echo "  Local:     $(echo $LOCAL | head -c 8)"
  echo "  Remote:    $(echo $REMOTE | head -c 8)"
  echo ""
  echo "  Run the following to update:"
  echo "    git pull origin $BRANCH"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  
  # Ask user if they want to continue with outdated version
  read -p "  Continue with current version? (y/N): " CONTINUE
  if [ "$CONTINUE" != "y" ] && [ "$CONTINUE" != "Y" ]; then
    echo "  ❌ Aborted. Please run 'git pull origin $BRANCH' and try again."
    exit 1
  fi
  echo ""
else
  echo "  ✅ You are up to date with origin/$BRANCH"
  echo ""
fi

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

# Start frontend on port 5173 (avoids PWA cache conflicts)
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