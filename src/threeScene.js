import * as THREE from 'three';

export class ThreeScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.coreGroup = null;
    this.outerIcosa = null;
    this.innerCore = null;
    this.ring1 = null;
    this.ring2 = null;
    this.satellites = [];
    this.particles = null;
    this.skillNodes = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-1000, -1000);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.currentMouse = new THREE.Vector2(0, 0);
    this.clock = new THREE.Clock();
    this.scrollProgress = 0;
    this.targetCameraZ = 18;
    this.targetCameraY = 0;
    this.targetCameraX = 0;
    this.themeColors = {
      primary: 0x00f5a0,
      secondary: 0x10b981,
      accent: 0x00f2fe,
      coreEmissive: 0x00f5a0,
      ring: 0x00f2fe
    };

    this.init();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05070f, 0.025);

    // 2. Camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 18);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0e172a, 2.5);
    this.scene.add(ambientLight);

    this.mouseLight = new THREE.PointLight(this.themeColors.primary, 3, 30);
    this.mouseLight.position.set(0, 0, 8);
    this.scene.add(this.mouseLight);

    const backLight = new THREE.DirectionalLight(this.themeColors.secondary, 2);
    backLight.position.set(-10, 10, -10);
    this.scene.add(backLight);

    const rimLight = new THREE.PointLight(this.themeColors.accent, 4, 25);
    rimLight.position.set(10, -5, 5);
    this.scene.add(rimLight);

    // 5. Build 3D Core & Galaxy
    this.createCoreMesh();
    this.createStarfield();
    this.createOrbitingSatellites();
    this.createSkillConstellation();

    // 6. Event Listeners
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        const y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        this.targetMouse.x = x * 0.4;
        this.targetMouse.y = y * 0.4;
      }
    }, { passive: true });
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });

    // Initial responsive setup
    this.onResize();

    // 7. Start Loop
    this.animate();
  }

  createCoreMesh() {
    this.coreGroup = new THREE.Group();
    this.coreGroup.position.set(3.5, 0.5, 0); // Positioned slightly to the right for hero layout

    // Outer wireframe icosahedron
    const icosaGeo = new THREE.IcosahedronGeometry(3.2, 1);
    const wireMat = new THREE.MeshStandardMaterial({
      color: this.themeColors.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      roughness: 0.2,
      metalness: 0.9
    });
    this.outerIcosa = new THREE.Mesh(icosaGeo, wireMat);
    this.coreGroup.add(this.outerIcosa);

    // Inner glowing faceted crystal core
    const coreGeo = new THREE.OctahedronGeometry(1.8, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x05070f,
      emissive: this.themeColors.coreEmissive,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.8,
      transmission: 0.6,
      ior: 1.5,
      thickness: 1.2,
      wireframe: false
    });
    this.innerCore = new THREE.Mesh(coreGeo, coreMat);
    this.coreGroup.add(this.innerCore);

    // Core point light
    this.coreLight = new THREE.PointLight(this.themeColors.primary, 3, 15);
    this.coreGroup.add(this.coreLight);

    // Orbiting Ring 1 (Equatorial / Tilted)
    const ring1Geo = new THREE.TorusGeometry(4.2, 0.04, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: this.themeColors.primary,
      transparent: true,
      opacity: 0.7
    });
    this.ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    this.ring1.rotation.x = Math.PI / 3;
    this.ring1.rotation.y = Math.PI / 6;
    this.coreGroup.add(this.ring1);

    // Orbiting Ring 2 (Polar / Cross angle)
    const ring2Geo = new THREE.TorusGeometry(4.8, 0.03, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: this.themeColors.ring,
      transparent: true,
      opacity: 0.5
    });
    this.ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    this.ring2.rotation.x = -Math.PI / 4;
    this.ring2.rotation.z = Math.PI / 5;
    this.coreGroup.add(this.ring2);

    this.scene.add(this.coreGroup);
  }

  createOrbitingSatellites() {
    const count = 6;
    const geo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: this.themeColors.secondary,
      emissiveIntensity: 1.5,
      metalness: 0.9,
      roughness: 0.1
    });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / count) * Math.PI * 2;
      const radius = 4.2 + (i % 2 === 0 ? 0.6 : -0.4);
      mesh.userData = {
        angle: angle,
        speed: 0.4 + (i * 0.08),
        radius: radius,
        tilt: (i * Math.PI) / 3
      };
      this.coreGroup.add(mesh);
      this.satellites.push(mesh);
    }
  }

  createStarfield() {
    const particleCount = 2200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x00f2fe), // cyan
      new THREE.Color(0x4facfe), // electric blue
      new THREE.Color(0xa855f7), // purple
      new THREE.Color(0xffffff), // starlight
      new THREE.Color(0x00f5a0)  // emerald
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Spread across a cylinder-sphere field around camera
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 12 + Math.random() * 45;

      positions[i3] = dist * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = dist * Math.cos(phi) - 5;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle shader/point material with soft circle glow texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(200,240,255,0.8)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.35,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createSkillConstellation() {
    this.skillsGroup = new THREE.Group();
    this.skillsGroup.position.set(-2, -18, -4); // Positioned in 3D space corresponding to Skills section

    const skills = [
      { name: 'Python', color: 0x38bdf8, size: 0.55, pos: [-4, 3, 0] },
      { name: 'GenAI & RAG', color: 0x00f5a0, size: 0.65, pos: [0, 4, 1] },
      { name: 'React.js', color: 0x61dafb, size: 0.5, pos: [4, 3, -1] },
      { name: 'LangChain & LangGraph', color: 0x10b981, size: 0.58, pos: [-3, 0, 2] },
      { name: 'Node.js', color: 0x22c55e, size: 0.5, pos: [2, 0, 1] },
      { name: 'System Architecture', color: 0x06b6d4, size: 0.62, pos: [1, -2, -2] },
      { name: 'Face Embeddings', color: 0xa855f7, size: 0.55, pos: [5, -2, 0] },
      { name: 'Vector DBs', color: 0xf43f5e, size: 0.5, pos: [-5, -2, 1] },
      { name: 'Redis Cache', color: 0xdc2626, size: 0.52, pos: [-2, -4, 2] },
      { name: 'Docker & AWS', color: 0x0ea5e9, size: 0.45, pos: [-1, -3, -1] },
      { name: 'LeetCode Knight', color: 0xf59e0b, size: 0.65, pos: [0, -1, 3] },
      { name: 'MongoDB & SQL', color: 0x14b8a6, size: 0.5, pos: [3, -4, 0] }
    ];

    const sphereGeo = new THREE.IcosahedronGeometry(1, 2);

    skills.forEach((item, idx) => {
      const mat = new THREE.MeshStandardMaterial({
        color: item.color,
        emissive: item.color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8
      });
      const node = new THREE.Mesh(sphereGeo, mat);
      node.scale.setScalar(item.size);
      node.position.set(item.pos[0], item.pos[1], item.pos[2]);
      node.userData = {
        name: item.name,
        basePos: [...item.pos],
        baseScale: item.size,
        hovered: false,
        pulseSpeed: 1.5 + idx * 0.2
      };

      // Add a subtle wireframe shell around each skill node
      const wireMat = new THREE.MeshBasicMaterial({
        color: item.color,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      const shell = new THREE.Mesh(sphereGeo, wireMat);
      shell.scale.setScalar(1.35);
      node.add(shell);

      this.skillsGroup.add(node);
      this.skillNodes.push(node);
    });

    // Create glowing neural lines connecting the skill nodes
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4facfe,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });

    const linePoints = [];
    for (let i = 0; i < skills.length; i++) {
      for (let j = i + 1; j < skills.length; j++) {
        const d = new THREE.Vector3(...skills[i].pos).distanceTo(new THREE.Vector3(...skills[j].pos));
        if (d < 5.8) {
          linePoints.push(new THREE.Vector3(...skills[i].pos));
          linePoints.push(new THREE.Vector3(...skills[j].pos));
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    this.skillLines = new THREE.LineSegments(lineGeo, lineMat);
    this.skillsGroup.add(this.skillLines);

    this.scene.add(this.skillsGroup);
  }

  onMouseMove(e) {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;

    this.targetMouse.x = x;
    this.targetMouse.y = y;

    // Update raycaster mouse
    this.mouse.x = x;
    this.mouse.y = y;
  }

  onScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Responsive position of core
    if (width < 768) {
      if (this.coreGroup) {
        this.coreGroup.position.set(0, 1.2, -2);
        this.coreGroup.scale.setScalar(0.7);
      }
    } else {
      if (this.coreGroup) {
        this.coreGroup.position.set(3.5, 0.5, 0);
        this.coreGroup.scale.setScalar(1);
      }
    }
  }

  setTheme(palette) {
    if (!palette) return;
    this.themeColors = { ...this.themeColors, ...palette };

    if (this.outerIcosa && palette.primary) {
      this.outerIcosa.material.color.setHex(palette.primary);
    }
    if (this.innerCore) {
      this.innerCore.material.emissive.setHex(palette.coreEmissive || palette.primary);
    }
    if (this.ring1 && palette.primary) {
      this.ring1.material.color.setHex(palette.primary);
    }
    if (this.ring2) {
      this.ring2.material.color.setHex(palette.ring || palette.secondary || palette.primary);
    }
    if (this.mouseLight && palette.accent) {
      this.mouseLight.color.setHex(palette.accent);
    }
    if (this.coreLight && palette.primary) {
      this.coreLight.color.setHex(palette.primary);
    }
    if (this.particles && palette.primary) {
      this.particles.material.color.setHex(palette.primary);
    }
    if (this.satellites && palette.secondary) {
      this.satellites.forEach(s => s.material.color.setHex(palette.secondary));
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth mouse lerping
    this.currentMouse.x += (this.targetMouse.x - this.currentMouse.x) * 0.05;
    this.currentMouse.y += (this.targetMouse.y - this.currentMouse.y) * 0.05;

    // Mouse Light Follower
    if (this.mouseLight) {
      this.mouseLight.position.x = this.currentMouse.x * 12;
      this.mouseLight.position.y = this.currentMouse.y * 8;
    }

    // Dynamic Camera Tracking based on scroll & mouse
    const scrollOffset = this.scrollProgress * 25;
    this.camera.position.x = this.currentMouse.x * 1.5;
    this.camera.position.y = -scrollOffset + this.currentMouse.y * 0.8;
    this.camera.lookAt(0, -scrollOffset, 0);

    // Animate Core Elements
    if (this.coreGroup) {
      // Rotation
      this.outerIcosa.rotation.x = elapsedTime * 0.25;
      this.outerIcosa.rotation.y = elapsedTime * 0.35;

      this.innerCore.rotation.x = -elapsedTime * 0.45;
      this.innerCore.rotation.z = elapsedTime * 0.3;

      // Pulse emission
      const pulse = Math.sin(elapsedTime * 2.5) * 0.3 + 0.8;
      this.innerCore.material.emissiveIntensity = pulse;
      this.coreLight.intensity = pulse * 2.5;

      // Rings
      this.ring1.rotation.z = elapsedTime * 0.4;
      this.ring2.rotation.y = -elapsedTime * 0.35;

      // Satellites
      this.satellites.forEach(sat => {
        const u = sat.userData;
        const curAngle = u.angle + elapsedTime * u.speed;
        sat.position.x = Math.cos(curAngle) * u.radius;
        sat.position.y = Math.sin(curAngle) * u.radius * Math.sin(u.tilt);
        sat.position.z = Math.sin(curAngle) * u.radius * Math.cos(u.tilt);
        sat.rotation.x += 0.04;
        sat.rotation.y += 0.03;
      });

      // Floating gentle bobbing
      this.coreGroup.position.y = 0.5 + Math.sin(elapsedTime * 1.2) * 0.25;
    }

    // Animate Starfield
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.03;
      this.particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;
    }

    // Animate Skills Constellation
    if (this.skillsGroup) {
      this.skillsGroup.rotation.y = Math.sin(elapsedTime * 0.25) * 0.15;

      this.skillNodes.forEach(node => {
        const u = node.userData;
        // Float oscillation
        node.position.y = u.basePos[1] + Math.sin(elapsedTime * u.pulseSpeed) * 0.2;
        node.position.x = u.basePos[0] + Math.cos(elapsedTime * (u.pulseSpeed * 0.8)) * 0.15;
        node.rotation.y += 0.015;
      });
    }

    // Raycast interaction with skill nodes
    if (this.camera && this.skillNodes.length > 0) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.skillNodes);

      this.skillNodes.forEach(n => {
        if (!n.userData.hovered) {
          n.scale.lerp(new THREE.Vector3(n.userData.baseScale, n.userData.baseScale, n.userData.baseScale), 0.1);
          n.material.emissiveIntensity = 0.6;
        }
      });

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        hit.scale.lerp(new THREE.Vector3(hit.userData.baseScale * 1.6, hit.userData.baseScale * 1.6, hit.userData.baseScale * 1.6), 0.2);
        hit.material.emissiveIntensity = 2.0;
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
