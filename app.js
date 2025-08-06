// CHIP MVP Application JavaScript - Enhanced Version

// Demo data from application_data_json
const demoData = {
  demoBuildings: [
    {
      id: "demo-delhi-hospital",
      name: "Regional Hospital New Delhi",
      location: {lat: 28.6139, lon: 77.2090, city: "New Delhi", country: "India"},
      buildingType: "hospital",
      climateZone: "Subtropical",
      floorArea: 2500,
      floors: 3,
      uploaded: "2024-01-15T10:30:00Z"
    },
    {
      id: "demo-mumbai-clinic", 
      name: "Community Health Center Mumbai",
      location: {lat: 19.0760, lon: 72.8777, city: "Mumbai", country: "India"},
      buildingType: "clinic",
      climateZone: "Tropical",
      floorArea: 800,
      floors: 2,
      uploaded: "2024-01-20T14:15:00Z"
    }
  ],
  weatherData: {
    newDelhi: {
      temperature: 34.5,
      humidity: 68,
      windSpeed: 12.5,
      solarIrradiance: 850,
      uvIndex: 9,
      airQuality: "Moderate"
    },
    mumbai: {
      temperature: 31.2,
      humidity: 78,
      windSpeed: 18.3,
      solarIrradiance: 720,
      uvIndex: 8,
      airQuality: "Poor"
    }
  },
  simulationResults: {
    energyAnalysis: {
      annualConsumption: 145000,
      energyIntensity: 58,
      peakCooling: 85.5,
      peakHeating: 12.3,
      coolingLoad: 89500,
      heatingLoad: 8200
    },
    solarAnalysis: {
      annualSolarGain: 32500,
      peakSolarGain: 45.8,
      daylightAvailability: 72,
      solarHeatGainCoeff: 0.32
    },
    thermalComfort: {
      comfortableHours: 6840,
      comfortPercentage: 78.1,
      overheatingHours: 1250,
      underheatingHours: 670
    },
    climateResilience: {
      heatStressRisk: "High",
      coolingSystemStrain: 85,
      adaptiveComfortPotential: 65,
      vulnerabilityScore: "Moderate-High"
    }
  },
  recommendations: [
    {
      category: "Cooling",
      title: "Enhanced Natural Ventilation",
      description: "Install cross-ventilation systems and ceiling fans to reduce mechanical cooling loads by 25-30%",
      estimatedSavings: "25-30% cooling energy",
      implementationCost: "â‚¹2,50,000 - â‚¹4,00,000",
      paybackPeriod: "18-24 months",
      climateBenefit: "Reduces overheating risk during power outages",
      priority: "High"
    },
    {
      category: "Solar Protection", 
      title: "External Shading Systems",
      description: "Install overhangs, louvers, or vegetation for solar heat gain control",
      estimatedSavings: "15-25% cooling energy",
      implementationCost: "â‚¹3,50,000 - â‚¹6,00,000", 
      paybackPeriod: "24-36 months",
      climateBenefit: "Maintains indoor comfort during extreme heat events",
      priority: "High"
    },
    {
      category: "Building Envelope",
      title: "Cool Roof Technology", 
      description: "Apply reflective roof coatings or install cool roof materials",
      estimatedSavings: "10-20% cooling energy",
      implementationCost: "â‚¹1,50,000 - â‚¹2,50,000",
      paybackPeriod: "12-18 months", 
      climateBenefit: "Reduces urban heat island effect and building heat gain",
      priority: "Medium"
    },
    {
      category: "Backup Systems",
      title: "Solar + Battery Backup",
      description: "Install solar panels with battery backup for critical operations",
      estimatedSavings: "40-60% grid dependency",
      implementationCost: "â‚¹8,00,000 - â‚¹12,00,000",
      paybackPeriod: "48-60 months",
      climateBenefit: "Ensures power during climate-related grid failures", 
      priority: "High"
    }
  ]
};

