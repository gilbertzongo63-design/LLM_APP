#!/bin/bash

echo "🧪 Testing CV Application Setup"
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "\n${YELLOW}1. Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not installed${NC}"
    exit 1
fi

# Check npm
echo -e "\n${YELLOW}2. Checking npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm not installed${NC}"
    exit 1
fi

# Check .env
echo -e "\n${YELLOW}3. Checking .env file...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
    grep "REACT_APP_API_URL" .env > /dev/null && echo -e "${GREEN}✓ API URL configured${NC}" || echo -e "${YELLOW}⚠ API URL not found${NC}"
else
    echo -e "${YELLOW}⚠ .env not found (using defaults)${NC}"
fi

# Check src/data/Resume.csv
echo -e "\n${YELLOW}4. Checking Resume.csv...${NC}"
if [ -f "src/data/Resume.csv" ]; then
    LINES=$(wc -l < src/data/Resume.csv)
    echo -e "${GREEN}✓ Resume.csv exists ($LINES lines)${NC}"
else
    echo -e "${RED}✗ Resume.csv not found${NC}"
fi

# Check node_modules
echo -e "\n${YELLOW}5. Checking dependencies...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ node_modules exists${NC}"
else
    echo -e "${YELLOW}⚠ node_modules not found, run 'npm install'${NC}"
fi

# Test API endpoints
echo -e "\n${YELLOW}6. Testing API endpoints...${NC}"
if command -v curl &> /dev/null; then
    API_URL="http://localhost:5000"
    
    echo -e "\n   Testing health endpoint..."
    curl -s "$API_URL/api/health" > /dev/null 2>&1 && echo -e "${GREEN}   ✓ Health endpoint responds${NC}" || echo -e "${RED}   ✗ Health endpoint not responding${NC}"
    
    echo -e "\n   Testing resumes endpoint..."
    curl -s "$API_URL/api/resumes" > /dev/null 2>&1 && echo -e "${GREEN}   ✓ Resumes endpoint responds${NC}" || echo -e "${RED}   ✗ Resumes endpoint not responding${NC}"
else
    echo -e "${YELLOW}⚠ curl not found, skipping API tests${NC}"
fi

echo -e "\n${GREEN}=================================="
echo "✓ Setup check complete!"
echo -e "==================================${NC}"
echo -e "\nNext steps:"
echo "1. Start API:  npm run server"
echo "2. Start App:  npm start"
echo "3. Open:       http://localhost:3000"
