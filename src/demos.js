// High-Fidelity Interactive Project Simulation Engines for Danush's AI Projects
import { audio } from './audio.js';

export function setupDemos() {
  setupFaceMatcherDemo();
  setupRAGDemo();
}

function setupFaceMatcherDemo() {
  const runBtn = document.getElementById('run-face-match');
  const promptInput = document.getElementById('face-prompt-input');
  const resultsContainer = document.getElementById('face-match-results');
  const pipelineSteps = document.getElementById('face-pipeline-steps');
  const presetChips = document.querySelectorAll('.face-preset-chip');

  if (!runBtn || !promptInput || !resultsContainer) return;

  function executeMatch(text) {
    audio.playScan();
    runBtn.disabled = true;
    runBtn.innerHTML = `
      <span class="spinner"></span>
      <span>Generating Latent 512-D Tensor...</span>
    `;

    pipelineSteps.innerHTML = `
      <div class="pipeline-step">
        <span class="step-num">01</span>
        <div class="step-info">
          <h6>Hugging Face Inference</h6>
          <p>Synthesizing latent facial feature representation from text description</p>
        </div>
      </div>
    `;

    setTimeout(() => {
      audio.playHover();
      pipelineSteps.innerHTML += `
        <div class="pipeline-step">
          <span class="step-num">02</span>
          <div class="step-info">
            <h6>512-Dimensional Tensor Embedding</h6>
            <p>Cosine normalized vector: [${(Math.random() * 0.9).toFixed(4)}, -${(Math.random() * 0.8).toFixed(4)}, ${(Math.random() * 0.95).toFixed(4)}, ... +509 dimensions]</p>
          </div>
        </div>
      `;
    }, 250);

    setTimeout(() => {
      audio.playHover();
      pipelineSteps.innerHTML += `
        <div class="pipeline-step">
          <span class="step-num">03</span>
          <div class="step-info">
            <h6>Cosine Similarity Distance Top-K Ranking</h6>
            <p>Executing high-dimensional dot product across 4,820 indexed police suspect records.</p>
          </div>
        </div>
      `;
    }, 500);

    setTimeout(() => {
      runBtn.disabled = false;
      runBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        <span>Run Forensic Match</span>
      `;
      audio.playSuccess();

      // High-Fidelity Biometric Wireframe HUD SVGs
      const suspects = [
        {
          id: 'SUSPECT-CR-849',
          score: 96.4,
          confidence: 'PRIMARY MATCH',
          statusClass: 'status-danger',
          gender: 'Male',
          age: '28-32',
          features: ['Defined Angular Jawline', 'Dark Wavy Hair', 'Prominent Brow Ridge', 'Euclidean Dist: 0.036'],
          sketchSvg: `
            <svg viewBox="0 0 120 120" class="biometric-hud-svg">
              <!-- Corner Reticle -->
              <path d="M5 25 V5 H25 M95 5 H115 V25 M115 95 V115 H95 M25 115 H5 V95" stroke="#00f2fe" stroke-width="1.5" fill="none" opacity="0.6"/>
              <!-- Head Contour Wireframe -->
              <polygon points="60,18 88,32 94,62 82,98 60,108 38,98 26,62 32,32" fill="rgba(0, 242, 254, 0.06)" stroke="#00f2fe" stroke-width="1.8"/>
              <!-- Triangulation Lines -->
              <line x1="60" y1="18" x2="60" y2="108" stroke="#00f2fe" stroke-width="0.8" stroke-dasharray="2 2" opacity="0.5"/>
              <line x1="32" y1="52" x2="88" y2="52" stroke="#00f2fe" stroke-width="0.8" opacity="0.5"/>
              <!-- Eye Landmarks -->
              <circle cx="46" cy="52" r="4" fill="#00f2fe"/>
              <circle cx="74" cy="52" r="4" fill="#00f2fe"/>
              <path d="M40 48 Q 46 44 52 48" stroke="#00f2fe" stroke-width="1.5" fill="none"/>
              <path d="M68 48 Q 74 44 80 48" stroke="#00f2fe" stroke-width="1.5" fill="none"/>
              <!-- Nose Landmark -->
              <polygon points="60,54 55,72 65,72" stroke="#00f2fe" stroke-width="1.2" fill="none"/>
              <!-- Mouth Landmark -->
              <line x1="48" y1="84" x2="72" y2="84" stroke="#00f2fe" stroke-width="2"/>
              <line x1="52" y1="88" x2="68" y2="88" stroke="#00f2fe" stroke-width="1.2"/>
              <!-- Scanner Bar -->
              <line x1="20" y1="60" x2="100" y2="60" stroke="#ff0055" stroke-width="1" opacity="0.8"/>
            </svg>
          `
        },
        {
          id: 'SUSPECT-CR-219',
          score: 89.2,
          confidence: 'HIGH PROBABILITY',
          statusClass: 'status-warning',
          gender: 'Male',
          age: '26-30',
          features: ['Oval Face Contour', 'Short Trimmed Hair', 'High Cheekbones', 'Euclidean Dist: 0.108'],
          sketchSvg: `
            <svg viewBox="0 0 120 120" class="biometric-hud-svg">
              <path d="M5 25 V5 H25 M95 5 H115 V25 M115 95 V115 H95 M25 115 H5 V95" stroke="#f59e0b" stroke-width="1.5" fill="none" opacity="0.6"/>
              <ellipse cx="60" cy="62" rx="34" ry="44" fill="rgba(245, 158, 11, 0.06)" stroke="#f59e0b" stroke-width="1.8"/>
              <line x1="60" y1="18" x2="60" y2="106" stroke="#f59e0b" stroke-width="0.8" stroke-dasharray="2 2" opacity="0.5"/>
              <circle cx="47" cy="54" r="3.5" fill="#f59e0b"/>
              <circle cx="73" cy="54" r="3.5" fill="#f59e0b"/>
              <path d="M56 60 L 60 74 L 64 74" stroke="#f59e0b" stroke-width="1.2" fill="none"/>
              <path d="M50 86 Q 60 90 70 86" stroke="#f59e0b" stroke-width="1.8" fill="none"/>
            </svg>
          `
        },
        {
          id: 'SUSPECT-CR-904',
          score: 81.5,
          confidence: 'CORRELATED',
          statusClass: 'status-info',
          gender: 'Male',
          age: '30-35',
          features: ['Square Jaw Contour', 'Slight Facial Asymmetry', 'Deep-set Orbitals', 'Euclidean Dist: 0.185'],
          sketchSvg: `
            <svg viewBox="0 0 120 120" class="biometric-hud-svg">
              <path d="M5 25 V5 H25 M95 5 H115 V25 M115 95 V115 H95 M25 115 H5 V95" stroke="#a855f7" stroke-width="1.5" fill="none" opacity="0.6"/>
              <polygon points="60,20 86,30 92,70 78,102 42,102 28,70 34,30" fill="rgba(168, 85, 247, 0.06)" stroke="#a855f7" stroke-width="1.8"/>
              <line x1="60" y1="20" x2="60" y2="102" stroke="#a855f7" stroke-width="0.8" stroke-dasharray="2 2" opacity="0.5"/>
              <circle cx="46" cy="53" r="3.5" fill="#a855f7"/>
              <circle cx="74" cy="53" r="3.5" fill="#a855f7"/>
              <path d="M58 58 L 60 72 L 64 72" stroke="#a855f7" stroke-width="1.2" fill="none"/>
              <line x1="50" y1="86" x2="70" y2="86" stroke="#a855f7" stroke-width="2"/>
            </svg>
          `
        }
      ];

      resultsContainer.innerHTML = `
        <div class="results-header">
          <h4>Ranked Biometric Candidates</h4>
          <span class="badge-matched">Top 3 of 4,820 Records</span>
        </div>
        <div class="suspect-grid">
          ${suspects.map((s, idx) => `
            <div class="suspect-card ${idx === 0 ? 'top-match' : ''}">
              <div class="suspect-top">
                <div class="suspect-thumb">
                  ${s.sketchSvg}
                  <span class="rank-badge">#${idx + 1}</span>
                </div>
                <div class="suspect-meta">
                  <div class="suspect-id">${s.id}</div>
                  <div class="score-pill ${s.statusClass}">
                    <strong>${s.score}%</strong> Match
                  </div>
                  <div class="conf-tag">${s.confidence}</div>
                </div>
              </div>
              <div class="feature-tags">
                ${s.features.map(f => `<span class="ft-tag">${f}</span>`).join('')}
              </div>
              <div class="similarity-bar-wrap">
                <div class="similarity-bar" style="width: ${s.score}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }, 750);
  }

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      promptInput.value = chip.dataset.prompt;
      audio.playClick();
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      executeMatch(chip.dataset.prompt);
    });
  });

  runBtn.addEventListener('click', () => {
    const text = promptInput.value.trim() || 'Male suspect with sharp jawline';
    executeMatch(text);
  });

  // Render initial match on load
  executeMatch(promptInput.value);
}

function setupRAGDemo() {
  const querySelect = document.getElementById('rag-query-select');
  const customInput = document.getElementById('rag-custom-input');
  const runBtn = document.getElementById('run-rag-btn');
  const outputWrap = document.getElementById('rag-output-wrap');
  const metricsWrap = document.getElementById('rag-metrics-wrap');

  if (!runBtn || !outputWrap) return;

  const sampleResponses = {
    "patent_3p": {
      category: "PATENT LAW & TRADITIONAL KNOWLEDGE",
      entities: ["Polyherbal Composition", "Section 3(p) Patent Act 1970", "TKDL Prior Art"],
      chunksRetrieved: 4,
      retrievalLatency: "142 ms",
      similarityScore: "0.947",
      answer: `Under <strong>Section 3(p) of the Indian Patents Act, 1970</strong>, an invention which in effect is traditional knowledge or an aggregation/duplication of known properties of traditionally known component(s) is <em>not patentable</em>.<br><br>
      <strong>Key Guidance for AYUSH Innovators:</strong>
      <ul>
        <li><strong>Synergistic Bio-Efficacy:</strong> To bypass Section 3(p), innovators must establish experimental synergism (e.g. combination index < 0.8) proving the poly-herbal formulation yields clinical therapeutic efficacy exceeding the arithmetic sum of its constituent herbs.</li>
        <li><strong>Novel Extraction & Carrier Matrix:</strong> Standardized solvent fractioning or nano-phytosomal delivery mechanisms can qualify for patent grant under Section 2(1)(j).</li>
        <li><strong>TKDL Verification:</strong> Cross-check formulation against Traditional Knowledge Digital Library (TKDL) prior art before filing.</li>
      </ul>`,
      citations: [
        "The Patents Act, 1970 — Section 3(p) Statutory Exclusions",
        "Guidelines for Examination of AYUSH/Botanical Patent Applications (CGPDTM)",
        "Traditional Knowledge Digital Library (TKDL) Access Protocol"
      ]
    },
    "export_eu": {
      category: "REGULATORY COMPLIANCE & EXPORT",
      entities: ["Ayurveda Premium Mark", "EU Directive 2004/24/EC", "THMPD Registration"],
      chunksRetrieved: 5,
      retrievalLatency: "168 ms",
      similarityScore: "0.932",
      answer: `For commercial export of Ayurvedic botanical extracts (e.g., Ashwagandha / Withania somnifera) to the European Union:<br><br>
      <strong>Regulatory Pathways:</strong>
      <ul>
        <li><strong>Traditional Herbal Medicinal Products Directive (THMPD 2004/24/EC):</strong> Requires evidence of 30 years of traditional medicinal use (including at least 15 years within the EU).</li>
        <li><strong>Food Supplement Classification (EC 1925/2006):</strong> If sold as nutraceutical/supplement, must comply with strict heavy metal limits (Lead < 3.0 ppm, Cadmium < 1.0 ppm, Mercury < 0.1 ppm) and aflatoxin thresholds.</li>
        <li><strong>Ayush Premium Mark (APM):</strong> Endorsed by the Quality Council of India (QCI), validating WHO-GMP compliance and accredited ISO 17025 batch certificates.</li>
      </ul>`,
      citations: [
        "Quality Council of India (QCI) AYUSH Premium Mark Technical Criteria",
        "European Medicines Agency (EMA/HMPC) Herbal Monograph",
        "Food Safety and Standards Authority of India (FSSAI) Export Certification Scheme"
      ]
    },
    "gmp_sched_t": {
      category: "MANUFACTURING & QUALITY STANDARDS",
      entities: ["Schedule T Drugs & Cosmetics Rules 1945", "Cleanroom Class 10,000", "HPLC Fingerprinting"],
      chunksRetrieved: 3,
      retrievalLatency: "118 ms",
      similarityScore: "0.961",
      answer: `<strong>Schedule T Compliance Roadmap</strong> for Ayurvedic manufacturing units under Drugs & Cosmetics Rules, 1945:<br><br>
      <ul>
        <li><strong>Facility Zoning:</strong> Separate air handling units (AHU) with HEPA filtration for powder processing, extraction, and liquid formulation sections to prevent cross-contamination.</li>
        <li><strong>Raw Drug Quarantine & Authentication:</strong> Botanical macroscopic, microscopic, and chromatographic (HPTLC/HPLC) fingerprint testing against Ayurvedic Pharmacopoeia of India (API) standards.</li>
        <li><strong>Stability Studies:</strong> Accelerated (40°C ± 2°C / 75% RH) and real-time shelf life validation for proprietary formulations.</li>
      </ul>`,
      citations: [
        "Drugs and Cosmetics Rules 1945 — Schedule T (Good Manufacturing Practices)",
        "Ayurvedic Pharmacopoeia of India (API) Part I & II",
        "Ministry of AYUSH Notification on Standardized Botanical Extract Testing"
      ]
    }
  };

  querySelect?.addEventListener('change', () => {
    if (querySelect.value === 'custom') {
      customInput.style.display = 'block';
      customInput.focus();
    } else {
      customInput.style.display = 'none';
      executeRAG();
    }
  });

  function executeRAG() {
    audio.playPulse();
    runBtn.disabled = true;
    runBtn.innerHTML = `
      <span class="spinner"></span>
      <span>Query Routing & Vector Search...</span>
    `;

    let queryKey = querySelect.value;
    if (queryKey === 'custom') queryKey = 'patent_3p';

    const data = sampleResponses[queryKey] || sampleResponses.patent_3p;

    metricsWrap.innerHTML = `
      <div class="rag-pipeline-bar">
        <div class="p-step active">1. Classifier</div>
        <div class="p-arrow">➔</div>
        <div class="p-step active">2. Metadata Routing</div>
        <div class="p-arrow">➔</div>
        <div class="p-step active">3. Vector DB Chunks</div>
        <div class="p-arrow">➔</div>
        <div class="p-step active">4. Source Grounded Synthesis</div>
      </div>
    `;

    setTimeout(() => {
      runBtn.disabled = false;
      runBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        <span>Execute RAG Guidance</span>
      `;
      audio.playSuccess();

      outputWrap.innerHTML = `
        <div class="rag-result-card">
          <div class="rag-card-header">
            <span class="rag-cat">${data.category}</span>
            <div class="rag-stats">
              <span>Chunks: <strong>${data.chunksRetrieved}</strong></span>
              <span>Cosine: <strong>${data.similarityScore}</strong></span>
              <span>Latency: <strong>${data.retrievalLatency}</strong></span>
            </div>
          </div>
          <div class="rag-entities">
            <strong>Identified Entities:</strong>
            ${data.entities.map(e => `<span class="entity-pill">${e}</span>`).join('')}
          </div>
          <div class="rag-body">
            ${data.answer}
          </div>
          <div class="rag-citations">
            <div class="cit-title">Verified Regulatory References (Grounding Sources):</div>
            <ul>
              ${data.citations.map(c => `<li><span class="cit-icon">📜</span> ${c}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }, 600);
  }

  runBtn.addEventListener('click', executeRAG);

  // Render initial RAG output on load
  executeRAG();
}