// Global state
let currentBuilding = null;
let currentLocation = null;
let qualitativeData = null;
let uploadedPhotos = {};
let scene, camera, renderer, controls;
let animationId = null;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('CHIP Enhanced app initializing...');
  initializeApp();
});

function initializeApp() {
  setupNavigation();
  setupUploadForm();
  setupQualitativeForm();
  setupSimulation();
  setupEventListeners();
  renderDemoBuildings();
  renderRecommendations();
  
  // Show landing page by default
  showSection('landing');
  console.log('CHIP Enhanced app initialized successfully');
}

function setupNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  console.log(`Setting up navigation for ${navLinks.length} links`);
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      console.log(`Navigating to section: ${targetId}`);
      showSection(targetId);
      updateActiveNav(link);
      
      // Handle section-specific initialization
      if (targetId === 'visualizer') {
        setTimeout(() => {
          console.log('Initializing 3D visualizer...');
          init3DVisualizer();
        }, 200);
      } else if (targetId === 'results') {
        setTimeout(() => {
          console.log('Rendering charts...');
          renderCharts();
        }, 100);
      }
    });
  });
}

function updateActiveNav(activeLink) {
  document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
  activeLink.classList.add('active');
}

function showSection(sectionId) {
  console.log(`Showing section: ${sectionId}`);
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('hidden');
  });
  
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.remove('hidden');
    console.log(`Successfully showed section: ${sectionId}`);
  } else {
    console.error(`Section not found: ${sectionId}`);
  }
}

// Image preview function for photo uploads
function previewImage(input, previewId) {
  const file = input.files[0];
  const previewContainer = document.getElementById(previewId);
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      previewContainer.innerHTML = `<img src="${e.target.result}" class="picture-preview" alt="Preview">`;
      
      // Store the photo data
      const photoType = input.id.replace('Photo', '');
      uploadedPhotos[photoType] = {
        file: file,
        preview: e.target.result,
        uploaded: new Date().toISOString()
      };
      
      console.log(`${photoType} photo uploaded and previewed`);
    };
    reader.readAsDataURL(file);
  }
}

function setupUploadForm() {
  const form = document.getElementById('uploadForm');
  if (form) {
    form.addEventListener('submit', handleUpload);
    console.log('Upload form event listener attached');
  }

  // Setup photo upload handlers
  const photoInputs = ['exteriorPhoto', 'interiorPhoto', 'roofPhoto', 'hvacPhoto'];
  photoInputs.forEach(inputId => {
    const input = document.getElementById(inputId);
    if (input) {
      const previewId = inputId.replace('Photo', 'Preview');
      input.addEventListener('change', () => previewImage(input, previewId));
    }
  });
}

function setupQualitativeForm() {
  const qualitativeForm = document.getElementById('qualitativeForm');
  if (qualitativeForm) {
    qualitativeForm.addEventListener('submit', handleQualitativeSubmit);
    console.log('Qualitative form event listener attached');
  }
}

function handleQualitativeSubmit(e) {
  e.preventDefault();
  console.log('Processing qualitative research submission...');
  
  const formData = new FormData(e.target);
  
  // Collect all form data
  qualitativeData = {
    climateStressor: formData.get('climateStressor'),
    roofTemp: document.getElementById('roofTemp').value,
    wallTemp: document.getElementById('wallTemp').value,
    challenges: formData.getAll('challenges'),
    suggestions: document.getElementById('suggestions').value,
    submittedAt: new Date().toISOString()
  };
  
  console.log('Qualitative Research Data:', qualitativeData);
  
  // Validate required fields
  if (!qualitativeData.climateStressor || !qualitativeData.roofTemp || !qualitativeData.wallTemp) {
    alert('Please fill in all required fields (climate stressor and temperature readings).');
    return;
  }
  
  // Show success and progress to simulation
  showQualitativeSuccess();
  
  setTimeout(() => {
    showSection('simulation');
    updateActiveNav(document.querySelector('nav a[href="#simulation"]'));
    startSimulation();
  }, 2000);
}

