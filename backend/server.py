from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from pathlib import Path
from datetime import datetime
import uuid
import os
import logging
import random

# Try to import Supabase, but don't fail if not available
try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False
    Client = None
    print("⚠️ Supabase library not available - running without Supabase support")

# Load env vars
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Initialize Supabase client
logger = logging.getLogger(__name__)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Optional[Client] = None

if SUPABASE_AVAILABLE and SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    logger.info("✅ Supabase client initialized")
else:
    if not SUPABASE_AVAILABLE:
        logger.warning("⚠️ Supabase library not installed - project endpoints disabled")
    else:
        logger.warning("⚠️ Supabase credentials not configured - project endpoints disabled")

# Create main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ----- MODELS -----
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Project Generation Models
class ProjectParams(BaseModel):
    projectType: str
    skillLevel: str
    interests: str = ""
    budget: str = ""
    duration: str = ""

class GeneratedProject(BaseModel):
    title: str
    description: str
    difficulty: str
    estimatedTime: str
    estimatedCost: str
    components: List[str]
    skills: List[str]
    steps: List[str]

# Temporary in-memory storage (instead of Mongo)
status_checks = []

# ----- ROUTES -----
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.dict())
    status_checks.append(status_obj)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    return status_checks

@api_router.post("/generate-project", response_model=GeneratedProject)
async def generate_project(params: ProjectParams):
    """
    Generate ATAL-focused STEM project based on user parameters
    
    Enhanced generator for Atal Tinkering Lab projects with detailed
    component specifications, learning outcomes, and step-by-step guidance.
    """
    try:
        logger.info(f"Generating project for: {params.projectType}, skill: {params.skillLevel}")
        
        # Enhanced project configurations with ATAL components
        project_configs = {
            "robotics": {
                "components_base": [
                    "Arduino Uno R3 (ATmega328P Microcontroller)",
                    "L298N Motor Driver Module (Dual H-Bridge)",
                    "2x BO DC Geared Motors with Wheels (60-200 RPM)",
                    "2WD Robot Chassis (Acrylic with Battery Holder)",
                    "HC-SR04 Ultrasonic Sensor (2-400cm range)",
                    "4xAA Battery Holder with ON/OFF Switch",
                    "Jumper Wires (Male-Male, Male-Female)",
                    "Mini Breadboard 400 points"
                ],
                "skills_base": [
                    "Arduino programming basics (C/C++)",
                    "PWM (Pulse Width Modulation) for motor speed control",
                    "Ultrasonic sensor interfacing and distance measurement",
                    "H-Bridge motor driver operation and direction control",
                    "Robot kinematics and movement logic",
                    "Power management for mobile robots"
                ],
                "cost_range": {"beginner": "₹800-1200", "intermediate": "₹1200-2000", "advanced": "₹2000-3500", "expert": "₹3500-6000"},
                "learning_outcomes": [
                    "Understand basics of mobile robotics and actuation",
                    "Learn motor control using PWM signals",
                    "Master sensor integration for autonomous behavior",
                    "Develop problem-solving skills through robot debugging"
                ]
            },
            "iot": {
                "components_base": [
                    "ESP32 DevKit (Dual-core WiFi + Bluetooth)",
                    "DHT22 Temperature & Humidity Sensor (High precision)",
                    "BMP280 Barometric Pressure Sensor (I2C)",
                    "0.96\" OLED Display 128x64 (I2C Interface)",
                    "Mini Breadboard with Jumper Wires",
                    "5V 2A Power Adapter or USB Cable",
                    "Micro USB Cable for Programming"
                ],
                "skills_base": [
                    "ESP32 programming with Arduino IDE/MicroPython",
                    "WiFi connectivity and HTTP requests",
                    "I2C communication protocol",
                    "IoT platforms (ThingSpeak, Blynk, Firebase)",
                    "Data visualization and cloud integration",
                    "Sensor data processing and filtering"
                ],
                "cost_range": {"beginner": "₹600-1000", "intermediate": "₹1000-1800", "advanced": "₹1800-3000", "expert": "₹3000-5000"},
                "learning_outcomes": [
                    "Master wireless communication protocols",
                    "Learn cloud-based data storage and retrieval",
                    "Understand IoT architecture and data flow",
                    "Create web dashboards for monitoring"
                ]
            },
            "electronics": {
                "components_base": [
                    "Arduino Nano (Compact ATmega328P board)",
                    "Resistor Kit (10Ω to 1MΩ, 1/4W, ±5%)",
                    "LED Assortment (5mm - Red, Green, Blue, Yellow, White)",
                    "Ceramic Capacitor Kit (10pF to 100nF)",
                    "2N2222 NPN Transistors (for switching)",
                    "1N4007 Diodes (Rectifier, 1000V 1A)",
                    "Solderless Breadboard 830 points",
                    "Digital Multimeter for measurements"
                ],
                "skills_base": [
                    "Basic circuit analysis (Ohm's Law, Kirchhoff's Laws)",
                    "LED current limiting resistor calculation",
                    "Transistor as switch and amplifier",
                    "Capacitor charging/discharging characteristics",
                    "PCB design fundamentals",
                    "Soldering techniques and practices"
                ],
                "cost_range": {"beginner": "₹500-900", "intermediate": "₹900-1500", "advanced": "₹1500-2500", "expert": "₹2500-4000"},
                "learning_outcomes": [
                    "Build strong foundation in analog electronics",
                    "Master breadboard prototyping techniques",
                    "Learn to read and create circuit diagrams",
                    "Develop systematic troubleshooting skills"
                ]
            },
            "automation": {
                "components_base": [
                    "Arduino Uno R3 / ESP32 (for WiFi control)",
                    "4-Channel 5V Relay Module (10A 250V AC rating)",
                    "PIR Motion Sensor HC-SR501 (7m range, 120° angle)",
                    "LDR (Light Dependent Resistor) with 10kΩ resistor",
                    "DHT11 Temperature & Humidity Sensor",
                    "16x2 LCD Display with I2C Module",
                    "5V 2A Power Supply",
                    "Connecting Wires and Terminal Blocks"
                ],
                "skills_base": [
                    "Relay control and isolation techniques",
                    "Sensor-based decision making logic",
                    "Interrupt handling for motion detection",
                    "Home automation protocols",
                    "Safety considerations for AC appliances",
                    "Timer and scheduling implementations"
                ],
                "cost_range": {"beginner": "₹700-1200", "intermediate": "₹1200-2000", "advanced": "₹2000-3500", "expert": "₹3500-5500"},
                "learning_outcomes": [
                    "Understand home automation systems",
                    "Learn safe AC appliance control",
                    "Master sensor fusion for smart decisions",
                    "Create practical IoT automation solutions"
                ]
            },
            "sensors": {
                "components_base": [
                    "Arduino Uno R3 (Microcontroller)",
                    "DHT22 (Temp & Humidity - High accuracy)",
                    "MQ-135 Air Quality Sensor (NH3, NOx, CO2)",
                    "BH1750 Digital Light Sensor (I2C, 1-65535 lux)",
                    "20x4 LCD Display with I2C",
                    "MicroSD Card Module (for data logging)",
                    "DS3231 RTC Module (±2ppm accuracy)",
                    "Breadboard and Connecting Wires"
                ],
                "skills_base": [
                    "Multi-sensor integration and management",
                    "I2C bus communication and addressing",
                    "Data logging to SD card (CSV format)",
                    "Real-time clock for timestamping",
                    "Sensor calibration techniques",
                    "Data visualization using Serial Plotter"
                ],
                "cost_range": {"beginner": "₹800-1400", "intermediate": "₹1400-2200", "advanced": "₹2200-3500", "expert": "₹3500-5500"},
                "learning_outcomes": [
                    "Master sensor interfacing techniques",
                    "Learn data acquisition and logging",
                    "Understand environmental monitoring systems",
                    "Develop data analysis skills"
                ]
            }
        }
        
        # Get configuration for project type (default to electronics if not found)
        config = project_configs.get(params.projectType.lower(), project_configs["electronics"])
        
        # Skill level adjustments
        skill_level_lower = params.skillLevel.lower()
        time_estimates = {
            "beginner": "1-2 weeks (8-15 hours total)",
            "intermediate": "2-4 weeks (20-35 hours total)", 
            "advanced": "4-8 weeks (40-70 hours total)",
            "expert": "8-12 weeks (80-120 hours total)"
        }
        
        # Enhanced project titles with real-world applications
        project_titles = {
            "robotics": {
                "beginner": ["Line Following Robot for Warehouse Navigation", "Obstacle Avoiding Car with Ultrasonic Sensors"],
                "intermediate": ["Bluetooth Controlled Robot with Mobile App", "Gesture Controlled Robot using Accelerometer"],
                "advanced": ["Autonomous Maze Solving Robot with Wall Following", "Voice Controlled Robotic Arm with Inverse Kinematics"],
                "expert": ["SLAM-based Mapping Robot with ROS", "Quadruped Walking Robot with Servo Control"]
            },
            "iot": {
                "beginner": ["WiFi Weather Station with Web Dashboard", "Smart Plant Monitoring System with Alerts"],
                "intermediate": ["IoT Home Security System with Mobile Notifications", "Remote Controlled Appliances via Blynk App"],
                "advanced": ["Multi-Room Environmental Monitoring Network", "Smart Energy Meter with Power Analytics"],
                "expert": ["Complete Smart Home System with Voice Control", "Industrial IoT Sensor Network with MQTT"]
            },
            "electronics": {
                "beginner": ["LED Chaser with 555 Timer IC", "Temperature Indicator using LM35 and LEDs"],
                "intermediate": ["Digital Voltmeter with LCD Display", "Automatic Night Light using LDR and Transistor"],
                "advanced": ["Function Generator with Multiple Waveforms", "Battery Capacity Tester with Data Logging"],
                "expert": ["Digital Oscilloscope using Arduino", "Impedance Analyzer for Component Testing"]
            },
            "automation": {
                "beginner": ["Automatic Room Light using PIR Sensor", "Temperature Controlled Fan with LCD"],
                "intermediate": ["Smart Irrigation System with Soil Moisture", "Automatic Curtain Controller with Light Sensor"],
                "advanced": ["Complete Home Automation with Mobile Control", "Smart Door Lock with RFID and Keypad"],
                "expert": ["Voice Controlled Home with Multiple Zones", "AI-based Energy Management System"]
            },
            "sensors": {
                "beginner": ["Multi-Sensor Data Logger to SD Card", "Room Environment Monitor with OLED Display"],
                "intermediate": ["Air Quality Monitoring Station with Alerts", "Weather Station with Wireless Data Upload"],
                "advanced": ["Portable Environmental Analysis Kit", "Industrial Gas Leak Detection System"],
                "expert": ["Distributed Sensor Network with Edge Computing", "AI-Powered Predictive Maintenance System"]
            }
        }
        
        # Select appropriate title based on skill level
        titles = project_titles.get(params.projectType.lower(), project_titles["electronics"])
        if isinstance(titles, dict):
            project_title = random.choice(titles.get(skill_level_lower, titles["beginner"]))
        else:
            project_title = random.choice(titles)
        
        # Enhanced description with learning outcomes
        description = f"A comprehensive {skill_level_lower}-level {params.projectType.lower()} project designed for Atal Tinkering Labs. "
        description += f"This project combines theoretical concepts with hands-on implementation, perfect for students learning STEM. "
        if params.interests:
            description += f"Customized for your interests in {params.interests}, making learning more engaging and relevant. "
        description += f"You'll gain practical experience with real-world components and develop problem-solving skills through iterative building and testing."
        
        # Build comprehensive components list with specifications
        components = config["components_base"].copy()
        
        # Add skill-level specific enhancements
        if skill_level_lower in ["intermediate", "advanced", "expert"]:
            components.extend([
                "0.96\" OLED Display I2C (128x64) for better UI",
                "Buzzer Module for audio feedback"
            ])
        if skill_level_lower in ["advanced", "expert"]:
            components.extend([
                "nRF24L01+ Wireless Module for long-range communication",
                "HC-05 Bluetooth Module for mobile connectivity"
            ])
        if skill_level_lower == "expert":
            components.extend([
                "Custom PCB design and fabrication",
                "3D Printed Enclosure with CAD design",
                "Mobile App development (MIT App Inventor / Flutter)"
            ])
        
        # Enhanced skills with detailed learning points
        skills = config["skills_base"].copy()
        skills.extend([
            f"Arduino/ESP32 programming for {params.projectType}",
            "Circuit debugging using multimeter and logic analyzer",
            "Technical documentation and project presentation",
            "Safety practices for electronics and soldering"
        ])
        
        if skill_level_lower in ["advanced", "expert"]:
            skills.extend([
                "Version control using Git for code management",
                "PCB design using EasyEDA or KiCad",
                "3D modeling for enclosure design"
            ])
        
        # Detailed step-by-step implementation guide
        steps = [
            "📚 Phase 1: Research & Planning\n   - Study project requirements and objectives\n   - Review datasheets for all components\n   - Create block diagram of system architecture\n   - List all required tools and materials",
            
            "🎯 Phase 2: Component Procurement\n   - Order components from ATAL-approved vendors\n   - Verify all components upon arrival\n   - Test individual components before integration\n   - Organize components in labeled containers",
            
            "📐 Phase 3: Circuit Design\n   - Draw circuit schematic on paper/software\n   - Calculate resistor values for LEDs and sensors\n   - Plan breadboard layout for easy debugging\n   - Verify power requirements and ratings",
            
            "🔌 Phase 4: Breadboard Prototyping\n   - Assemble basic circuit on breadboard\n   - Check all connections with multimeter\n   - Test power supply voltages (3.3V, 5V, 12V)\n   - Ensure proper grounding throughout circuit",
            
            "💻 Phase 5: Software Development\n   - Set up Arduino IDE with required libraries\n   - Write pseudocode for main logic flow\n   - Implement code in modular functions\n   - Add comments explaining each section",
            
            "🧪 Phase 6: Component Testing\n   - Test each sensor/module independently\n   - Verify sensor readings with known values\n   - Check actuator responses (motors, relays, LEDs)\n   - Debug any communication issues (I2C, SPI, UART)",
            
            "🔗 Phase 7: System Integration\n   - Connect all modules to main controller\n   - Test inter-module communication\n   - Implement error handling for failures\n   - Verify complete system functionality",
            
            "🐛 Phase 8: Debugging & Optimization\n   - Use Serial Monitor for troubleshooting\n   - Optimize code for memory and speed\n   - Add LED indicators for system states\n   - Test edge cases and error conditions",
            
            "📊 Phase 9: Testing & Validation\n   - Create test cases for all features\n   - Measure and record performance metrics\n   - Compare results with initial requirements\n   - Document any limitations or issues",
            
            "📦 Phase 10: Enclosure & Finalization\n   - Design enclosure considering ventilation\n   - Add mounting holes for components\n   - Label all external connections\n   - Create user manual with safety warnings",
            
            "📝 Phase 11: Documentation\n   - Take high-quality photos of project\n   - Create circuit diagrams and flowcharts\n   - Write detailed project report\n   - Prepare demonstration video",
            
            "🎤 Phase 12: Presentation\n   - Prepare PowerPoint/poster for presentation\n   - Practice explaining project working\n   - Demonstrate all features live\n   - Discuss real-world applications and future scope"
        ]
        
        # Adjust steps based on skill level
        if skill_level_lower == "beginner":
            steps = steps[:8]  # Focus on fundamentals
        elif skill_level_lower == "intermediate":
            steps = steps[:10]
        # Advanced and expert get all steps
        
        # Determine cost with Indian Rupee pricing
        cost = params.budget if params.budget else config["cost_range"].get(skill_level_lower, "₹1000-1500")
        
        # Determine time with detailed breakdown
        time = params.duration if params.duration else time_estimates.get(skill_level_lower, "2-3 weeks (25 hours)")
        
        # Create project with enhanced data
        project = GeneratedProject(
            title=project_title,
            description=description,
            difficulty=params.skillLevel,
            estimatedTime=time,
            estimatedCost=cost,
            components=components,
            skills=skills,
            steps=steps
        )
        
        logger.info(f"Generated ATAL project: {project.title}")
        return project
        
    except Exception as e:
        logger.error(f"Error generating project: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Project generation failed: {str(e)}")

