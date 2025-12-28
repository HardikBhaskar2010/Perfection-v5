-- =====================================================
-- ATAL COMPONENTS SEED DATA
-- Comprehensive database of components for Atal Tinkering Labs
-- =====================================================

-- MICROCONTROLLERS & DEVELOPMENT BOARDS
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('Arduino Uno R3', 'Popular microcontroller board based on ATmega328P, perfect for beginners and prototyping', 'Microcontrollers', '₹450-650', 'In Stock', 
ARRAY['arduino', 'microcontroller', 'beginner-friendly', 'atmega328p'], 
'{"Operating Voltage": "5V", "Digital I/O Pins": "14", "Analog Input Pins": "6", "Flash Memory": "32 KB", "Clock Speed": "16 MHz"}'::jsonb),

('Arduino Mega 2560', 'High-capacity Arduino board with more I/O pins and memory for complex projects', 'Microcontrollers', '₹850-1200', 'In Stock',
ARRAY['arduino', 'microcontroller', 'advanced', 'atmega2560'],
'{"Operating Voltage": "5V", "Digital I/O Pins": "54", "Analog Input Pins": "16", "Flash Memory": "256 KB", "Clock Speed": "16 MHz"}'::jsonb),

('Arduino Nano', 'Compact Arduino board ideal for breadboard projects and space-constrained applications', 'Microcontrollers', '₹350-550', 'In Stock',
ARRAY['arduino', 'microcontroller', 'compact', 'breadboard'],
'{"Operating Voltage": "5V", "Digital I/O Pins": "14", "Analog Input Pins": "8", "Flash Memory": "32 KB", "Dimensions": "18mm x 45mm"}'::jsonb),

('Raspberry Pi 4 Model B (4GB)', 'Powerful single-board computer for advanced IoT, AI, and computing projects', 'Microcontrollers', '₹4500-6000', 'Limited',
ARRAY['raspberry-pi', 'computer', 'iot', 'ai', 'advanced'],
'{"RAM": "4GB LPDDR4", "CPU": "Quad-core Cortex-A72 1.5GHz", "Connectivity": "WiFi, Bluetooth 5.0, Gigabit Ethernet", "USB Ports": "4x USB 3.0", "Video": "Dual micro-HDMI 4K"}'::jsonb),

('ESP32 DevKit', 'WiFi and Bluetooth enabled microcontroller for IoT projects', 'Microcontrollers', '₹350-600', 'In Stock',
ARRAY['esp32', 'wifi', 'bluetooth', 'iot', 'wireless'],
'{"CPU": "Dual-core 240MHz", "WiFi": "802.11 b/g/n", "Bluetooth": "v4.2 BR/EDR and BLE", "GPIO": "34 pins", "Flash": "4MB"}'::jsonb),

('ESP8266 NodeMCU', 'Low-cost WiFi module perfect for IoT projects and wireless connectivity', 'Microcontrollers', '₹250-450', 'In Stock',
ARRAY['esp8266', 'wifi', 'iot', 'nodemcu', 'budget'],
'{"CPU": "80MHz", "WiFi": "802.11 b/g/n", "GPIO": "17 pins", "Flash": "4MB", "Operating Voltage": "3.3V"}'::jsonb);

-- SENSORS - ENVIRONMENTAL
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('DHT11 Temperature & Humidity Sensor', 'Basic digital temperature and humidity sensor for environmental monitoring', 'Sensors', '₹60-120', 'In Stock',
ARRAY['temperature', 'humidity', 'environmental', 'digital', 'beginner'],
'{"Temperature Range": "0-50°C", "Humidity Range": "20-90%", "Accuracy": "±2°C, ±5%RH", "Interface": "Single-wire digital", "Operating Voltage": "3-5.5V"}'::jsonb),

('DHT22/AM2302 Sensor', 'High-precision temperature and humidity sensor with better accuracy', 'Sensors', '₹180-350', 'In Stock',
ARRAY['temperature', 'humidity', 'precision', 'environmental'],
'{"Temperature Range": "-40 to 80°C", "Humidity Range": "0-100%", "Accuracy": "±0.5°C, ±2%RH", "Interface": "Single-wire digital", "Sampling Rate": "0.5Hz"}'::jsonb),

('BMP280 Barometric Pressure Sensor', 'High-precision atmospheric pressure and temperature sensor for weather stations', 'Sensors', '₹150-280', 'In Stock',
ARRAY['pressure', 'temperature', 'altitude', 'i2c', 'spi'],
'{"Pressure Range": "300-1100 hPa", "Temperature Range": "-40 to 85°C", "Interface": "I2C, SPI", "Resolution": "0.01 hPa", "Altitude Accuracy": "±1m"}'::jsonb),

('MQ-2 Gas Sensor', 'Detects LPG, propane, methane, hydrogen, smoke and other combustible gases', 'Sensors', '₹80-150', 'In Stock',
ARRAY['gas', 'smoke', 'safety', 'analog', 'lpg'],
'{"Detection Range": "200-10000 ppm", "Heater Voltage": "5V", "Output": "Analog voltage", "Response Time": "< 10s", "Gases Detected": "LPG, Propane, Methane, Hydrogen"}'::jsonb),

('MQ-135 Air Quality Sensor', 'Detects ammonia, benzene, smoke, CO2 and other harmful gases for air quality monitoring', 'Sensors', '₹100-180', 'In Stock',
ARRAY['air-quality', 'gas', 'co2', 'environmental', 'pollution'],
'{"Detection Range": "10-1000 ppm", "Target Gases": "NH3, NOx, Alcohol, Benzene, Smoke, CO2", "Operating Voltage": "5V", "Output": "Analog signal"}'::jsonb),

