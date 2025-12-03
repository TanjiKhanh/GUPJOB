#!/bin/bash

# GupJob Local Development Setup Script
# This script sets up the entire project for local development

echo "================================================"
echo "GupJob - Local Development Setup"
echo "================================================"
echo ""

# Step 1: Start Docker containers
echo "Step 1: Starting Docker containers..."
echo "Make sure Docker is running!"
cd infra
docker-compose up -d
if [ $? -eq 0 ]; then
    echo "✓ Docker containers started successfully"
else
    echo "✗ Failed to start Docker containers"
    exit 1
fi
cd ..

# Step 2: Wait for PostgreSQL to be ready
echo ""
echo "Step 2: Waiting for PostgreSQL to be ready..."
sleep 5

# Step 3: Setup auth service
echo ""
echo "Step 3: Setting up Auth Service..."
cd services/auth

# Install dependencies
echo "  - Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "  ✓ Dependencies installed"
else
    echo "  ✗ Failed to install dependencies"
    exit 1
fi

# Generate Prisma client
echo "  - Generating Prisma client..."
npm run prisma:generate
if [ $? -eq 0 ]; then
    echo "  ✓ Prisma client generated"
else
    echo "  ✗ Failed to generate Prisma client"
    exit 1
fi

# Run migrations
echo "  - Running database migrations..."
npm run prisma:dbpush
if [ $? -eq 0 ]; then
    echo "  ✓ Migrations completed"
else
    echo "  ✗ Failed to run migrations"
fi

cd ../..

# Step 4: Summary
echo ""
echo "================================================"
echo "Setup Complete!"
echo "================================================"
echo ""
echo "To start the Auth service:"
echo "  cd services/auth"
echo "  npm run start:dev"
echo ""
echo "The service will be available at:"
echo "  http://localhost:3000"
echo ""
echo "Health check endpoint:"
echo "  http://localhost:3000/health"
echo ""
