#!/bin/bash

# HMC Website Health Monitor
# Run this script to check if everything is working correctly

echo "🏥 HMC Website Health Monitor"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Counters
PASS=0
FAIL=0

check_pass() {
    echo -e "${GREEN}✅ PASS${NC}: $1"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}❌ FAIL${NC}: $1"
    ((FAIL++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  WARN${NC}: $1"
}

# Check 1: Docker is running
echo "1️⃣  Checking Docker service..."
if systemctl is-active --quiet docker; then
    check_pass "Docker is running"
else
    check_fail "Docker is not running"
fi

# Check 2: Containers are running
echo ""
echo "2️⃣  Checking containers..."
if docker-compose ps | grep -q "Up"; then
    RUNNING=$(docker-compose ps | grep "Up" | wc -l)
    check_pass "$RUNNING containers are running"
else
    check_fail "No containers are running"
fi

# Check 3: Website responds on localhost
echo ""
echo "3️⃣  Checking website on localhost..."
if curl -f -s http://localhost:3000 > /dev/null; then
    check_pass "Website responds on http://localhost:3000"
else
    check_fail "Website not responding on localhost"
fi

# Check 4: Nginx is serving traffic
echo ""
echo "4️⃣  Checking Nginx..."
if curl -f -s http://localhost:80 > /dev/null; then
    check_pass "Nginx is serving traffic on port 80"
else
    check_fail "Nginx not responding on port 80"
fi

# Check 5: SSL certificate
echo ""
echo "5️⃣  Checking SSL certificate..."
if docker-compose exec -T certbot certbot certificates 2>/dev/null | grep -q "VALID"; then
    EXPIRY=$(docker-compose exec -T certbot certbot certificates 2>/dev/null | grep "Expiry Date" | head -1)
    check_pass "SSL certificate is valid"
    echo "    $EXPIRY"
else
    check_warn "Could not verify SSL certificate (may not be set up yet)"
fi

# Check 6: Disk space
echo ""
echo "6️⃣  Checking disk space..."
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    check_pass "Disk usage is ${DISK_USAGE}% (healthy)"
else
    check_warn "Disk usage is ${DISK_USAGE}% (consider cleanup)"
fi

# Check 7: Memory usage
echo ""
echo "7️⃣  Checking memory usage..."
MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
if [ "$MEM_USAGE" -lt 85 ]; then
    check_pass "Memory usage is ${MEM_USAGE}% (healthy)"
else
    check_warn "Memory usage is ${MEM_USAGE}% (high)"
fi

# Check 8: Recent errors in logs
echo ""
echo "8️⃣  Checking for recent errors..."
ERROR_COUNT=$(docker-compose logs --tail=100 2>&1 | grep -i error | wc -l)
if [ "$ERROR_COUNT" -eq 0 ]; then
    check_pass "No errors in recent logs"
else
    check_warn "$ERROR_COUNT errors found in recent logs"
    echo "    Run 'docker-compose logs -f' to view details"
fi

# Summary
echo ""
echo "=============================="
echo "📊 Health Check Summary"
echo "=============================="
echo -e "Passed: ${GREEN}$PASS${NC}"
echo -e "Failed: ${RED}$FAIL${NC}"
echo ""

if [ "$FAIL" -eq 0 ]; then
    echo -e "${GREEN}✅ All systems operational!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please investigate.${NC}"
    echo ""
    echo "Common fixes:"
    echo "  - Restart: docker-compose restart"
    echo "  - View logs: docker-compose logs -f"
    echo "  - Full restart: docker-compose down && docker-compose up -d"
    exit 1
fi