function showQualitativeSuccess() {
  // Create a temporary success message
  const successMsg = document.createElement('div');
  successMsg.className = 'alert alert-success';
  successMsg.innerHTML = `
    <strong>âœ… Research Data Collected Successfully!</strong><br>
    Climate Stressor: ${qualitativeData.climateStressor}<br>
    Temperature Readings: Roof ${qualitativeData.roofTemp}Â°C, Walls ${qualitativeData.wallTemp}Â°C<br>
    Proceeding to simulation...
  `;
  
  const form = document.getElementById('qualitativeForm');
  form.parentNode.insertBefore(successMsg, form.nextSibling);
  
  setTimeout(() => {
    if (successMsg.parentNode) {
      successMsg.parentNode.removeChild(successMsg);
    }
  }, 3000);
}

function setupEventListeners() {
  // Geolocation
  const geoBtn = document.getElementById('geoBtn');
  if (geoBtn) {
    geoBtn.addEventListener('click', getUserLocation);
  }

  // 3D controls (if they exist)
  const heatToggle = document.getElementById('heatToggle');
  const sunToggle = document.getElementById('sunToggle');
  
  if (heatToggle) {
    heatToggle.addEventListener('click', toggleHeatOverlay);
  }
  
  if (sunToggle) {
    sunToggle.addEventListener('click', toggleSunPath);
  }
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      document.getElementById('lat').value = position.coords.latitude.toFixed(4);
      document.getElementById('lon').value = position.coords.longitude.toFixed(4);
      console.log('Location acquired:', position.coords.latitude, position.coords.longitude);
    }, (error) => {
      console.error('Geolocation error:', error);
      alert('Could not get location: ' + error.message);
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function handleUpload(e) {
  e.preventDefault();
  console.log('Processing upload submission...');
  
  const formData = new FormData(e.target);
  const buildingData = {
    name: formData.get('buildingName'),
    type: formData.get('buildingType'),
    lat: parseFloat(formData.get('lat')),
    lon: parseFloat(formData.get('lon')),
    file: formData.get('drawing'),
    photos: uploadedPhotos,
    uploadedAt: new Date().toISOString()
  };

  // Validate required fields
//if (!buildingData.name)
//{
  //  alert('Please fill in building name, type, and coordinates.');
    //return;
//}

// Check if coordinates are valid numbers
//if (isNaN(buildingData.lat) || isNaN(buildingData.lon)) {
  //  alert('Please enter valid latitude and longitude coordinates.');
   // return;
//}

  // Simulate upload progress
  showUploadProgress();
  simulateUploadProgress().then(() => {
    const buildingId = 'CHIP-' + Date.now().toString().slice(-6).toUpperCase();
    showUploadSuccess(buildingId);
    
    currentBuilding = {
      id: buildingId,
      name: buildingData.name,
      location: { lat: buildingData.lat, lon: buildingData.lon },
      buildingType: buildingData.type,
      photos: Object.keys(uploadedPhotos),
      uploadData: buildingData
    };
    
    currentLocation = determineLocation(buildingData.lat, buildingData.lon);
    
    // Auto-advance to qualitative research
    setTimeout(() => {
      showSection('qualitative');
      updateActiveNav(document.querySelector('nav a[href="#qualitative"]'));
    }, 3000);
  });
}

function showUploadProgress() {
  const uploadProgress = document.getElementById('uploadProgress');
  if (uploadProgress) {
    uploadProgress.classList.remove('hidden');
  }
}

function simulateUploadProgress() {
  return new Promise((resolve) => {
    const progressBar = document.getElementById('uploadBar');
    if (!progressBar) {
      resolve();
      return;
    }
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        resolve();
      }
      progressBar.style.width = progress + '%';
    }, 300);
  });
}

