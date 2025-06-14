
// Particle Sphere Animation
// A standalone JavaScript implementation

// Global variables for sphere configuration
let sphereRadius = 280;
let radiusSp = 1;

// Function to initialize and start the animation
function initParticleSphere(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !canvas.getContext) {
    console.error('Canvas not supported or element not found');
    return;
  }
  
  const context = canvas.getContext('2d');
  
  // Set canvas dimensions
  const resizeCanvas = () => {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    // Set actual canvas size to match display size
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particle system variables
  let timer;
  let wait = 1;
  let count = wait - 1;
  let numToAddEachFrame = 8;
  let particleList = { first: null };
  let recycleBin = { first: null };
  
  // Display variables
  let displayWidth = canvas.width;
  let displayHeight = canvas.height;
  let fLen = 320; // distance from viewer to z=0 depth
  let projCenterX = displayWidth / 2;
  let projCenterY = displayHeight / 2;
  
  // Particle appearance
  const r = 0;
  const g = 72;
  const b = 255;
  const rgbString = `rgba(${r},${g},${b},`;
  const particleAlpha = 1;
  const particleRad = 1.8;
  
  // Sphere properties
  const sphereCenterX = 0;
  const sphereCenterY = 0;
  const sphereCenterZ = -3 - sphereRadius;
  
  // Motion and depth variables
  const zMax = fLen - 2;
  const zeroAlphaDepth = -750;
  const randAccelX = 0.1;
  const randAccelY = 0.1;
  const randAccelZ = 0.1;
  const gravity = 0;
  let turnSpeed = 2 * Math.PI / 1200;
  let turnAngle = 0;
  
  // Function to add a particle
  const addParticle = (x0, y0, z0, vx0, vy0, vz0) => {
    let newParticle = {};
    
    // Check recycle bin for available particle
    if (recycleBin.first !== null) {
      newParticle = recycleBin.first;
      // Remove from bin
      if (newParticle.next !== null) {
        recycleBin.first = newParticle.next;
        newParticle.next.prev = null;
      } else {
        recycleBin.first = null;
      }
    }
    
    // Add to beginning of particle list
    if (particleList.first === null) {
      particleList.first = newParticle;
      newParticle.prev = null;
      newParticle.next = null;
    } else {
      newParticle.next = particleList.first;
      particleList.first.prev = newParticle;
      particleList.first = newParticle;
      newParticle.prev = null;
    }
    
    // Initialize
    newParticle.x = x0;
    newParticle.y = y0;
    newParticle.z = z0;
    newParticle.velX = vx0;
    newParticle.velY = vy0;
    newParticle.velZ = vz0;
    newParticle.age = 0;
    newParticle.dead = false;
    newParticle.right = Math.random() < 0.5;
    
    return newParticle;
  };
  
  // Function to recycle a particle
  const recycle = (p) => {
    // Remove from particleList
    if (particleList.first === p) {
      if (p.next !== null) {
        p.next.prev = null;
        particleList.first = p.next;
      } else {
        particleList.first = null;
      }
    } else {
      if (p.next === null) {
        p.prev.next = null;
      } else {
        p.prev.next = p.next;
        p.next.prev = p.prev;
      }
    }
    
    // Add to recycle bin
    if (recycleBin.first === null) {
      recycleBin.first = p;
      p.prev = null;
      p.next = null;
    } else {
      p.next = recycleBin.first;
      recycleBin.first.prev = p;
      recycleBin.first = p;
      p.prev = null;
    }
  };
  
  // Animation update function
  const onTimer = () => {
    // Add new particles if enough time has elapsed
    count++;
    if (count >= wait) {
      count = 0;
      for (let i = 0; i < numToAddEachFrame; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(Math.random() * 2 - 1);
        const x0 = sphereRadius * Math.sin(phi) * Math.cos(theta);
        const y0 = sphereRadius * Math.sin(phi) * Math.sin(theta);
        const z0 = sphereRadius * Math.cos(phi);
        
        // Add new particle
        const p = addParticle(
          x0, 
          sphereCenterY + y0, 
          sphereCenterZ + z0, 
          0.002 * x0, 
          0.002 * y0, 
          0.002 * z0
        );
        
        // Set particle parameters
        p.attack = 50;
        p.hold = 50;
        p.decay = 100;
        p.initValue = 0;
        p.holdValue = particleAlpha;
        p.lastValue = 0;
        p.stuckTime = 90 + Math.random() * 20;
        p.accelX = 0;
        p.accelY = gravity;
        p.accelZ = 0;
      }
    }
    
    // Update viewing angle
    turnAngle = (turnAngle + turnSpeed) % (2 * Math.PI);
    const sinAngle = Math.sin(turnAngle);
    const cosAngle = Math.cos(turnAngle);
    
    // Clear canvas
    context.fillStyle = "#000000";
    context.fillRect(0, 0, displayWidth, displayHeight);
    
    // Update and draw particles
    let p = particleList.first;
    while (p !== null) {
      // Before list is altered, record next particle
      const nextParticle = p.next;
      
      // Update age
      p.age++;
      
      // If the particle is past its "stuck" time, it will begin to move.
      if (p.age > p.stuckTime) {
        p.velX += p.accelX + randAccelX * (Math.random() * 2 - 1);
        p.velY += p.accelY + randAccelY * (Math.random() * 2 - 1);
        p.velZ += p.accelZ + randAccelZ * (Math.random() * 2 - 1);
        
        p.x += p.velX;
        p.y += p.velY;
        p.z += p.velZ;
      }
      
      // Calculate display coordinates (with rotation)
      const rotX = cosAngle * p.x + sinAngle * (p.z - sphereCenterZ);
      const rotZ = -sinAngle * p.x + cosAngle * (p.z - sphereCenterZ) + sphereCenterZ;
      const m = radiusSp * fLen / (fLen - rotZ);
      p.projX = rotX * m + projCenterX;
      p.projY = p.y * m + projCenterY;
      
      // Update alpha according to envelope parameters
      if (p.age < p.attack + p.hold + p.decay) {
        if (p.age < p.attack) {
          p.alpha = (p.holdValue - p.initValue) / p.attack * p.age + p.initValue;
        }
        else if (p.age < p.attack + p.hold) {
          p.alpha = p.holdValue;
        }
        else if (p.age < p.attack + p.hold + p.decay) {
          p.alpha = (p.lastValue - p.holdValue) / p.decay * (p.age - p.attack - p.hold) + p.holdValue;
        }
      }
      else {
        p.dead = true;
      }
      
      // Check if particle is still within viewable range
      const outsideTest = 
        p.projX > displayWidth || 
        p.projX < 0 || 
        p.projY < 0 || 
        p.projY > displayHeight || 
        rotZ > zMax;
      
      if (outsideTest || p.dead) {
        recycle(p);
      }
      else {
        // Depth-dependent darkening
        let depthAlphaFactor = (1 - rotZ / zeroAlphaDepth);
        depthAlphaFactor = depthAlphaFactor > 1 ? 1 : (depthAlphaFactor < 0 ? 0 : depthAlphaFactor);
        
        // Draw
        context.fillStyle = rgbString + depthAlphaFactor * p.alpha + ")";
        context.beginPath();
        context.arc(p.projX, p.projY, m * particleRad, 0, 2 * Math.PI, false);
        context.closePath();
        context.fill();
      }
      
      p = nextParticle;
    }
  };
  
  // Start animation
  timer = setInterval(onTimer, 10 / 24);
  
  // Return control functions
  return {
    updateSphereRadius: function(newRadius) {
      sphereRadius = newRadius;
    },
    updateParticleScale: function(newScale) {
      radiusSp = newScale;
    },
    stop: function() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      window.removeEventListener('resize', resizeCanvas);
    }
  };
}

// Usage:
// 1. Include this script in your HTML
// 2. Create a canvas element with an ID, e.g., <canvas id="particleCanvas"></canvas>
// 3. Call: const particleSphere = initParticleSphere('particleCanvas');
// 4. Control with: particleSphere.updateSphereRadius(300);
//                  particleSphere.updateParticleScale(1.5);