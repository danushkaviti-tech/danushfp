// Main Application Coordinator
import { ThreeScene } from './threeScene.js';
import { audio } from './audio.js';
import { setupDemos } from './demos.js';
import { setupTerminal } from './terminal.js';
import { ICONS } from './icons.js';
import confetti from 'canvas-confetti';

// Technical Skills Database from Danush's Resume with Authentic Vector Brand Icons
const SKILLS_DATA = [
  // AI & GenAI
  { name: 'RAG Architecture', cat: 'ai', cats: ['ai', 'architecture'], iconKey: 'rag', level: 70, notes: 'Vector DB routing, metadata retrieval, citation grounding' },
  { name: 'LangGraph', cat: 'ai', cats: ['ai', 'frameworks', 'architecture'], iconKey: 'langgraph', level: 68, notes: 'Multi-agent state machines, cyclical graphs, human-in-the-loop & tool routing' },
  { name: 'ChromaDB', cat: 'ai', cats: ['ai', 'devops', 'architecture'], iconKey: 'chromadb', level: 68, notes: 'Vector database, high-dimensional similarity search, embeddings store & metadata filtering' },
  { name: 'MCP (Model Context Protocol)', cat: 'ai', cats: ['ai', 'architecture'], iconKey: 'mcp', level: 66, notes: 'Standardized LLM tool integration, custom MCP servers & multi-agent routing' },
  { name: 'LLMs & Prompt Eng.', cat: 'ai', cats: ['ai'], iconKey: 'llm_workflow', level: 67, notes: 'System prompt design, few-shot prompting, output parsing' },
  { name: 'LangChain', cat: 'ai', cats: ['ai', 'frameworks'], iconKey: 'langchain', level: 69, notes: 'Chains, agents, document loaders, custom retrievers' },
  { name: 'Face Embeddings', cat: 'ai', cats: ['ai'], iconKey: 'faceEmbedding', level: 65, notes: '512-D tensor representations, Cosine distance matching' },
  { name: 'Vector Databases', cat: 'ai', cats: ['ai'], iconKey: 'vectordb', level: 66, notes: 'ChromaDB, FAISS, Pinecone index optimization' },
  { name: 'Hugging Face API', cat: 'ai', cats: ['ai'], iconKey: 'huggingface', level: 65, notes: 'Inference endpoints, diffusion models, embeddings' },

  // Architecture & System Infrastructure
  { name: 'System Architecture', cat: 'architecture', cats: ['architecture', 'devops'], iconKey: 'sysArch', level: 68, notes: 'Microservices, event-driven pipelines, API gateways, fault tolerance & distributed systems' },

  // Languages
  { name: 'Python', cat: 'languages', cats: ['languages'], iconKey: 'python', level: 70, notes: 'DSA, Backend APIs, AI pipelines, data structures' },
  { name: 'TypeScript', cat: 'languages', cats: ['languages'], iconKey: 'typescript', level: 67, notes: 'Type safety, generics, interfaces, scalable full-stack codebases & node runtimes' },
  { name: 'JavaScript (ES6+)', cat: 'languages', cats: ['languages'], iconKey: 'javascript', level: 68, notes: 'Modern asynchronous workflows, WebGL, DOM' },
  { name: 'Java', cat: 'languages', cats: ['languages'], iconKey: 'java', level: 64, notes: 'OOP, Multithreading, robust backend architecture' },
  { name: 'C', cat: 'languages', cats: ['languages'], iconKey: 'c', level: 62, notes: 'Memory management, foundational algorithmic efficiency' },
  { name: 'SQL', cat: 'languages', cats: ['languages', 'devops'], iconKey: 'sql', level: 66, notes: 'Relational queries, indexing, schema design' },
  { name: 'HTML5 & CSS3', cat: 'languages', cats: ['languages'], iconKey: 'html5', level: 70, notes: 'Responsive layouts, 3D CSS, modern animations' },

  // Frameworks & Protocols
  { name: 'React.js', cat: 'frameworks', cats: ['frameworks'], iconKey: 'react', level: 68, notes: 'Hooks, state management, component architecture' },
  { name: 'Node.js & Express', cat: 'frameworks', cats: ['frameworks'], iconKey: 'nodejs', level: 67, notes: 'High-throughput RESTful APIs, JWT authentication' },
  { name: 'WebSockets', cat: 'frameworks', cats: ['frameworks', 'architecture'], iconKey: 'websockets', level: 65, notes: 'Full-duplex real-time communication, bi-directional event streaming & low latency' },
  { name: 'Bootstrap', cat: 'frameworks', cats: ['frameworks'], iconKey: 'bootstrap', level: 64, notes: 'Responsive UI grid systems, fluid components' },

  // Databases & DevOps / Cloud
  { name: 'Redis', cat: 'devops', cats: ['devops', 'architecture'], iconKey: 'redis', level: 66, notes: 'In-memory caching, Pub/Sub message broker, session stores & high-throughput memory buffers' },
  { name: 'MongoDB', cat: 'devops', cats: ['devops'], iconKey: 'mongodb', level: 65, notes: 'NoSQL collections, aggregation pipelines' },
  { name: 'Git & GitHub', cat: 'devops', cats: ['devops'], iconKey: 'git', level: 70, notes: 'Branching strategies, CI workflows, open-source' },
  { name: 'AWS & Cloud', cat: 'devops', cats: ['devops', 'architecture'], iconKey: 'aws_basics', level: 62, notes: 'S3, EC2 instances, serverless deployment basics' },
  { name: 'Docker (Basics)', cat: 'devops', cats: ['devops'], iconKey: 'docker', level: 63, notes: 'Containerization, Dockerfile creation, compose' },
  { name: 'Postman', cat: 'devops', cats: ['devops'], iconKey: 'postman', level: 68, notes: 'API testing suites, environment variables, mock servers' },
  { name: 'CI / CD', cat: 'devops', cats: ['devops'], iconKey: 'cicd', level: 61, notes: 'Automated testing and deployment pipelines' }
];

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Scene
  let threeScene = null;
  try {
    threeScene = new ThreeScene('webgl-canvas-container');
  } catch (err) {
    console.error('Failed to initialize Three.js:', err);
  }

  // 2. Inject Authentic Brand Vector Logos
  injectOfficialLogos();

  // 3. Initialize Custom Cyber Cursor
  setupCyberCursor();

  // 4. Setup Audio Toggle (Enabled by default)
  const audioBtn = document.getElementById('audio-toggle');
  const audioText = document.getElementById('audio-status-text');
  const drawerAudioBtn = document.getElementById('drawer-audio-btn');
  const drawerAudioStatus = document.getElementById('drawer-audio-status');

  function updateAudioUI() {
    if (audio.enabled) {
      audioBtn?.classList.add('active');
      drawerAudioBtn?.classList.add('active');
      if (audioText) audioText.textContent = 'FX ON';
      if (drawerAudioStatus) drawerAudioStatus.textContent = 'Audio FX: ON';
    } else {
      audioBtn?.classList.remove('active');
      drawerAudioBtn?.classList.remove('active');
      if (audioText) audioText.textContent = 'MUTED';
      if (drawerAudioStatus) drawerAudioStatus.textContent = 'Audio FX: MUTED';
    }
  }

  updateAudioUI();

  function toggleAudioSystem(e) {
    e?.stopPropagation();
    audio.toggle();
    updateAudioUI();
    if (audio.enabled) {
      showToast('Futuristic Web Audio Enabled 🔊');
    } else {
      showToast('Audio FX Muted 🔇');
    }
  }

  audioBtn?.addEventListener('click', toggleAudioSystem);
  drawerAudioBtn?.addEventListener('click', toggleAudioSystem);

  // Sound hover triggers on interactive elements
  const soundTargets = document.querySelectorAll('button, a, .contact-card-item, .achieve-card, .palette-dot-btn, .skill-tab-btn, .mobile-palette-btn, .mobile-nav-link');
  soundTargets.forEach(el => {
    el.addEventListener('mouseenter', () => audio.playHover());
  });

  // 5. Setup 5 Curated Holographic Accent Color Palettes
  const PALETTES = {
    green: {
      name: 'Cyber Emerald (Default) 🟢',
      three: { primary: 0x00f5a0, secondary: 0x10b981, accent: 0x00f2fe, coreEmissive: 0x00f5a0, ring: 0x00f2fe }
    },
    purple: {
      name: 'Cosmic Violet 🌌',
      three: { primary: 0xc084fc, secondary: 0xa855f7, accent: 0xf43f5e, coreEmissive: 0xc084fc, ring: 0xf43f5e }
    },
    cyan: {
      name: 'Electric Cyan ⚡',
      three: { primary: 0x00f2fe, secondary: 0x38bdf8, accent: 0xa855f7, coreEmissive: 0x00f2fe, ring: 0x00f5a0 }
    },
    gold: {
      name: 'Solar Amber ☀️',
      three: { primary: 0xfbbf24, secondary: 0xf59e0b, accent: 0xff6b6b, coreEmissive: 0xfbbf24, ring: 0xf59e0b }
    },
    crimson: {
      name: 'Hyper Crimson 🔥',
      three: { primary: 0xff3366, secondary: 0xf43f5e, accent: 0xa855f7, coreEmissive: 0xff3366, ring: 0xff3366 }
    }
  };

  const paletteKeys = ['green', 'purple', 'cyan', 'gold', 'crimson'];
  let currentPaletteIdx = 0;

  function applyPalette(themeKey, notify = true) {
    const pal = PALETTES[themeKey] || PALETTES.green;
    currentPaletteIdx = paletteKeys.indexOf(themeKey);
    if (currentPaletteIdx === -1) currentPaletteIdx = 0;

    if (themeKey === 'green') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', themeKey);
    }
    threeScene?.setTheme(pal.three);

    // Update active state across desktop dots and mobile drawer buttons
    document.querySelectorAll('.palette-dot-btn, .mobile-palette-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.palette === themeKey);
    });

    if (notify) {
      showToast(`Palette: ${pal.name}`);
    }
  }

  // Attach 1-click listener to desktop palette dots & mobile drawer buttons
  document.querySelectorAll('.palette-dot-btn, .mobile-palette-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.playClick();
      const p = btn.dataset.palette;
      if (p) applyPalette(p, true);
    });
  });

  // Attach cycle listener to the theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    audio.playClick();
    currentPaletteIdx = (currentPaletteIdx + 1) % paletteKeys.length;
    applyPalette(paletteKeys[currentPaletteIdx], true);
  });

  // 6. Setup Skills Matrix Tabs & Grid with Animated Percentage Counters & Progress Bars
  const skillsGrid = document.getElementById('skills-grid');
  const skillTabs = document.querySelectorAll('.skill-tab-btn');

  function animateSkillCards() {
    if (!skillsGrid) return;
    const cards = skillsGrid.querySelectorAll('.skill-item-card');

    cards.forEach((card, idx) => {
      const pctEl = card.querySelector('.skill-level-pct');
      const fillEl = card.querySelector('.skill-fill');
      const targetPct = parseInt(pctEl?.dataset.target || '0', 10);

      // Reset to 0 initially
      if (fillEl) fillEl.style.width = '0%';
      if (pctEl) pctEl.textContent = '0%';

      // Smooth staggered expansion
      setTimeout(() => {
        // 1. Expand progress bar with CSS transition
        if (fillEl) {
          fillEl.style.width = `${targetPct}%`;
        }

        // 2. Count-up percentage animation with smooth cubic ease-out
        if (pctEl && targetPct > 0) {
          const duration = 1000;
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(targetPct * ease);
            pctEl.textContent = `${current}%`;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              pctEl.textContent = `${targetPct}%`;
            }
          }
          requestAnimationFrame(updateCount);
        }
      }, Math.min(idx * 30, 450));
    });
  }

  function renderSkills(category = 'all', animate = true) {
    if (!skillsGrid) return;
    const filtered = category === 'all' 
      ? SKILLS_DATA 
      : SKILLS_DATA.filter(s => s.cat === category || (Array.isArray(s.cats) && s.cats.includes(category)));

    skillsGrid.innerHTML = filtered.map(skill => {
      const svgIcon = ICONS[skill.iconKey] || ICONS.python;
      return `
        <div class="skill-item-card" data-cat="${skill.cat}">
          <div class="skill-card-top">
            <div class="skill-name-wrap">
              <div class="skill-brand-icon">${svgIcon}</div>
              <span class="skill-title">${skill.name}</span>
            </div>
            <span class="skill-level-pct" data-target="${skill.level}">0%</span>
          </div>
          <div class="skill-progress-bar">
            <div class="skill-fill" data-width="${skill.level}" style="width: 0%"></div>
          </div>
          <p class="skill-notes">${skill.notes}</p>
        </div>
      `;
    }).join('');

    skillsGrid.querySelectorAll('.skill-item-card').forEach(c => {
      c.addEventListener('mouseenter', () => audio.playHover());
    });

    if (animate) {
      requestAnimationFrame(() => {
        animateSkillCards();
      });
    }
  }

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      audio.playTabSwitch();
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderSkills(tab.dataset.category, true);
    });
  });

  // Render all skills by default as soon as the page loads
  renderSkills('all', false);

  // Animate skill percentages when scrolled into view
  const skillsSection = document.getElementById('skills');
  let skillsAnimatedOnce = false;
  if (skillsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimatedOnce) {
          skillsAnimatedOnce = true;
          animateSkillCards();
        }
      });
    }, { threshold: 0.15 });
    observer.observe(skillsSection);
  } else {
    setTimeout(animateSkillCards, 300);
  }

  // 7. Hyper-Intense Flashlight Beam Expand Transition (Entrance + Link clicks)
  function triggerFlashlightExpand(x, y, callback) {
    audio.playPhotonFlash();

    const overlay = document.createElement('div');
    overlay.className = 'flashlight-overlay';
    overlay.style.setProperty('--fx-x', `${x}px`);
    overlay.style.setProperty('--fx-y', `${y}px`);

    const ring = document.createElement('div');
    ring.className = 'flashlight-lens-ring';
    ring.style.setProperty('--fx-x', `${x}px`);
    ring.style.setProperty('--fx-y', `${y}px`);

    const ionRing = document.createElement('div');
    ionRing.className = 'flashlight-ion-ring';
    ionRing.style.setProperty('--fx-x', `${x}px`);
    ionRing.style.setProperty('--fx-y', `${y}px`);

    const streak = document.createElement('div');
    streak.className = 'flashlight-laser-streak';
    streak.style.setProperty('--fx-y', `${y}px`);

    document.body.appendChild(overlay);
    document.body.appendChild(ring);
    document.body.appendChild(ionRing);
    document.body.appendChild(streak);

    overlay.getBoundingClientRect();

    requestAnimationFrame(() => {
      overlay.classList.add('expanding');
      ring.classList.add('expanding');
      ionRing.classList.add('expanding');
      streak.classList.add('expanding');
    });

    setTimeout(() => {
      if (callback) callback();
      overlay.classList.add('fading');
      ring.classList.add('fading');
      ionRing.classList.add('fading');
      streak.classList.add('fading');
      setTimeout(() => {
        overlay.remove();
        ring.remove();
        ionRing.remove();
        streak.remove();
      }, 420);
    }, 280);
  }

  // Pre-render Standby Portal & First Flash Ignition Sequence
  const portalGate = document.getElementById('portal-gate');
  let portalIgnited = false;

  function ignitePortfolioEntrance(clickX, clickY) {
    if (portalIgnited) return;
    portalIgnited = true;

    const x = (typeof clickX === 'number' && !isNaN(clickX) && clickX > 0) ? clickX : (window.innerWidth / 2);
    const y = (typeof clickY === 'number' && !isNaN(clickY) && clickY > 0) ? clickY : (window.innerHeight * 0.45);

    // 1. Audio Startup: Resume Web Audio and start ambient cosmic drone
    audio.ensureContext();
    if (audio.enabled) {
      audio.startAmbientSoundscape();
      // 2. Play AI Welcome Voice ("Welcome to the Dhanush Portfolio")
      audio.playWelcomeVoice();
    }

    if (audioBtn) {
      audioBtn.classList.toggle('active', audio.enabled);
      if (audioText) audioText.textContent = audio.enabled ? 'FX ON' : 'MUTED';
    }

    // 3. FIRST: Trigger Hyper-Intense Flashlight Expand Effect!
    triggerFlashlightExpand(x, y, () => {
      // 4. Reveal website at the peak of the flashlight beam
      if (portalGate) {
        portalGate.classList.add('igniting');
        setTimeout(() => portalGate.remove(), 450);
      }
      document.body.classList.remove('intro-active');
    });
  }

  if (portalGate) {
    portalGate.addEventListener('click', (e) => {
      ignitePortfolioEntrance(e.clientX, e.clientY);
    });

    const igniteBtn = document.getElementById('btn-ignite-portal');
    igniteBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      ignitePortfolioEntrance(e.clientX, e.clientY);
    });

    window.addEventListener('keydown', (e) => {
      if (document.body.classList.contains('intro-active')) {
        if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          ignitePortfolioEntrance(window.innerWidth / 2, window.innerHeight * 0.45);
        }
      }
    });
  } else {
    document.body.classList.remove('intro-active');
  }

  // Flashlight expand when user clicks on any anchor or navigation link
  document.querySelectorAll('a[href^="#"], .nav-link, .btn-primary-glow, .btn-secondary-glass, .btn-nav-cta, .brand-badge').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || !href.startsWith('#')) return;
      const targetEl = document.querySelector(href);
      if (!targetEl) return;

      e.preventDefault();
      audio.playClick();

      const x = e.clientX || window.innerWidth / 2;
      const y = e.clientY || window.innerHeight / 2;

      triggerFlashlightExpand(x, y, () => {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      });
    });
  });

  // 8. Setup Project Demos
  setupDemos();

  // 9. Setup Cyber Terminal
  setupTerminal();

  // 9. Setup Resume Modal Triggers
  const resumeModal = document.getElementById('resume-modal');
  const closeResumeBtn = document.getElementById('close-resume-modal');
  const navResumeBtn = document.getElementById('nav-resume-btn');
  const heroResumeBtn = document.getElementById('hero-resume-trigger');

  function openResume() {
    audio.playClick();
    resumeModal?.classList.add('active');
  }

  function closeResume() {
    audio.playClick();
    resumeModal?.classList.remove('active');
  }

  navResumeBtn?.addEventListener('click', openResume);
  heroResumeBtn?.addEventListener('click', openResume);
  closeResumeBtn?.addEventListener('click', closeResume);

  // 9c. Setup Cyber Mobile Navigation Drawer
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const drawerResumeBtn = document.getElementById('drawer-resume-btn');

  function openMobileDrawer() {
    audio.playClick();
    mobileNavOverlay?.classList.add('active');
    mobileMenuBtn?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileNavOverlay?.classList.remove('active');
    mobileMenuBtn?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileMenuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileNavOverlay?.classList.contains('active')) {
      closeMobileDrawer();
    } else {
      openMobileDrawer();
    }
  });

  closeMobileMenuBtn?.addEventListener('click', () => {
    audio.playClick();
    closeMobileDrawer();
  });

  mobileNavBackdrop?.addEventListener('click', () => {
    audio.playClick();
    closeMobileDrawer();
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target') || link.getAttribute('href')?.replace('#', '');
      const targetEl = document.getElementById(targetId);
      closeMobileDrawer();
      if (targetEl) {
        audio.playClick();
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        triggerFlashlightExpand(x, y, () => {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        });
      }
    });
  });

  drawerResumeBtn?.addEventListener('click', () => {
    closeMobileDrawer();
    openResume();
  });

  resumeModal?.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileNavOverlay?.classList.contains('active')) {
        closeMobileDrawer();
      }
      if (resumeModal?.classList.contains('active')) {
        closeResume();
      }
    }
  });

  // 9b. Setup Upcoming Breakthrough Features Modal (Personal RAG & AI Navigation System)
  const upcomingModal = document.getElementById('upcoming-features-modal');
  const upcomingBtn = document.getElementById('btn-upcoming-features');
  const closeUpcomingBtn = document.getElementById('close-feature-modal');
  const waitlistBtn = document.getElementById('btn-register-waitlist');

  function openUpcomingFeatures() {
    audio.playClick();
    upcomingModal?.classList.add('active');
    showToast('Previewing Upcoming Innovations: Personal RAG & AI Nav ✨');
  }

  function closeUpcomingFeatures() {
    audio.playClick();
    upcomingModal?.classList.remove('active');
  }

  upcomingBtn?.addEventListener('click', openUpcomingFeatures);
  closeUpcomingBtn?.addEventListener('click', closeUpcomingFeatures);

  upcomingModal?.addEventListener('click', (e) => {
    if (e.target === upcomingModal) closeUpcomingFeatures();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && upcomingModal?.classList.contains('active')) {
      closeUpcomingFeatures();
    }
  });

  waitlistBtn?.addEventListener('click', () => {
    audio.playSuccess();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 }
    });
    showToast('🚀 Registered! You will be notified when Personal RAG & AI Navigation deploy!');
    setTimeout(closeUpcomingFeatures, 1600);
  });

  // 9c. Setup Event Photo Lightbox Modal
  const photoModal = document.getElementById('photo-lightbox-modal');
  const closePhotoModalBtn = document.getElementById('close-lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-modal-img');
  const lightboxTitle = document.getElementById('lightbox-modal-title');
  const lightboxDesc = document.getElementById('lightbox-modal-desc');

  document.querySelectorAll('.lead-photo-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = item.dataset.img || item.querySelector('img')?.src;
      const title = item.dataset.title || 'Event Photograph';
      const desc = item.dataset.desc || '';

      if (lightboxImg && img) lightboxImg.src = img;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;

      audio.playClick();
      photoModal?.classList.add('active');
    });
  });

  function closePhotoLightbox() {
    audio.playClick();
    photoModal?.classList.remove('active');
  }

  closePhotoModalBtn?.addEventListener('click', closePhotoLightbox);
  photoModal?.addEventListener('click', (e) => {
    if (e.target === photoModal) closePhotoLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && photoModal?.classList.contains('active')) {
      closePhotoLightbox();
    }
  });

  // 10. Clipboard Copy Handlers with Toast
  const copyEmail = document.getElementById('copy-email-card');
  const copyPhone = document.getElementById('copy-phone-card');

  copyEmail?.addEventListener('click', () => {
    navigator.clipboard.writeText('danushkaviti@gmail.com');
    audio.playSuccess();
    showToast('Copied to clipboard: danushkaviti@gmail.com ✉️');
  });

  copyPhone?.addEventListener('click', () => {
    navigator.clipboard.writeText('+917794039459');
    audio.playSuccess();
    showToast('Copied to clipboard: +91 7794039459 📱');
  });

  // 11. Achievement Cards Confetti Click
  const achieveCards = document.querySelectorAll('.achieve-card');
  achieveCards.forEach(card => {
    card.addEventListener('click', (e) => {
      audio.playSuccess();
      const rect = card.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 60,
        spread: 80,
        origin: { x, y }
      });
    });
  });

  // 12. Real Email Dispatch System to danushkaviti@gmail.com
  setupRealEmailDispatch();

  // 13. Subtle 3D Card Tilt Effect on Mouse Move
  const tiltCards = document.querySelectorAll('.hologram-card, .project-feature-card, .timeline-box, .terminal-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotX = ((y - midY) / midY) * -3;
      const rotY = ((x - midX) / midX) * 3;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.008, 1.008, 1.008)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // 14. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 180;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-links a[href*='${sectionId}']`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItem?.classList.add('active');
      } else {
        navItem?.classList.remove('active');
      }
    });
  }, { passive: true });
});