function showUploadSuccess(buildingId) {
  const successEl = document.getElementById('uploadSuccess');
  if (successEl) {
    successEl.innerHTML = `
      <strong>âœ… Upload successful!</strong><br>
      Building ID: ${buildingId}<br>
      Photos uploaded: ${Object.keys(uploadedPhotos).length}<br>
      Proceeding to research questions...
    `;
    successEl.classList.remove('hidden');
  }
}

function renderDemoBuildings() {
  const container = document.getElementById('demoList');
  if (!container) return;
  
  container.innerHTML = '';
  
  demoData.demoBuildings.forEach(building => {
    const buildingEl = document.createElement('div');
    buildingEl.className = 'card';
    buildingEl.style.cursor = 'pointer';
    buildingEl.innerHTML = `
      <div class="card__body">
        <h4>${building.name}</h4>
        <div style="margin-top: 8px; color: var(--color-text-secondary);">
          <div>Type: ${building.buildingType}</div>
          <div>Location: ${building.location.city}</div>
          <div>Zone: ${building.climateZone}</div>
          <div>Area: ${building.floorArea}mÂ²</div>
        </div>
      </div>
    `;
    buildingEl.addEventListener('click', () => loadDemoBuilding(building));
    container.appendChild(buildingEl);
  });
}

function loadDemoBuilding(building) {
  console.log('Loading demo building:', building.name);
  currentBuilding = building;
  currentLocation = building.location.city.toLowerCase().replace(' ', '');
  
  // Skip to qualitative research for demo
  showSection('qualitative');
  updateActiveNav(document.querySelector('nav a[href="#qualitative"]'));
}

function setupSimulation() {
  // Simulation will be triggered from qualitative form submission
  console.log('Simulation setup completed');
}

function startSimulation() {
  console.log('Starting enhanced simulation with qualitative data...');
  
  const statusContainer = document.getElementById('simulationStatus');
  if (statusContainer) {
    statusContainer.innerHTML = `
      <p>Starting comprehensive analysis...</p>
      <p style="color: var(--color-text-secondary); font-size: 14px;">
        Incorporating: ${qualitativeData?.climateStressor} stress patterns, 
        thermal readings (${qualitativeData?.roofTemp}Â°C roof, ${qualitativeData?.wallTemp}Â°C walls), 
        and ${Object.keys(uploadedPhotos).length} photos
      </p>
      <div class="progress">
        <div class="progress-bar" id="simProgress"></div>
      </div>
      <div id="simLogs" style="margin-top: 16px;"></div>
    `;
  }
  
  simulateEnhancedProgress();
}

function simulateEnhancedProgress() {
  const progressBar = document.getElementById('simProgress');
  const logs = document.getElementById('simLogs');
  if (!progressBar || !logs) return;
  
  const steps = [
    'Processing building geometry...',
    'Analyzing uploaded photographs...',
    'Integrating temperature measurements...',
    'Loading climate data for location...',
    'Running sun path analysis...',
    'Conducting shadown study...',
    'Conducting air flow simulations...',
    'Calculating energy performance...',
    'Preparing tailored recommendations...'
  ];
  
  let currentStep = 0;
  const stepInterval = setInterval(() => {
    if (currentStep < steps.length) {
      logs.innerHTML += `<p style="margin: 4px 0; color: var(--color-text-secondary);">${steps[currentStep]}</p>`;
      progressBar.style.width = ((currentStep + 1) / steps.length * 100) + '%';
      currentStep++;
      
      // Scroll to bottom of logs
      logs.scrollTop = logs.scrollHeight;
    } else {
      clearInterval(stepInterval);
      logs.innerHTML += '<p style="margin: 8px 0; font-weight: bold; color: var(--color-success);"><strong>âœ… Enhanced simulation complete!</strong></p>';
      
      setTimeout(() => {
        showSection('results');
        updateActiveNav(document.querySelector('nav a[href="#results"]'));
        renderEnhancedResults();
      }, 1500);
    }
  }, 800);
}