('DS18B20 Waterproof Temperature Sensor', 'Digital waterproof temperature sensor with long cable, ideal for liquid temperature measurement', 'Sensors', '₹150-250', 'In Stock',
ARRAY['temperature', 'waterproof', 'digital', '1-wire', 'liquid'],
'{"Temperature Range": "-55 to 125°C", "Accuracy": "±0.5°C", "Resolution": "9-12 bit", "Interface": "1-Wire", "Cable Length": "1m", "Probe": "Stainless steel"}'::jsonb);

-- SENSORS - DISTANCE & PROXIMITY
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('HC-SR04 Ultrasonic Sensor', 'Popular ultrasonic distance sensor for obstacle detection and ranging', 'Sensors', '₹70-150', 'In Stock',
ARRAY['ultrasonic', 'distance', 'proximity', 'obstacle-detection', 'robotics'],
'{"Range": "2cm to 4m", "Accuracy": "±3mm", "Measuring Angle": "15°", "Trigger Input": "10µS TTL pulse", "Operating Voltage": "5V", "Frequency": "40kHz"}'::jsonb),

('Sharp GP2Y0A21YK IR Distance Sensor', 'Analog infrared proximity sensor with 10-80cm range', 'Sensors', '₹300-500', 'In Stock',
ARRAY['infrared', 'distance', 'proximity', 'analog', 'sharp'],
'{"Range": "10-80cm", "Output": "Analog voltage", "Operating Voltage": "4.5-5.5V", "Response Time": "39ms", "Type": "Infrared reflective"}'::jsonb),

('VL53L0X Time-of-Flight Distance Sensor', 'Precise laser-based distance sensor up to 2 meters', 'Sensors', '₹400-700', 'In Stock',
ARRAY['laser', 'tof', 'distance', 'precision', 'i2c'],
'{"Range": "Up to 2m", "Accuracy": "±3%", "Interface": "I2C", "Field of View": "25°", "Operating Voltage": "2.6-3.5V", "Technology": "Time-of-Flight"}'::jsonb);

-- SENSORS - MOTION & ORIENTATION
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('PIR Motion Sensor HC-SR501', 'Passive infrared sensor for motion detection in security and automation', 'Sensors', '₹70-130', 'In Stock',
ARRAY['pir', 'motion', 'security', 'automation', 'infrared'],
'{"Detection Range": "Up to 7m", "Detection Angle": "120°", "Output": "Digital (High/Low)", "Delay Time": "0.3s to 200s", "Operating Voltage": "5-20V DC"}'::jsonb),

('MPU6050 6-Axis Gyroscope & Accelerometer', '6-DOF motion tracking device combining gyroscope and accelerometer', 'Sensors', '₹150-300', 'In Stock',
ARRAY['gyroscope', 'accelerometer', 'imu', 'motion', 'i2c', 'robotics'],
'{"Gyroscope Range": "±250, ±500, ±1000, ±2000°/s", "Accelerometer Range": "±2g, ±4g, ±8g, ±16g", "Interface": "I2C", "Operating Voltage": "3-5V", "16-bit ADC": "Yes"}'::jsonb),

('HMC5883L Digital Compass Magnetometer', '3-axis digital compass for direction detection and navigation', 'Sensors', '₹200-350', 'In Stock',
ARRAY['compass', 'magnetometer', 'navigation', 'i2c', '3-axis'],
'{"Magnetic Field Range": "±8 gauss", "Resolution": "1-2 degrees", "Interface": "I2C", "Update Rate": "160Hz max", "Operating Voltage": "2.16-3.6V"}'::jsonb);

-- SENSORS - LIGHT & COLOR
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('LDR (Light Dependent Resistor)', 'Photoresistor for detecting ambient light intensity', 'Sensors', '₹10-25', 'In Stock',
ARRAY['ldr', 'light', 'photoresistor', 'analog', 'ambient'],
'{"Resistance Range": "1MΩ (dark) to 10kΩ (bright)", "Response Time": "20-30ms", "Spectral Peak": "540nm", "Power Rating": "100mW", "Type": "Analog"}'::jsonb),

('BH1750 Digital Light Sensor', 'I2C digital ambient light sensor with high resolution', 'Sensors', '₹120-220', 'In Stock',
ARRAY['light', 'lux', 'i2c', 'digital', 'ambient'],
'{"Range": "1-65535 lux", "Resolution": "0.5-1 lux", "Interface": "I2C", "Operating Voltage": "2.4-3.6V", "Accuracy": "±20%"}'::jsonb),

('TCS3200 Color Sensor', 'RGB color sensor for color detection and sorting applications', 'Sensors', '₹200-380', 'In Stock',
ARRAY['color', 'rgb', 'detection', 'sorting', 'light'],
'{"Output": "Square wave frequency", "Photodiodes": "8x8 array", "Operating Voltage": "2.7-5.5V", "Interface": "Digital frequency output", "Color Filters": "Red, Green, Blue, Clear"}'::jsonb);

-- ACTUATORS - MOTORS
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('SG90 Micro Servo Motor', 'Small and lightweight servo motor for precise angular control', 'Actuators', '₹100-180', 'In Stock',
ARRAY['servo', 'motor', 'pwm', 'robotics', 'angular'],
'{"Rotation": "180°", "Torque": "1.8 kg-cm", "Speed": "0.1s/60°", "Operating Voltage": "4.8-6V", "Control": "PWM", "Weight": "9g"}'::jsonb),

