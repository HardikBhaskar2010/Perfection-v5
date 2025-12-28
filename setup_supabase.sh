#!/bin/bash

# =====================================================
# Supabase Setup Script
# Run this to set up your Supabase database
# =====================================================

echo "🚀 Supabase Database Setup Script"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if files exist
if [ ! -f "/app/supabase_schema.sql" ]; then
    echo -e "${RED}❌ Error: supabase_schema.sql not found${NC}"
    exit 1
fi

if [ ! -f "/app/supabase_seed_data.sql" ]; then
    echo -e "${RED}❌ Error: supabase_seed_data.sql not found${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Setup Instructions:${NC}"
echo ""
echo "1. Open your Supabase Dashboard:"
echo -e "   ${GREEN}https://satbswbgkcgaddbesgns.supabase.co${NC}"
echo ""
echo "2. Navigate to SQL Editor (left sidebar)"
echo ""
echo "3. Create a new query and run the SCHEMA first:"
echo -e "   ${YELLOW}File: /app/supabase_schema.sql${NC}"
echo ""
echo "4. Create another new query and run the SEED DATA:"
echo -e "   ${YELLOW}File: /app/supabase_seed_data.sql${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✨ What you'll get:${NC}"
echo "  • User profiles table with auth integration"
echo "  • 150+ ATAL components with full specifications"
echo "  • Projects table for saving generated projects"
echo "  • Saved components for user bookmarks"
echo "  • Row Level Security (RLS) enabled on all tables"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📦 Component Categories:${NC}"
echo "  • Microcontrollers (Arduino, ESP32, Raspberry Pi)"
echo "  • Sensors (150+ types)"
echo "  • Actuators & Motors"
echo "  • Displays & LEDs"
echo "  • Communication Modules"
echo "  • Power Supplies"
echo "  • And much more!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}🎯 Quick Copy Commands:${NC}"
echo ""
echo "Copy schema to clipboard:"
echo -e "  ${YELLOW}cat /app/supabase_schema.sql | pbcopy${NC}  (Mac)"
echo -e "  ${YELLOW}cat /app/supabase_schema.sql | xclip${NC}  (Linux)"
echo ""
echo "Copy seed data to clipboard:"
echo -e "  ${YELLOW}cat /app/supabase_seed_data.sql | pbcopy${NC}  (Mac)"
echo -e "  ${YELLOW}cat /app/supabase_seed_data.sql | xclip${NC}  (Linux)"
echo ""
echo "Or simply view and copy:"
echo -e "  ${YELLOW}cat /app/supabase_schema.sql${NC}"
echo -e "  ${YELLOW}cat /app/supabase_seed_data.sql${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ After running both SQL files:${NC}"
echo "  1. Restart your app: sudo supervisorctl restart all"
echo "  2. Visit your app and sign up"
echo "  3. Browse 150+ ATAL components"
echo "  4. Generate amazing projects!"
echo ""
echo -e "${BLUE}Happy Building! 🚀${NC}"
echo ""