// Inject Authentic Official Brand Logos into respective slots
function injectOfficialLogos() {
  const badgeLeetCode = document.getElementById('hero-badge-leetcode');
  const badgeIeee = document.getElementById('hero-badge-ieee');
  if (badgeLeetCode) badgeLeetCode.innerHTML = ICONS.leetcode;
  if (badgeIeee) badgeIeee.innerHTML = ICONS.ieee;

  const sealLeetcode = document.getElementById('seal-leetcode');
  const sealCodechef = document.getElementById('seal-codechef');
  const sealIeee = document.getElementById('seal-ieee');
  if (sealLeetcode) sealLeetcode.innerHTML = ICONS.leetcode;
  if (sealCodechef) sealCodechef.innerHTML = ICONS.codechef;
  if (sealIeee) sealIeee.innerHTML = ICONS.ieee;

  const socLinkedin = document.querySelector('#soc-linkedin .soc-logo-slot');
  const socGithub = document.querySelector('#soc-github .soc-logo-slot');
  const socLeetcode = document.querySelector('#soc-leetcode .soc-logo-slot');
  const socCodechef = document.querySelector('#soc-codechef .soc-logo-slot');
  const socCodeforces = document.querySelector('#soc-codeforces .soc-logo-slot');
  const socHackerrank = document.querySelector('#soc-hackerrank .soc-logo-slot');

  if (socLinkedin) socLinkedin.innerHTML = ICONS.linkedin;
  if (socGithub) socGithub.innerHTML = ICONS.github;
  if (socLeetcode) socLeetcode.innerHTML = ICONS.leetcode;
  if (socCodechef) socCodechef.innerHTML = ICONS.codechef;
  if (socCodeforces) socCodeforces.innerHTML = ICONS.codeforces;
  if (socHackerrank) socHackerrank.innerHTML = ICONS.hackerrank;

  const mailIcon = document.getElementById('contact-icon-mail');
  const phoneIcon = document.getElementById('contact-icon-phone');
  if (mailIcon) mailIcon.innerHTML = ICONS.email;
  if (phoneIcon) phoneIcon.innerHTML = ICONS.phone;

  const eyeIcon = document.getElementById('sim-icon-eye');
  const ragIcon = document.getElementById('sim-icon-rag');
  if (eyeIcon) eyeIcon.innerHTML = ICONS.faceEmbedding;
  if (ragIcon) ragIcon.innerHTML = ICONS.rag;

  // Skills Category Tabs SVGs
  const tabAll = document.getElementById('tab-svg-all');
  const tabAi = document.getElementById('tab-svg-ai');
  const tabArchitecture = document.getElementById('tab-svg-architecture');
  const tabLanguages = document.getElementById('tab-svg-languages');
  const tabFrameworks = document.getElementById('tab-svg-frameworks');
  const tabDevops = document.getElementById('tab-svg-devops');

  if (tabAll) tabAll.innerHTML = ICONS.tabAll;
  if (tabAi) tabAi.innerHTML = ICONS.tabAi;
  if (tabArchitecture) tabArchitecture.innerHTML = ICONS.tabArchitecture;
  if (tabLanguages) tabLanguages.innerHTML = ICONS.tabLanguages;
  if (tabFrameworks) tabFrameworks.innerHTML = ICONS.tabFrameworks;
  if (tabDevops) tabDevops.innerHTML = ICONS.tabDevops;

  // Inject into tech tags
  document.querySelectorAll('.tech-tag[data-icon]').forEach(tag => {
    const key = tag.dataset.icon;
    if (ICONS[key]) {
      const span = document.createElement('span');
      span.className = 'tech-tag-icon';
      span.innerHTML = ICONS[key];
      tag.prepend(span);
    }
  });
}