('MG996R Metal Gear Servo', 'High-torque metal gear servo for heavy-duty applications', 'Actuators', '₹350-550', 'In Stock',
ARRAY['servo', 'motor', 'high-torque', 'metal-gear', 'robotics'],
'{"Rotation": "180°", "Torque": "9.4-11 kg-cm", "Speed": "0.17s/60°", "Operating Voltage": "4.8-7.2V", "Gears": "Metal", "Weight": "55g"}'::jsonb),

('DC Geared Motor with Wheel (BO Motor)', 'DC motor with gearbox for robot chassis and wheeled projects', 'Actuators', '₹80-150', 'In Stock',
ARRAY['dc-motor', 'geared', 'robot', 'wheel', 'chassis'],
'{"Operating Voltage": "3-12V", "RPM": "60-200 (at 6V)", "Torque": "0.8-2 kg-cm", "Gear Ratio": "1:48", "Shaft Diameter": "3mm", "Includes": "Wheel"}'::jsonb),

('N20 Mini DC Geared Motor', 'Compact DC motor with gearbox for small robot projects', 'Actuators', '₹100-180', 'In Stock',
ARRAY['dc-motor', 'mini', 'geared', 'compact', 'robot'],
'{"Operating Voltage": "3-12V", "RPM Options": "50-1000", "Size": "12mm x 10mm", "Shaft": "3mm D-shaft", "Gear Ratios": "Multiple options available"}'::jsonb),

('28BYJ-48 Stepper Motor with ULN2003 Driver', '5V stepper motor with driver board for precise stepping control', 'Actuators', '₹120-220', 'In Stock',
ARRAY['stepper', 'motor', 'driver', 'precision', 'uln2003'],
'{"Steps": "2048 steps/revolution", "Operating Voltage": "5V DC", "Driver": "ULN2003", "Gear Ratio": "1:64", "Torque": "34 N-cm", "Type": "Unipolar"}'::jsonb),

('NEMA 17 Stepper Motor', 'Standard size stepper motor for CNC, 3D printers, and precision applications', 'Actuators', '₹450-750', 'In Stock',
ARRAY['stepper', 'nema17', 'cnc', '3d-printer', 'high-torque'],
'{"Steps": "200 steps/rev (1.8°)", "Holding Torque": "4.5 kg-cm", "Rated Current": "1.7A", "Phases": "2", "Size": "42mm x 42mm", "Shaft": "5mm"}'::jsonb);

-- MOTOR DRIVERS
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('L298N Motor Driver Module', 'Dual H-bridge motor driver for controlling DC and stepper motors', 'Motor Drivers', '₹150-280', 'In Stock',
ARRAY['motor-driver', 'h-bridge', 'l298n', 'dc-motor', 'robotics'],
'{"Channels": "2", "Max Current": "2A per channel", "Operating Voltage": "5-35V", "Control": "TTL logic", "Protection": "Diodes included", "Can Drive": "DC motors, Stepper motors"}'::jsonb),

('L293D Motor Driver IC', 'Quad half H-bridge driver IC for controlling small DC motors', 'Motor Drivers', '₹40-90', 'In Stock',
ARRAY['motor-driver', 'h-bridge', 'l293d', 'ic', 'dc-motor'],
'{"Channels": "4 half-H or 2 full-H", "Max Current": "600mA per channel", "Operating Voltage": "4.5-36V", "Logic Voltage": "5V", "Package": "16-pin DIP"}'::jsonb),

('DRV8825 Stepper Motor Driver', 'Advanced stepper motor driver with microstepping capability', 'Motor Drivers', '₹180-350', 'In Stock',
ARRAY['stepper-driver', 'drv8825', 'microstepping', 'cnc', 'precision'],
'{"Max Current": "2.2A", "Microstepping": "Up to 1/32", "Operating Voltage": "8.2-45V", "Protection": "Overcurrent, thermal", "Interface": "Step/Direction"}'::jsonb);

-- COMMUNICATION MODULES
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('HC-05 Bluetooth Module', 'Classic Bluetooth module for wireless serial communication', 'Communication', '₹250-450', 'In Stock',
ARRAY['bluetooth', 'wireless', 'serial', 'hc-05', 'communication'],
'{"Bluetooth": "v2.0+EDR", "Range": "10m", "Frequency": "2.4GHz", "Interface": "UART", "Operating Voltage": "3.3-6V", "Baud Rate": "9600-1382400"}'::jsonb),

('HC-06 Bluetooth Module', 'Slave-only Bluetooth module for simple wireless projects', 'Communication', '₹200-380', 'In Stock',
ARRAY['bluetooth', 'wireless', 'serial', 'hc-06', 'slave'],
'{"Bluetooth": "v2.0+EDR", "Range": "10m", "Mode": "Slave only", "Interface": "UART", "Operating Voltage": "3.3-6V", "Default Baud": "9600"}'::jsonb),

('nRF24L01+ Wireless Module', '2.4GHz wireless transceiver module for long-range communication', 'Communication', '₹100-200', 'In Stock',
ARRAY['wireless', 'rf', 'nrf24l01', '2.4ghz', 'transceiver'],
'{"Frequency": "2.4GHz", "Range": "100m (with PA+LNA version)", "Data Rate": "250Kbps-2Mbps", "Operating Voltage": "3.3V", "Interface": "SPI", "Channels": "125"}'::jsonb),

