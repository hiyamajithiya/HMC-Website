#!/bin/bash

# SSL Certificate Setup Script using Let's Encrypt
# This script helps set up HTTPS for the HMC website

set -e

echo "🔒 SSL Certificate Setup Script"
echo "================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Get domain name
echo "Enter your domain name (e.g., himanshumajithiya.com):"
read DOMAIN

if [ -z "$DOMAIN" ]; then
    print_error "Domain name cannot be empty"
    exit 1
fi

echo ""
echo "Enter your email address for Let's Encrypt notifications:"
read EMAIL

if [ -z "$EMAIL" ]; then
    print_error "Email cannot be empty"
    exit 1
fi

echo ""
print_warning "Make sure:"
echo "  1. Your domain DNS is pointing to this server's IP"
echo "  2. Ports 80 and 443 are open in firewall"
echo "  3. No other service is using ports 80/443"
echo ""
echo "Press any key to continue or Ctrl+C to cancel..."
read -n 1 -s

# Create directories
echo ""
echo "📁 Creating certificate directories..."
mkdir -p certbot/conf
mkdir -p certbot/www

# Start nginx temporarily for certificate validation
echo ""
echo "🚀 Starting nginx for certificate validation..."
docker-compose up -d nginx

# Wait for nginx to start
sleep 5

# Request certificate
echo ""
echo "📜 Requesting SSL certificate from Let's Encrypt..."
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

if [ $? -eq 0 ]; then
    print_success "SSL certificate obtained successfully!"
else
    print_error "Failed to obtain SSL certificate"
    print_warning "Common issues:"
    echo "  - Domain DNS not pointing to this server"
    echo "  - Ports 80/443 blocked by firewall"
    echo "  - Another service using port 80"
    exit 1
fi

# Update nginx configuration
echo ""
echo "🔧 Updating nginx configuration..."
sed -i "s/himanshumajithiya.com/$DOMAIN/g" nginx/conf.d/default.conf

# Restart nginx with SSL
echo ""
echo "🔄 Restarting nginx with SSL..."
docker-compose restart nginx

# Verify HTTPS
echo ""
echo "🔍 Verifying HTTPS setup..."
sleep 3

if curl -f https://"$DOMAIN" > /dev/null 2>&1; then
    print_success "HTTPS is working correctly!"
else
    print_warning "HTTPS verification failed. Check nginx logs: docker-compose logs nginx"
fi

echo ""
echo "================================================"
print_success "SSL setup completed!"
echo "================================================"
echo ""
echo "Your website is now available at:"
echo "  https://$DOMAIN"
echo "  https://www.$DOMAIN"
echo ""
echo "Certificate will auto-renew every 12 hours."
echo ""