// Custom Cyber Cursor Follower
function setupCyberCursor() {
  const dot = document.getElementById('cursor-dot');
  const glow = document.getElementById('cursor-glow');
  if (!dot || !glow) return;

  let mouseX = -100, mouseY = -100;
  let glowX = -100, glowY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  function renderCursor() {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);
}

// Real Email Dispatch Integration
function setupRealEmailDispatch() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('btn-submit-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const msgInput = document.getElementById('contact-msg');
  const directMailLink = document.getElementById('direct-mailto-link');

  // Update dynamic mailto link in real-time
  function updateMailto() {
    if (!directMailLink) return;
    const name = encodeURIComponent(nameInput?.value || '');
    const subj = encodeURIComponent(subjectInput?.value || 'Interview / Project Inquiry for Danush');
    const msg = encodeURIComponent((msgInput?.value || '') + (name ? `\n\nFrom: ${decodeURIComponent(name)}` : ''));
    directMailLink.href = `mailto:danushkaviti@gmail.com?subject=${subj}&body=${msg}`;
  }

  [nameInput, emailInput, subjectInput, msgInput].forEach(inp => {
    inp?.addEventListener('input', updateMailto);
  });

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput?.value.trim() || 'New Portfolio Message for Danush';
    const message = msgInput.value.trim();

    if (!name || !email || !message) return;

    audio.playPulse();
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner"></span>
      <span>Transmitting to danushkaviti@gmail.com...</span>
    `;

    try {
      // Dispatches directly to danushkaviti@gmail.com via FormSubmit AJAX endpoint
      const response = await fetch('https://formsubmit.co/ajax/danushkaviti@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `⚡ [Danush Portfolio] ${subject} from ${name}`,
          name: name,
          email: email,
          message: message,
          _captcha: 'false',
          _template: 'table'
        })
      });

      const resData = await response.json();

      if (response.ok || resData.success === 'true' || resData.success === true) {
        audio.playSuccess();
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.65 }
        });
        showToast(`Transmission Delivered! Message sent directly to Danush's inbox 🚀`);
        form.reset();
        updateMailto();
      } else {
        // Fallback open mail client if endpoint blocked
        window.location.href = `mailto:danushkaviti@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
        showToast(`Opening your email client to complete dispatch to Danush ✉️`);
      }
    } catch (err) {
      console.warn('Network error or ad-blocker; falling back to direct email:', err);
      window.location.href = `mailto:danushkaviti@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
      showToast(`Opening your email client to send directly to danushkaviti@gmail.com ✉️`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        <span>Dispatch Message to Danush</span>
      `;
    }
  });
}

// Toast notification helper
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 400);
  }, 3400);
}