('SIM800L GSM/GPRS Module', 'GSM module for SMS, calls, and mobile data connectivity', 'Communication', '₹400-700', 'Limited',
ARRAY['gsm', 'gprs', 'sms', 'sim800l', 'cellular', 'iot'],
'{"Bands": "GSM 850/900/1800/1900MHz", "GPRS": "Class 10", "SMS": "Yes", "Voice": "Yes", "Operating Voltage": "3.7-4.2V", "SIM": "Micro SIM"}'::jsonb),

('LoRa SX1278 Ra-02 Module', 'Long-range low-power wireless module for IoT applications', 'Communication', '₹350-600', 'In Stock',
ARRAY['lora', 'long-range', 'low-power', 'iot', 'sx1278'],
'{"Frequency": "433MHz", "Range": "Up to 3-5km", "Modulation": "LoRa", "Sensitivity": "-148dBm", "Interface": "SPI", "Power Consumption": "10mA receiving"}'::jsonb);

-- DISPLAYS
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('16x2 LCD Display with I2C', 'Character LCD display with I2C interface for easy connection', 'Displays', '₹150-280', 'In Stock',
ARRAY['lcd', 'display', '16x2', 'i2c', 'character'],
'{"Size": "16 characters x 2 rows", "Interface": "I2C", "Backlight": "Blue/Green", "Operating Voltage": "5V", "Viewing Angle": "Wide", "Controller": "HD44780"}'::jsonb),

('20x4 LCD Display with I2C', 'Large character LCD with 4 rows for more information display', 'Displays', '₹280-450', 'In Stock',
ARRAY['lcd', 'display', '20x4', 'i2c', 'character'],
'{"Size": "20 characters x 4 rows", "Interface": "I2C", "Backlight": "Blue", "Operating Voltage": "5V", "Controller": "HD44780"}'::jsonb),

('0.96" OLED Display I2C 128x64', 'Small OLED display with high contrast and sharp graphics', 'Displays', '₹200-380', 'In Stock',
ARRAY['oled', 'display', 'i2c', 'graphics', '128x64'],
'{"Resolution": "128x64 pixels", "Size": "0.96 inch", "Interface": "I2C", "Colors": "White/Blue/Yellow", "Operating Voltage": "3-5V", "Driver": "SSD1306"}'::jsonb),

('1.3" OLED Display I2C 128x64', 'Larger OLED display for better visibility', 'Displays', '₹250-450', 'In Stock',
ARRAY['oled', 'display', 'i2c', 'graphics', '128x64'],
'{"Resolution": "128x64 pixels", "Size": "1.3 inch", "Interface": "I2C/SPI", "Colors": "White/Blue", "Operating Voltage": "3-5V", "Driver": "SH1106"}'::jsonb),

('TFT LCD 1.8" Color Display', 'Color TFT display with SPI interface for graphics and UI', 'Displays', '₹350-600', 'In Stock',
ARRAY['tft', 'lcd', 'color', 'graphics', 'spi'],
'{"Resolution": "128x160 pixels", "Size": "1.8 inch", "Interface": "SPI", "Colors": "65K", "Operating Voltage": "3.3-5V", "Driver": "ST7735"}'::jsonb),

('7-Segment 4-Digit Display', 'LED 7-segment display for numeric output', 'Displays', '₹80-150', 'In Stock',
ARRAY['7-segment', 'led', 'numeric', 'tm1637', 'display'],
'{"Digits": "4", "Driver": "TM1637", "Interface": "2-wire", "Color": "Red/Blue/Green", "Operating Voltage": "5V", "Height": "0.56 inch"}'::jsonb);

-- POWER COMPONENTS
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('5V 2A Power Adapter', 'Wall adapter for powering Arduino and other 5V devices', 'Power Supply', '₹150-250', 'In Stock',
ARRAY['adapter', 'power', '5v', 'wall-adapter', 'dc'],
'{"Output Voltage": "5V DC", "Output Current": "2A", "Input": "100-240V AC", "Connector": "DC barrel jack 5.5mm x 2.1mm", "Cable Length": "1.2m"}'::jsonb),

('12V 2A Power Adapter', 'Higher voltage adapter for motors and LED strips', 'Power Supply', '₹180-320', 'In Stock',
ARRAY['adapter', 'power', '12v', 'wall-adapter', 'dc'],
'{"Output Voltage": "12V DC", "Output Current": "2A", "Input": "100-240V AC", "Connector": "DC barrel jack", "Protection": "Short circuit, overcurrent"}'::jsonb),

('MB102 Breadboard Power Supply', 'Dual voltage power supply module for breadboards', 'Power Supply', '₹60-120', 'In Stock',
ARRAY['breadboard', 'power', 'mb102', 'dual-voltage', '3.3v', '5v'],
'{"Output": "3.3V and 5V", "Input": "6.5-12V DC or USB", "Current": "Up to 700mA", "Switch": "ON/OFF for each rail", "Compatible": "Standard breadboards"}'::jsonb),

('18650 Lithium Battery 3.7V', 'Rechargeable lithium-ion battery for portable projects', 'Power Supply', '₹150-300', 'In Stock',
ARRAY['battery', '18650', 'lithium', 'rechargeable', 'portable'],
'{"Voltage": "3.7V", "Capacity": "2200-3000mAh", "Type": "Lithium-ion", "Rechargeable": "Yes", "Dimensions": "18mm x 65mm", "Protection": "Recommended"}'::jsonb),