function renderEnhancedResults() {
  console.log('Rendering enhanced results...');
  
  // Update risk summary with qualitative data
  const riskSummary = document.getElementById('riskSummary');
  if (riskSummary && qualitativeData) {
    riskSummary.innerHTML = `
      <div class="card__body">
        <h4>Climate Risk Assessment</h4>
        <div style="margin-top: 16px;">
          <div><strong>Primary Stressor:</strong> ${qualitativeData.climateStressor.replace('_', ' ')}</div>
          <div><strong>Indoor Thermal Conditions:</strong></div>
          <ul style="margin-left: 20px;">
            <li>Roof surface temperature: ${qualitativeData.roofTemp}Â°C ${qualitativeData.roofTemp > 35 ? '(âš ï¸ High)' : '(âœ… Normal)'}</li>
            <li>Wall surface temperature: ${qualitativeData.wallTemp}Â°C ${qualitativeData.wallTemp > 30 ? '(âš ï¸ High)' : '(âœ… Normal)'}</li>
          </ul>
          <div><strong>Identified Challenges:</strong> ${qualitativeData.challenges.join(', ') || 'None specified'}</div>
          ${qualitativeData.suggestions ? `<div><strong>Staff Suggestions:</strong> ${qualitativeData.suggestions}</div>` : ''}
        </div>
      </div>
    `;
  }
  
  // Render charts with enhanced data
  renderCharts();
}

function renderCharts() {
  console.log('Rendering enhanced charts...');
  try {
    renderEnergyChart();
    renderSolarChart();
    renderComfortChart();
    if (document.getElementById('resilienceChart')) {
      renderResilienceChart();
    }
    console.log('Enhanced charts rendered successfully');
  } catch (error) {
    console.error('Error rendering charts:', error);
  }
}

