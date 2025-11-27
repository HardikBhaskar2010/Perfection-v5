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
    Generate a STEM project based on user parameters
    
    This is a smart generator that creates personalized project suggestions
    based on user inputs like project type, skill level, interests, budget, and duration.
    """
    try:
        logger.info(f"Generating project for: {params.projectType}, skill: {params.skillLevel}")
        
        # Project type specific configurations
        project_configs = {
            "robotics": {
                "components_base": ["Microcontroller (Arduino Uno/Mega)", "Motor Driver (L298N)", "DC Motors", "Chassis", "Wheels", "Battery Pack", "Ultrasonic Sensor"],
                "skills_base": ["Robot mechanics", "Motor control", "Sensor integration", "Path planning"],
                "cost_range": {"beginner": "$40-60", "intermediate": "$60-90", "advanced": "$90-150", "expert": "$150-250"}
            },
            "iot": {
                "components_base": ["ESP32/ESP8266 WiFi Module", "DHT22 Sensor", "Breadboard", "Jumper Wires", "Power Supply", "LED Indicators"],
                "skills_base": ["IoT protocols", "WiFi connectivity", "Cloud integration", "Data visualization"],
                "cost_range": {"beginner": "$30-50", "intermediate": "$50-80", "advanced": "$80-130", "expert": "$130-200"}
            },
            "electronics": {
                "components_base": ["Arduino Nano", "Resistors", "Capacitors", "LEDs", "Transistors", "Breadboard", "Multimeter"],
                "skills_base": ["Circuit design", "Component selection", "PCB basics", "Troubleshooting"],
                "cost_range": {"beginner": "$25-45", "intermediate": "$45-70", "advanced": "$70-120", "expert": "$120-180"}
            },
            "automation": {
                "components_base": ["Relay Modules", "Sensors (PIR, LDR)", "Arduino/ESP32", "Power Supply", "Enclosure", "Wiring"],
                "skills_base": ["Home automation", "Relay control", "Sensor logic", "System integration"],
                "cost_range": {"beginner": "$35-55", "intermediate": "$55-85", "advanced": "$85-140", "expert": "$140-220"}
            },
            "sensors": {
                "components_base": ["Multiple Sensors (Temperature, Humidity, Gas)", "Arduino Uno", "LCD Display", "SD Card Module", "Real-time Clock"],
                "skills_base": ["Sensor calibration", "Data logging", "Signal processing", "Display interfaces"],
                "cost_range": {"beginner": "$30-50", "intermediate": "$50-75", "advanced": "$75-110", "expert": "$110-170"}
            }
        }
        
        # Get configuration for project type (default to electronics if not found)
        config = project_configs.get(params.projectType.lower(), project_configs["electronics"])
        
        # Skill level adjustments
        skill_level_lower = params.skillLevel.lower()
        time_estimates = {
            "beginner": "1-2 weeks",
            "intermediate": "2-4 weeks", 
            "advanced": "4-6 weeks",
            "expert": "6-10 weeks"
        }
        
        # Build project title based on interests
        interest_keywords = params.interests.lower() if params.interests else ""
        project_titles = {
            "robotics": [
                "Autonomous Line Following Robot",
                "Obstacle Avoiding Smart Car",
                "Bluetooth Controlled Robot",
                "Voice Controlled Robotic Arm"
            ],
            "iot": [
                "Smart Home Weather Station",
                "IoT Plant Monitoring System",
                "Smart Energy Monitor",
                "WiFi-Enabled Security System"
            ],
            "electronics": [
                "LED Music Visualizer",
                "Digital Thermometer with Display",
                "Battery Capacity Tester",
                "Function Generator"
            ],
            "automation": [
                "Smart Light Control System",
                "Automated Garden Watering",
                "Motion-Activated Security Light",
                "Temperature-Based Fan Controller"
            ],
            "sensors": [
                "Environmental Monitoring Station",
                "Multi-Sensor Data Logger",
                "Air Quality Detector",
                "Wireless Sensor Network"
            ]
        }
        
        # Select appropriate title
        titles = project_titles.get(params.projectType.lower(), project_titles["electronics"])
        project_title = random.choice(titles)
        
        # Generate description
        description = f"A {skill_level_lower}-level {params.projectType.lower()} project that combines hands-on electronics with practical applications. "
        if params.interests:
            description += f"Tailored for interests in {params.interests}. "
        description += "This project will help you develop both theoretical knowledge and practical skills."
        
        # Build components list
        components = config["components_base"].copy()
        
        # Add skill-level specific components
        if skill_level_lower in ["advanced", "expert"]:
            components.extend(["OLED Display", "Mobile App Interface Components"])
        if skill_level_lower == "expert":
            components.extend(["Custom PCB", "3D Printed Enclosure"])
        
        # Build skills list
        skills = config["skills_base"].copy()
        skills.extend([f"{params.projectType} programming", "Circuit debugging", "Project documentation"])
        
        # Build steps
        steps = [
            "Research project requirements and gather documentation",
            "Plan circuit design and component layout",
            "Order and verify all required components",
            "Build and test basic circuit on breadboard",
            "Develop and upload initial code",
            "Test individual component functionality",
            "Integrate all components together",
            "Debug and troubleshoot issues",
            "Optimize code and circuit design",
            "Create final enclosure (if applicable)",
            "Document project with photos and notes"
        ]
        
        # Adjust steps based on skill level
        if skill_level_lower == "beginner":
            steps = steps[:7]  # Simpler project
        elif skill_level_lower == "expert":
            steps.append("Create detailed technical report")
            steps.append("Present project findings")
        
        # Determine cost
        cost = params.budget if params.budget else config["cost_range"].get(skill_level_lower, "$50-80")
        
        # Determine time
        time = params.duration if params.duration else time_estimates.get(skill_level_lower, "2-3 weeks")
        
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
        
        logger.info(f"Generated project: {project.title}")
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