('TP4056 Lithium Battery Charger', 'USB charging module for lithium batteries', 'Power Supply', '₹30-70', 'In Stock',
ARRAY['charger', 'lithium', 'usb', 'tp4056', 'battery'],
'{"Input": "5V USB", "Charging Current": "1A (default)", "Battery Type": "Lithium 3.7V", "Protection": "Overcharge, over-discharge", "Indicator": "LED"}'::jsonb),

('LM2596 Buck Converter', 'Step-down DC-DC converter module', 'Power Supply', '₹80-150', 'In Stock',
ARRAY['buck-converter', 'dc-dc', 'step-down', 'lm2596', 'voltage-regulator'],
'{"Input Voltage": "4-35V", "Output Voltage": "1.25-30V (adjustable)", "Max Current": "3A", "Efficiency": "Up to 92%", "Display": "Optional voltmeter"}'::jsonb),

('XL6009 Boost Converter', 'Step-up DC-DC converter module', 'Power Supply', '₹100-180', 'In Stock',
ARRAY['boost-converter', 'dc-dc', 'step-up', 'xl6009', 'voltage-regulator'],
'{"Input Voltage": "3-32V", "Output Voltage": "5-35V (adjustable)", "Max Current": "4A", "Efficiency": "Up to 94%", "Protection": "Short circuit"}'::jsonb);

-- RELAYS & SWITCHES
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('5V Single Channel Relay Module', 'Relay module for controlling high voltage/current devices', 'Relays & Switches', '₹50-100', 'In Stock',
ARRAY['relay', '5v', 'switch', 'control', 'high-voltage'],
'{"Coil Voltage": "5V DC", "Contact Rating": "10A 250V AC / 10A 30V DC", "Trigger": "Low/High level", "Indicator": "LED", "Opto-isolated": "Yes"}'::jsonb),

('4-Channel Relay Module', 'Four relay channels for multiple device control', 'Relays & Switches', '₹200-350', 'In Stock',
ARRAY['relay', 'multi-channel', '4-channel', 'automation', 'control'],
'{"Channels": "4", "Coil Voltage": "5V DC", "Contact Rating": "10A 250V AC", "Control": "High/Low level", "Opto-isolated": "Yes"}'::jsonb),

('Limit Switch with Roller', 'Mechanical switch for position detection', 'Relays & Switches', '₹30-60', 'In Stock',
ARRAY['limit-switch', 'mechanical', 'position', 'endstop', 'roller'],
'{"Type": "SPDT", "Rating": "5A 250V AC", "Operating Force": "50-100g", "Life Cycles": "1M+ operations", "Mounting": "Holes provided"}'::jsonb),

('Reed Switch with Magnet', 'Magnetic proximity switch for contactless sensing', 'Relays & Switches', '₹20-50', 'In Stock',
ARRAY['reed-switch', 'magnetic', 'contactless', 'proximity', 'sensor'],
'{"Type": "Normally Open", "Rating": "1A 200V DC", "Operating Distance": "10-15mm", "Material": "Glass", "Includes": "Magnet"}'::jsonb);

-- ELECTRONIC COMPONENTS
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('LED Assortment Kit (5mm)', 'Mixed pack of 5mm LEDs in various colors', 'Electronic Components', '₹80-150', 'In Stock',
ARRAY['led', 'light', 'indicator', '5mm', 'assorted'],
'{"Colors": "Red, Green, Blue, Yellow, White", "Size": "5mm", "Forward Voltage": "1.8-3.3V", "Current": "20mA", "Quantity": "100 pcs (assorted)"}'::jsonb),

('Resistor Kit (1/4W)', 'Assorted resistor kit with common values', 'Electronic Components', '₹120-200', 'In Stock',
ARRAY['resistor', 'passive', 'assorted', 'kit', '1/4w'],
'{"Power": "1/4W", "Tolerance": "±5%", "Type": "Carbon film", "Values": "10Ω to 1MΩ", "Quantity": "600 pcs (30 values x 20)"}'::jsonb),

('Ceramic Capacitor Kit', 'Assorted ceramic capacitors for general purpose', 'Electronic Components', '₹100-180', 'In Stock',
ARRAY['capacitor', 'ceramic', 'passive', 'kit', 'assorted'],
'{"Type": "Ceramic", "Voltage": "50V", "Values": "10pF to 100nF", "Quantity": "300 pcs", "Temperature Coefficient": "±10%"}'::jsonb),

('Electrolytic Capacitor Kit', 'Polarized capacitors for power supply filtering', 'Electronic Components', '₹120-220', 'In Stock',
ARRAY['capacitor', 'electrolytic', 'polarized', 'power', 'kit'],
'{"Type": "Electrolytic", "Voltage": "16V, 25V, 50V", "Values": "1µF to 1000µF", "Quantity": "120 pcs", "Temperature": "-40 to 105°C"}'::jsonb),

('Transistor Kit (NPN & PNP)', 'Common bipolar transistors for switching and amplification', 'Electronic Components', '₹150-250', 'In Stock',
ARRAY['transistor', 'npn', 'pnp', 'switching', 'amplifier'],
'{"Types": "2N2222, 2N3904, 2N3906, BC547, BC557", "Package": "TO-92", "Quantity": "100 pcs", "Applications": "Switching, amplification"}'::jsonb),