function renderEnergyChart() {
  const canvas = document.getElementById('energyChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const data = demoData.simulationResults.energyAnalysis;
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Annual Consumption (MWh)', 'Energy Intensity (kWh/mÂ²)', 'Peak Cooling (kW)', 'Peak Heating (kW)'],
      datasets: [{
        label: 'Energy Metrics',
        data: [data.annualConsumption/1000, data.energyIntensity, data.peakCooling, data.peakHeating],
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function renderSolarChart() {
  const canvas = document.getElementById('solarChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Enhanced solar analysis with monthly data
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Solar Radiation (kWh/mÂ²)',
        data: [120, 140, 180, 220, 250, 230, 200, 190, 170, 150, 130, 110],
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function renderComfortChart() {
  const canvas = document.getElementById('comfortChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const data = demoData.simulationResults.thermalComfort;
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Comfortable Hours', 'Overheating Hours', 'Underheating Hours'],
      datasets: [{
        data: [data.comfortableHours, data.overheatingHours, data.underheatingHours],
        backgroundColor: ['#1FB8CD', '#B4413C', '#FFC185']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

function renderResilienceChart() {
  const canvas = document.getElementById('resilienceChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const data = demoData.simulationResults.climateResilience;
  
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Heat Stress Risk', 'Cooling System Strain', 'Adaptive Comfort', 'Overall Vulnerability'],
      datasets: [{
        label: 'Resilience Metrics',
        data: [75, data.coolingSystemStrain, data.adaptiveComfortPotential, 70],
        backgroundColor: 'rgba(31, 184, 205, 0.2)',
        borderColor: '#1FB8CD',
        pointBackgroundColor: '#1FB8CD'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

function init3DVisualizer() {
  const container = document.getElementById('threejs-container');
  if (!container) {
    console.error('3D container not found');
    return;
  }
  
  console.log('Initializing enhanced 3D visualizer...');
  
  // Clear any existing content
  container.innerHTML = '';
  
  // Cancel any existing animation loop
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  try {
    // Check if THREE is available
    if (typeof THREE === 'undefined') {
      console.error('THREE.js not loaded');
      container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#f0f8ff;color:#333;">THREE.js not available</div>';
      return;
    }

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8f4f8);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // OrbitControls setup
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      console.log('OrbitControls initialized');
    } else {
      console.warn('OrbitControls not available');
    }

    // Enhanced lighting based on qualitative data
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create building with enhanced details
    createEnhancedBuilding();

    // Position camera
    camera.position.set(15, 12, 15);
    camera.lookAt(0, 0, 0);

    console.log('Enhanced 3D scene setup complete, starting animation...');
    
    // Start animation loop
    animate();
    
  } catch (error) {
    console.error('3D initialization error:', error);
    container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#f0f8ff;color:#333;font-size:16px;border-radius:8px;">3D Visualization Error</div>';
  }
}

function createEnhancedBuilding() {
  console.log('Creating enhanced 3D building with qualitative data...');
  
  // Ground plane
  const groundGeometry = new THREE.PlaneGeometry(30, 30);
  const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Main building structure - color based on thermal readings
  const buildingGeometry = new THREE.BoxGeometry(8, 6, 12);
  let buildingColor = 0x87CEEB; // Default blue
  
  if (qualitativeData) {
    const avgTemp = (parseFloat(qualitativeData.roofTemp) + parseFloat(qualitativeData.wallTemp)) / 2;
    if (avgTemp > 35) {
      buildingColor = 0xFF6B6B; // Hot - red
    } else if (avgTemp > 30) {
      buildingColor = 0xFFB347; // Warm - orange  
    }
  }
  
  const buildingMaterial = new THREE.MeshLambertMaterial({ color: buildingColor });
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.y = 3;
  building.castShadow = true;
  building.receiveShadow = true;
  building.name = 'mainBuilding';
  scene.add(building);

  // Roof - enhanced based on roof temperature
  const roofGeometry = new THREE.BoxGeometry(9, 0.5, 13);
  let roofColor = 0x8B4513; // Default brown
  
  if (qualitativeData && qualitativeData.roofTemp > 40) {
    roofColor = 0xB22222; // Hot roof - dark red
  }
  
  const roofMaterial = new THREE.MeshLambertMaterial({ color: roofColor });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = 6.25;
  roof.castShadow = true;
  scene.add(roof);

  // Windows on front face
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      const windowGeometry = new THREE.PlaneGeometry(1.2, 1.5);
      const windowMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x4169E1,
        transparent: true,
        opacity: 0.7
      });
      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(-2.5 + i * 2.5, 2 + j * 2, 6.01);
      scene.add(window);
    }
  }

  // Door
  const doorGeometry = new THREE.PlaneGeometry(1.5, 2.5);
  const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0, 1.25, 6.01);
  scene.add(door);

  // Add vegetation based on climate stressor
  if (qualitativeData?.climateStressor === 'extreme_heat') {
    // Add more shade trees for heat protection
    for (let i = 0; i < 6; i++) {
      const treeGeometry = new THREE.ConeGeometry(1.5, 4, 6);
      const treeMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
      const tree = new THREE.Mesh(treeGeometry, treeMaterial);
      
      const angle = (i / 6) * Math.PI * 2;
      tree.position.set(
        Math.cos(angle) * 10, 
        2, 
        Math.sin(angle) * 10
      );
      tree.castShadow = true;
      scene.add(tree);
    }
  } else if (qualitativeData?.climateStressor === 'flooding') {
    // Add drainage elements
    const drainGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 8);
    const drainMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
    
    for (let i = 0; i < 4; i++) {
      const drain = new THREE.Mesh(drainGeometry, drainMaterial);
      drain.position.set(-8 + i * 5, 0.1, -8);
      scene.add(drain);
    }
  }
  
  console.log('Enhanced 3D building created with qualitative considerations');
}

function animate() {
  animationId = requestAnimationFrame(animate);
  
  if (controls) {
    controls.update();
  }
  
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function toggleHeatOverlay() {
  console.log('Toggling heat overlay...');
  if (!scene) return;
  
  const building = scene.getObjectByName('mainBuilding');
  if (building) {
    const currentColor = building.material.color.getHex();
    if (currentColor === 0x87CEEB || currentColor === 0xFFB347) {
      // Apply heat overlay
      building.material.color.setHex(0xFF6B6B);
      console.log('Heat overlay applied');
    } else {
      // Reset to normal color
      building.material.color.setHex(0x87CEEB);
      console.log('Heat overlay removed');
    }
  }
}

function toggleSunPath() {
  console.log('Toggling sun path...');
  if (!scene) return;
  
  const existingSun = scene.getObjectByName('sunPath');
  if (existingSun) {
    scene.remove(existingSun);
    console.log('Sun path removed');
  } else {
    const sunGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFD700,
      emissive: 0xFFAA00,
      emissiveIntensity: 0.3
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.name = 'sunPath';
    sun.position.set(12, 8, 8);
    scene.add(sun);

    // Add sun path animation
    sun.userData.animate = function() {
      const time = Date.now() * 0.0005;
      sun.position.x = 12 * Math.cos(time);
      sun.position.z = 12 * Math.sin(time);
      sun.position.y = 8 + 3 * Math.sin(time * 0.5);
    };
    
    console.log('Sun path added');
  }
}

function renderRecommendations() {
  const tbody = document.getElementById('recommendationBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  // Filter recommendations based on qualitative data if available
  let recommendationsToShow = demoData.recommendations;
  
  if (qualitativeData) {
    // Prioritize recommendations based on climate stressor
    if (qualitativeData.climateStressor === 'extreme_heat') {
      recommendationsToShow = demoData.recommendations.filter(rec => 
        rec.category === 'Cooling' || rec.category === 'Solar Protection' || rec.category === 'Building Envelope'
      );
    } else if (qualitativeData.climateStressor === 'flooding') {
      recommendationsToShow = demoData.recommendations.filter(rec => 
        rec.category === 'Backup Systems' || rec.title.toLowerCase().includes('drainage')
      );
    }
  }
  
  recommendationsToShow.forEach(rec => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <strong>${rec.title}</strong><br>
        <small style="color: var(--color-text-secondary);">${rec.description}</small>
      </td>
      <td>${rec.implementationCost}</td>
      <td>${rec.estimatedSavings}<br><small>${rec.paybackPeriod}</small></td>
    `;
    tbody.appendChild(row);
  });
  
  console.log('Enhanced recommendations rendered');
}

function determineLocation(lat, lon) {
  // Simple location determination based on coordinates
  if (lat > 28 && lat < 29 && lon > 77 && lon < 78) {
    return 'newDelhi';
  } else if (lat > 18 && lat < 20 && lon > 72 && lon < 73) {
    return 'mumbai';
  }
  return 'newDelhi'; // Default
}

// Handle window resize for 3D viewer
window.addEventListener('resize', () => {
  if (camera && renderer) {
    const container = document.getElementById('threejs-container');
    if (container && container.clientWidth > 0) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  }
});

// Enhanced export for potential external use
window.CHIP = {
  showSection,
  loadDemoBuilding: (index) => loadDemoBuilding(demoData.demoBuildings[index]),
  getCurrentBuilding: () => currentBuilding,
  getQualitativeData: () => qualitativeData,
  getUploadedPhotos: () => uploadedPhotos,
  demoData,
  // Debug functions
  debugNav: () => {
    console.log('Available sections:', document.querySelectorAll('.section'));
    console.log('Current building:', currentBuilding);
    console.log('Qualitative data:', qualitativeData);
    console.log('Uploaded photos:', Object.keys(uploadedPhotos));
  }
};

// Make previewImage globally available for HTML onclick handlers
window.previewImage = previewImage;

console.log('CHIP Enhanced application loaded successfully');
