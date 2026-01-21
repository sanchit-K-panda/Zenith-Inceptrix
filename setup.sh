#!/bin/bash

# Smart Academic Dashboard - Quick Start Script
# This script automates the setup process

set -e

echo "================================"
echo "Smart Academic Dashboard Setup"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️ Node.js is not installed. Please install Node.js 16 or higher.${NC}"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found:${NC} $(node -v)"
echo -e "${GREEN}✓ npm found:${NC} $(npm -v)"
echo ""

# Setup Backend
echo -e "${BLUE}Step 1: Setting up Backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Check if MongoDB is running
echo "Checking MongoDB connection..."
if ! mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️ Warning: MongoDB is not running!${NC}"
    echo "Please ensure MongoDB is running on localhost:27017"
    echo ""
    echo "Quick fix:"
    echo "  macOS: brew services start mongodb-community"
    echo "  Windows: Run MongoDB service from Services"
    echo "  Linux: sudo systemctl start mongodb"
    echo ""
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file with defaults..."
    cp .env.example .env
fi

# Seed database
echo "Seeding database with demo data..."
npm run seed

echo -e "${GREEN}✓ Backend setup complete!${NC}"
echo ""

# Setup Frontend
echo -e "${BLUE}Step 2: Setting up Frontend...${NC}"
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Create .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cp .env.local.example .env.local
fi

echo -e "${GREEN}✓ Frontend setup complete!${NC}"
echo ""

# Display instructions
echo "================================"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo "================================"
echo ""
echo -e "${BLUE}To run the application:${NC}"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo -e "${BLUE}Then open:${NC} http://localhost:3000"
echo ""
echo -e "${BLUE}Demo Credentials:${NC}"
echo "  Student:  student1@dashboard.com / Student@123"
echo "  Teacher:  teacher1@dashboard.com / Teacher@123"
echo "  Parent:   parent1@dashboard.com / Parent@123"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "  Backend:  backend/README.md"
echo "  Frontend: frontend/README.md"
echo "  Project:  README.md"
echo ""