('Diode Kit (1N4007)', 'Rectifier diodes for AC to DC conversion', 'Electronic Components', '₹50-100', 'In Stock',
ARRAY['diode', 'rectifier', '1n4007', 'power', 'protection'],
'{"Type": "Rectifier", "Voltage": "1000V", "Current": "1A", "Package": "DO-41", "Quantity": "50 pcs", "Applications": "Rectification, protection"}'::jsonb),

('Potentiometer Kit', 'Variable resistors for voltage division and control', 'Electronic Components', '₹100-180', 'In Stock',
ARRAY['potentiometer', 'variable-resistor', 'trimmer', 'adjustment', 'control'],
'{"Type": "Rotary", "Values": "1K, 10K, 100K, 1M", "Power": "0.125W", "Rotation": "300°", "Quantity": "20 pcs (5 of each)"}'::jsonb);

-- BREADBOARDS & PROTOTYPING
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('Solderless Breadboard 830 Points', 'Standard breadboard for circuit prototyping', 'Prototyping', '₹80-150', 'In Stock',
ARRAY['breadboard', 'prototyping', 'solderless', '830-points', 'circuit'],
'{"Contact Points": "830", "Size": "165mm x 55mm", "Power Rails": "2 x 2", "Material": "ABS plastic", "Color": "White/Transparent"}'::jsonb),

('Mini Breadboard 400 Points', 'Compact breadboard for small projects', 'Prototyping', '₹40-80', 'In Stock',
ARRAY['breadboard', 'mini', 'compact', '400-points', 'portable'],
'{"Contact Points": "400", "Size": "83mm x 55mm", "Power Rails": "2", "Color": "White/Transparent", "Stackable": "Yes"}'::jsonb),

('Jumper Wire Set (Male-Male)', 'Flexible jumper wires for breadboard connections', 'Prototyping', '₹60-120', 'In Stock',
ARRAY['jumper-wire', 'male-male', 'breadboard', 'connection', 'wire'],
'{"Type": "Male to Male", "Length": "20cm", "Quantity": "65 pcs", "Colors": "Multiple", "Flexible": "Yes"}'::jsonb),

('Jumper Wire Set (Male-Female)', 'Jumper wires for board-to-board connections', 'Prototyping', '₹60-120', 'In Stock',
ARRAY['jumper-wire', 'male-female', 'connection', 'wire', 'dupont'],
'{"Type": "Male to Female", "Length": "20cm", "Quantity": "40 pcs", "Colors": "Multiple", "Applications": "Arduino, sensor connections"}'::jsonb),

('Jumper Wire Set (Female-Female)', 'Female jumper wires for module connections', 'Prototyping', '₹60-120', 'In Stock',
ARRAY['jumper-wire', 'female-female', 'connection', 'module', 'wire'],
'{"Type": "Female to Female", "Length": "20cm", "Quantity": "40 pcs", "Colors": "Multiple", "Applications": "Module connections"}'::jsonb),

('PCB Prototype Board', 'Copper-clad board for permanent circuits', 'Prototyping', '₹30-80', 'In Stock',
ARRAY['pcb', 'prototype', 'copper', 'permanent', 'soldering'],
'{"Size": "5cm x 7cm", "Material": "FR4 fiberglass", "Copper": "Single-sided", "Holes": "Universal perforated", "Thickness": "1.6mm"}'::jsonb),

('Soldering Iron Kit 60W', 'Complete soldering kit for electronics assembly', 'Prototyping', '₹350-600', 'In Stock',
ARRAY['soldering-iron', 'soldering', 'tools', 'assembly', 'welding'],
'{"Power": "60W", "Temperature": "200-450°C", "Includes": "Stand, sponge, solder wire, tips", "Cord Length": "1.5m", "Voltage": "230V AC"}'::jsonb);

-- ROBOTICS & MECHANICAL
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('Robot Chassis 2WD', 'Two-wheel drive robot chassis kit with motors', 'Robotics', '₹250-450', 'In Stock',
ARRAY['chassis', 'robot', '2wd', 'wheels', 'motors', 'platform'],
'{"Drive": "2WD", "Motors": "2x BO motors included", "Wheels": "2x 65mm diameter", "Material": "Acrylic", "Battery Holder": "4xAA", "Color": "Transparent/Black"}'::jsonb),

('Robot Chassis 4WD', 'Four-wheel drive robot platform for better stability', 'Robotics', '₹450-750', 'In Stock',
ARRAY['chassis', 'robot', '4wd', 'wheels', 'motors', 'platform'],
'{"Drive": "4WD", "Motors": "4x BO motors included", "Wheels": "4x 65mm diameter", "Material": "Acrylic", "Battery Holder": "4xAA", "Dimensions": "25cm x 18cm"}'::jsonb),

('Robotic Arm Gripper', 'Mechanical gripper for pick-and-place robots', 'Robotics', '₹350-600', 'In Stock',
ARRAY['gripper', 'claw', 'robotic-arm', 'pick-place', 'servo'],
'{"Opening": "Up to 75mm", "Material": "Aluminum alloy", "Weight": "50g", "Servo Mount": "Standard servo compatible", "Color": "Silver"}'::jsonb),

('Metal Servo Bracket U-Shape', 'Multi-angle metal bracket for servo mounting', 'Robotics', '₹80-150', 'In Stock',
ARRAY['bracket', 'servo', 'mounting', 'metal', 'robotics'],
'{"Material": "Aluminum", "Holes": "Multiple mounting options", "Compatible": "Standard servos", "Angles": "Adjustable", "Color": "Silver/Black"}'::jsonb),

