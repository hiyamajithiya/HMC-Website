#!/bin/bash

# HMC Website Deployment Script
# This script helps non-technical users deploy the website to Ubuntu server

set -e  # Exit on any error

echo "🚀 HMC Website Deployment Script"
echo "=================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    echo "Run: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    echo "Run: sudo apt-get install docker-compose-plugin"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        print_warning "Please update .env file with your actual values!"
        echo "Press any key to continue after updating .env..."
        read -n 1 -s
    else
        print_error ".env.example not found. Cannot create .env file."
        exit 1
    fi
fi

# Pull latest changes from Git
echo ""
echo "📥 Step 1: Pulling latest changes from GitHub..."
if git pull origin main; then
    print_success "Code updated successfully"
else
    print_error "Failed to pull from GitHub"
    exit 1
fi

# Stop existing containers
echo ""
echo "🛑 Step 2: Stopping existing containers..."
if docker-compose down; then
    print_success "Containers stopped"
else
    print_warning "No existing containers to stop"
fi

# Build new images
echo ""
echo "🏗️  Step 3: Building Docker images..."
if docker-compose build --no-cache; then
    print_success "Images built successfully"
else
    print_error "Failed to build images"
    exit 1
fi

# Start containers
echo ""
echo "🚀 Step 4: Starting containers..."
if docker-compose up -d; then
    print_success "Containers started"
else
    print_error "Failed to start containers"
    exit 1
fi

# Wait for services to start
echo ""
echo "⏳ Step 5: Waiting for services to start..."
sleep 10

# Health check
echo ""
echo "🔍 Step 6: Running health check..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Website is up and running!"
else
    print_warning "Website health check failed. Check logs with: docker-compose logs -f"
fi

# Clean up old images
echo ""
echo "🧹 Step 7: Cleaning up old Docker images..."
if docker image prune -af; then
    print_success "Cleanup completed"
else
    print_warning "Cleanup failed (non-critical)"
fi

# Show container status
echo ""
echo "📊 Container Status:"
echo "==================="
docker-compose ps

echo ""
echo "================================================"
print_success "Deployment completed successfully!"
echo "================================================"
echo ""
echo "📝 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop website: docker-compose down"
echo "  - Restart website: docker-compose restart"
echo "  - Check status: docker-compose ps"
echo ""