# ----- PROJECT ENDPOINTS -----
@api_router.post("/projects/save")
async def save_project(data: dict):
    """Save a generated project to Supabase"""
    try:
        if not supabase:
            raise HTTPException(status_code=503, detail="Supabase not configured")

        user_id = data.get("user_id")
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id required")

        project_data = {
            "user_id": user_id,
            "title": data.get("title", ""),
            "description": data.get("description", ""),
            "project_type": data.get("project_type", ""),
            "difficulty": data.get("difficulty", ""),
            "estimated_time": data.get("estimated_time", ""),
            "estimated_cost": data.get("estimated_cost", ""),
            "components": data.get("components", []),
            "skills": data.get("skills", []),
            "steps": data.get("steps", []),
            "generated_from_params": data.get("generated_from_params", {}),
        }

        result = supabase.table("projects").insert(project_data).execute()
        logger.info(f"Project saved for user {user_id}")
        return result.data[0] if result.data else {}

    except Exception as e:
        logger.error(f"Error saving project: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving project: {str(e)}")


@api_router.get("/projects/{user_id}")
async def get_user_projects(user_id: str, status: Optional[str] = None):
    """Get all projects for a user"""
    try:
        if not supabase:
            raise HTTPException(status_code=503, detail="Supabase not configured")

        query = supabase.table("projects").select("*").eq("user_id", user_id).order("created_at", desc=True)

        if status:
            query = query.eq("status", status)

        result = query.execute()
        return result.data or []

    except Exception as e:
        logger.error(f"Error fetching projects: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching projects: {str(e)}")


@api_router.get("/project-stats/{user_id}")
async def get_project_stats(user_id: str):
    """Get project statistics for a user"""
    try:
        if not supabase:
            raise HTTPException(status_code=503, detail="Supabase not configured")

        result = supabase.table("projects").select("status").eq("user_id", user_id).execute()
        projects = result.data or []

        stats = {
            "total": len(projects),
            "completed": len([p for p in projects if p["status"] == "completed"]),
            "in_progress": len([p for p in projects if p["status"] == "in-progress"]),
            "planning": len([p for p in projects if p["status"] == "planning"]),
        }

        return stats

    except Exception as e:
        logger.error(f"Error fetching stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching stats: {str(e)}")

# Include router
app.include_router(api_router)

# Enable CORS - Allow Vercel frontend and local development
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173", 
        "https://*.vercel.app",  # All Vercel deployments
        "*"  # Allow all for development (remove in production)
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