('Omni Wheel 48mm', 'Omnidirectional wheel for advanced robot mobility', 'Robotics', '₹200-350', 'In Stock',
ARRAY['wheel', 'omni', 'omnidirectional', 'robot', 'mobility'],
'{"Diameter": "48mm", "Rollers": "12 pcs", "Material": "Plastic body, rubber rollers", "Bore": "6mm", "Weight": "25g"}'::jsonb),

('Metal Gear Micro Motor Bracket', 'L-shaped bracket for motor mounting', 'Robotics', '₹40-80', 'In Stock',
ARRAY['bracket', 'motor', 'mounting', 'metal', 'l-shape'],
'{"Material": "Stainless steel", "Compatible": "N20, 130, BO motors", "Holes": "M3 mounting", "Thickness": "1mm", "Finish": "Chrome plated"}'::jsonb);

-- INPUT DEVICES
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('Push Button Switch (12mm)', 'Tactile push button for user input', 'Input Devices', '₹10-25', 'In Stock',
ARRAY['button', 'switch', 'push-button', 'tactile', 'input'],
'{"Size": "12mm x 12mm", "Type": "Momentary", "Contacts": "4-pin", "Life": "100K operations", "Force": "100gf", "Color": "Various"}'::jsonb),

('4x4 Matrix Keypad', 'Membrane keypad with 16 keys for numeric input', 'Input Devices', '₹80-150', 'In Stock',
ARRAY['keypad', 'matrix', '4x4', 'input', 'numeric'],
'{"Keys": "16 (0-9, A-D, *, #)", "Type": "Matrix membrane", "Interface": "8-pin connector", "Size": "69mm x 77mm", "Thickness": "0.8mm"}'::jsonb),

('Rotary Encoder Module', 'Rotary encoder for directional input and menu navigation', 'Input Devices', '₹80-150', 'In Stock',
ARRAY['encoder', 'rotary', 'input', 'navigation', 'menu'],
'{"Type": "Incremental", "Pulses": "20 per revolution", "Push Button": "Integrated", "Output": "2-channel + switch", "Operating Voltage": "5V"}'::jsonb),

('Joystick Module (PS2 Style)', 'Analog joystick for directional control', 'Input Devices', '₹100-180', 'In Stock',
ARRAY['joystick', 'analog', 'control', 'ps2', 'gaming'],
'{"Axes": "2 (X, Y)", "Output": "Analog voltage", "Push Button": "Z-axis", "Operating Voltage": "5V", "Range": "0-5V analog"}'::jsonb),

('Membrane Switch Panel', 'Custom membrane keypad for project interfaces', 'Input Devices', '₹60-120', 'In Stock',
ARRAY['membrane', 'keypad', 'switch', 'panel', 'custom'],
'{"Keys": "4-16 customizable", "Type": "Membrane", "Thickness": "0.8mm", "Interface": "Ribbon cable", "Tactile Feedback": "Yes"}'::jsonb);

-- SOUND & AUDIO
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('Passive Buzzer Module', 'Buzzer that requires PWM signal for tones', 'Audio', '₹20-50', 'In Stock',
ARRAY['buzzer', 'passive', 'sound', 'alarm', 'pwm'],
'{"Type": "Passive (PWM controlled)", "Operating Voltage": "3-5V", "Frequency Range": "2-5kHz", "Sound Level": "85dB", "Connection": "3-pin"}'::jsonb),

('Active Buzzer Module', 'Simple buzzer that produces fixed tone', 'Audio', '₹20-50', 'In Stock',
ARRAY['buzzer', 'active', 'sound', 'alarm', 'simple'],
'{"Type": "Active (fixed tone)", "Operating Voltage": "3-5V", "Frequency": "2.3kHz", "Sound Level": "85dB", "Connection": "2-pin"}'::jsonb),

('Sound Sensor Module', 'Microphone module for sound detection', 'Audio', '₹50-100', 'In Stock',
ARRAY['microphone', 'sound', 'sensor', 'audio', 'detection'],
'{"Type": "Electret microphone", "Output": "Analog + Digital", "Sensitivity": "Adjustable via potentiometer", "Operating Voltage": "3.3-5V", "Indicator": "LED"}'::jsonb),

('DFPlayer Mini MP3 Module', 'MP3 player module with built-in amplifier', 'Audio', '₹150-280', 'In Stock',
ARRAY['mp3', 'audio', 'player', 'dfplayer', 'speaker'],
'{"Storage": "MicroSD card", "Formats": "MP3, WAV", "Output": "3W amplifier", "Control": "Serial UART", "Operating Voltage": "3.2-5V", "DAC": "24-bit"}'::jsonb),

('Small Speaker 8Ω 0.5W', 'Mini speaker for audio output', 'Audio', '₹30-60', 'In Stock',
ARRAY['speaker', 'audio', 'output', 'sound', 'mini'],
'{"Impedance": "8Ω", "Power": "0.5W", "Diameter": "28mm", "Frequency Response": "300Hz-20kHz", "Connector": "2-wire"}'::jsonb);

-- STORAGE & MEMORY
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('MicroSD Card Module', 'SD card reader module for data logging', 'Storage', '₹80-150', 'In Stock',
ARRAY['sd-card', 'microsd', 'storage', 'data-logging', 'spi'],
'{"Interface": "SPI", "Compatible": "MicroSD, MicroSDHC", "Operating Voltage": "3.3-5V", "Level Shifter": "Included", "Max Capacity": "32GB"}'::jsonb),

