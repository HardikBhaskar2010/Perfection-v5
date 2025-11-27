/**
 * API Service - Handles all backend API calls
 * Uses Render deployment: https://perfection-v2.onrender.com
 */

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://perfection-v2.onrender.com';

console.log('🔗 API Base URL:', API_BASE_URL);

/**
 * Generic API fetch wrapper with error handling
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Health check - Test if backend is reachable
 */
export async function healthCheck(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/api/');
}

/**
 * Generate STEM Project based on user parameters
 * 
 * @param params Project generation parameters
 * @returns Generated project details
 */
export interface ProjectParams {
  projectType: string;
  skillLevel: string;
  interests: string;
  budget: string;
  duration: string;
}

export interface GeneratedProject {
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  estimatedCost: string;
  components: string[];
  skills: string[];
  steps: string[];
}

export async function generateProject(params: ProjectParams): Promise<GeneratedProject> {
  // REAL API CALL to Render backend
  console.log('🎯 Calling Render backend API with params:', params);
  
  try {
    // Call the real backend API
    const project = await apiFetch<GeneratedProject>('/api/generate-project', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    
    console.log('✅ Project generated from backend:', project.title);
    return project;
    
  } catch (error) {
    console.error('❌ Backend API call failed, using fallback generation:', error);
    
    // Fallback to client-side generation if backend fails
    return generateMockProject(params);
  }
}

/**
 * Fallback mock generation if backend API fails
 * This ensures the app still works even if backend is down
 */
function generateMockProject(params: ProjectParams): Promise<GeneratedProject> {
  console.log('⚠️ Using fallback mock generation');
  
  // Project configurations by type
  const projectConfigs: Record<string, any> = {
    robotics: {
      titles: [
        'Autonomous Line Following Robot',
        'Obstacle Avoiding Smart Car', 
        'Bluetooth Controlled Robot',
        'Gesture Controlled Robot Arm'
      ],
      components: ['Arduino Uno/Mega', 'Motor Driver L298N', 'DC Motors (2-4)', 'Chassis & Wheels', 'Ultrasonic Sensor HC-SR04', 'Battery Pack', 'Jumper Wires'],
      skills: ['Robot mechanics', 'Motor control', 'Sensor integration', 'Movement algorithms'],
      costs: { Beginner: '$40-60', Intermediate: '$60-90', Advanced: '$90-150', Expert: '$150-250' }
    },
    iot: {
      titles: [
        'Smart Home Weather Station',
        'IoT Plant Monitoring System',
        'WiFi-Based Home Automation',
        'Real-time Air Quality Monitor'
      ],
      components: ['ESP32/ESP8266 Module', 'DHT22 Temp/Humidity Sensor', 'OLED Display', 'Relay Module', 'Breadboard', 'Power Supply 5V'],
      skills: ['IoT protocols (MQTT/HTTP)', 'WiFi connectivity', 'Cloud integration', 'Mobile app basics'],
      costs: { Beginner: '$30-50', Intermediate: '$50-80', Advanced: '$80-130', Expert: '$130-200' }
    },
    electronics: {
      titles: [
        'LED Music Visualizer',
        'Digital Thermometer with Display',
        'Battery Capacity Tester',
        'Mini Oscilloscope'
      ],
      components: ['Arduino Nano', 'LED Strips/Matrix', 'Resistors & Capacitors', 'LCD/OLED Display', 'Transistors', 'Breadboard'],
      skills: ['Circuit design', 'Component selection', 'PCB basics', 'Signal processing'],
      costs: { Beginner: '$25-45', Intermediate: '$45-70', Advanced: '$70-120', Expert: '$120-180' }
    },
    automation: {
      titles: [
        'Smart Light Control System',
        'Automated Garden Watering',
        'Motion-Activated Security',
        'Temperature-Based Fan Controller'
      ],
      components: ['Relay Modules', 'PIR Motion Sensor', 'LDR/Light Sensor', 'Arduino/NodeMCU', 'Solenoid Valve', 'Power Supply'],
      skills: ['Home automation', 'Relay control', 'Sensor logic', 'Timer programming'],
      costs: { Beginner: '$35-55', Intermediate: '$55-85', Advanced: '$85-140', Expert: '$140-220' }
    },
    sensors: {
      titles: [
        'Environmental Monitoring Station',
        'Multi-Sensor Data Logger',
        'Smart Air Quality Detector',
        'Weather Prediction System'
      ],
      components: ['Multiple Sensors (Temp, Gas, Humidity)', 'Arduino Uno', 'SD Card Module', 'RTC Module', 'LCD Display 16x2'],
      skills: ['Sensor calibration', 'Data logging', 'Signal processing', 'CSV/Database storage'],
      costs: { Beginner: '$30-50', Intermediate: '$50-75', Advanced: '$75-110', Expert: '$110-170' }
    }
  };

  // Get config or default to electronics
  const projectType = params.projectType.toLowerCase();
  const config = projectConfigs[projectType] || projectConfigs.electronics;
  
  // Select title (random or based on interests)
  const titleIndex = Math.floor(Math.random() * config.titles.length);
  const title = config.titles[titleIndex];
  
  // Time estimates by skill level
  const timeEstimates: Record<string, string> = {
    Beginner: '1-2 weeks',
    Intermediate: '2-4 weeks',
    Advanced: '4-6 weeks', 
    Expert: '6-10 weeks'
  };
  
  // Build description
  let description = `A ${params.skillLevel.toLowerCase()}-level ${projectType} project that combines practical electronics with real-world applications. `;
  if (params.interests) {
    description += `Designed around your interest in ${params.interests}. `;
  }
  description += `Perfect for learning ${projectType} fundamentals while building something useful.`;
  
  // Enhance components based on skill level
  let components = [...config.components];
  if (params.skillLevel === 'Advanced' || params.skillLevel === 'Expert') {
    components.push('Custom PCB (optional)', 'Mobile App Interface');
  }
  if (params.skillLevel === 'Expert') {
    components.push('3D Printed Enclosure', 'Advanced Debugging Tools');
  }
  
  // Enhance skills
  let skills = [...config.skills];
  skills.push('Programming in C/C++', 'Project documentation', 'Troubleshooting');
  
  // Build step-by-step guide
  const baseSteps = [
    'Research project requirements and watch tutorial videos',
    'Create detailed circuit diagram and plan',
    'Order all required components online',
    'Test each component individually on breadboard',
    'Write basic code to control components',
    'Integrate components step by step',
    'Debug issues and optimize performance',
    'Create permanent connections or PCB',
    'Design and build enclosure',
    'Final testing and documentation'
  ];
  
  // Adjust steps based on skill level
  let steps = baseSteps;
  if (params.skillLevel === 'Beginner') {
    steps = baseSteps.slice(0, 7);
    steps.push('Celebrate your first project! 🎉');
  } else if (params.skillLevel === 'Expert') {
    steps.push('Write technical report with schematics');
    steps.push('Create GitHub repository with code');
  }
  
  // Determine cost and time
  const cost = params.budget || config.costs[params.skillLevel] || '$50-80';
  const time = params.duration || timeEstimates[params.skillLevel] || '2-3 weeks';
  
  // Simulate API delay (realistic)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title,
        description,
        difficulty: params.skillLevel,
        estimatedTime: time,
        estimatedCost: cost,
        components,
        skills,
        steps
      });
      console.log('✅ Project generated successfully');
    }, 2000); // 2 second delay to simulate API call
  });
}

/**
 * Create status check (existing endpoint on your Render backend)
 */
export interface StatusCheckCreate {
  client_name: string;
}

export interface StatusCheck {
  id: string;
  client_name: string;
  timestamp: string;
}

export async function createStatusCheck(data: StatusCheckCreate): Promise<StatusCheck> {
  return apiFetch<StatusCheck>('/api/status', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get all status checks
 */
export async function getStatusChecks(): Promise<StatusCheck[]> {
  return apiFetch<StatusCheck[]>('/api/status');
}

export default {
  healthCheck,
  generateProject,
  createStatusCheck,
  getStatusChecks,
};