('AT24C256 EEPROM Module', 'I2C EEPROM for non-volatile data storage', 'Storage', '₹80-150', 'In Stock',
ARRAY['eeprom', 'memory', 'i2c', 'non-volatile', 'storage'],
'{"Capacity": "256Kbit (32KB)", "Interface": "I2C", "Operating Voltage": "2.5-5.5V", "Write Cycles": "1M", "Data Retention": "100 years"}'::jsonb);

-- REAL-TIME CLOCK
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('DS3231 RTC Module', 'Precision real-time clock with temperature compensation', 'Timing', '₹150-280', 'In Stock',
ARRAY['rtc', 'real-time-clock', 'ds3231', 'time', 'i2c'],
'{"Accuracy": "±2ppm (±1 min/year)", "Interface": "I2C", "Battery Backup": "CR2032", "Temperature Sensor": "Integrated", "Operating Voltage": "3.3-5V", "Alarm": "2 programmable"}'::jsonb),

('DS1307 RTC Module', 'Basic real-time clock for timekeeping', 'Timing', '₹80-150', 'In Stock',
ARRAY['rtc', 'real-time-clock', 'ds1307', 'time', 'i2c'],
'{"Accuracy": "Basic", "Interface": "I2C", "Battery Backup": "CR2032 socket", "Operating Voltage": "5V", "RAM": "56 bytes"}'::jsonb);

-- MISCELLANEOUS
INSERT INTO components (name, description, category, price, stock, tags, specifications) VALUES
('USB to TTL Serial Adapter', 'USB serial converter for programming and debugging', 'Programming', '₹120-220', 'In Stock',
ARRAY['usb', 'ttl', 'serial', 'uart', 'programmer', 'ftdi'],
'{"Chip": "CH340G/CP2102", "Interface": "USB to UART", "Voltage": "3.3V and 5V", "Pins": "TX, RX, GND, VCC", "Drivers": "Widely supported"}'::jsonb),

('IR Receiver Module (TSOP1738)', 'Infrared receiver for remote control projects', 'Input Devices', '₹20-50', 'In Stock',
ARRAY['ir', 'infrared', 'receiver', 'remote', 'tsop1738'],
'{"Model": "TSOP1738", "Frequency": "38kHz", "Range": "Up to 10m", "Operating Voltage": "2.7-5.5V", "Output": "Active low"}'::jsonb),

('IR LED Transmitter', 'Infrared LED for remote control transmission', 'Output Devices', '₹10-25', 'In Stock',
ARRAY['ir', 'infrared', 'led', 'transmitter', 'remote'],
'{"Wavelength": "940nm", "Beam Angle": "20-30°", "Forward Voltage": "1.2-1.4V", "Current": "100mA", "Size": "5mm"}'::jsonb),

('WS2812B RGB LED Strip', 'Individually addressable RGB LED strip', 'Lighting', '₹300-600', 'In Stock',
ARRAY['rgb', 'led', 'ws2812b', 'neopixel', 'addressable', 'strip'],
'{"LEDs": "30/60 per meter", "Control": "1-wire digital", "Voltage": "5V", "Current": "60mA per LED (max)", "Protocol": "WS2812B", "Colors": "16.7M colors"}'::jsonb),

('Soil Moisture Sensor', 'Capacitive or resistive sensor for soil humidity', 'Sensors', '₹60-120', 'In Stock',
ARRAY['soil', 'moisture', 'humidity', 'plant', 'agriculture'],
'{"Type": "Capacitive/Resistive", "Output": "Analog", "Operating Voltage": "3.3-5V", "Probe Length": "6cm", "Applications": "Plant monitoring, irrigation"}'::jsonb),

('Water Level Sensor', 'Detects water level and depth', 'Sensors', '₹50-100', 'In Stock',
ARRAY['water', 'level', 'depth', 'liquid', 'detection'],
'{"Output": "Analog", "Detection Area": "40mm x 16mm", "Operating Voltage": "3-5V", "Current": "<20mA", "Applications": "Water tank, rain detection"}'::jsonb),

('Flame Sensor Module', 'Infrared flame detection sensor for fire detection', 'Sensors', '₹50-100', 'In Stock',
ARRAY['flame', 'fire', 'infrared', 'safety', 'detection'],
'{"Detection Range": "760-1100nm", "Detection Angle": "60°", "Distance": "Up to 1m", "Output": "Digital + Analog", "Operating Voltage": "3.3-5V"}'::jsonb),

('Rain Drop Sensor', 'Detects rain and water drops', 'Sensors', '₹40-80', 'In Stock',
ARRAY['rain', 'water', 'drop', 'weather', 'detection'],
'{"Sensing Area": "5cm x 4cm", "Output": "Analog + Digital", "Operating Voltage": "5V", "Sensitivity": "Adjustable", "Applications": "Weather monitoring, wipers"}'::jsonb),

('Touch Sensor Module (TTP223)', 'Capacitive touch sensor for touch-based input', 'Sensors', '₹30-60', 'In Stock',
ARRAY['touch', 'capacitive', 'ttp223', 'input', 'sensor'],
'{"Type": "Capacitive touch", "Output": "Digital", "Operating Voltage": "2-5.5V", "Response Time": "100ms", "Mode": "Toggle/Direct"}'::jsonb);
