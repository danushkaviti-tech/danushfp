// Interactive Cybernetic Terminal "DanushOS v2.6"
import { audio } from './audio.js';
import confetti from 'canvas-confetti';

export function setupTerminal() {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const quickCmdButtons = document.querySelectorAll('.term-quick-btn');

  if (!terminalBody || !terminalInput) return;

  const history = [];
  let historyIndex = -1;

  function printLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    line.innerHTML = text;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function handleCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    history.push(cmd);
    historyIndex = history.length;

    printLine(`<span class="term-prompt">guest@danush-os:~$</span> <span class="term-cmd">${rawCmd}</span>`);
    audio.playClick();

    switch (cmd) {
      case 'help':
        printLine(`
Available commands:
  <span class="cmd-hl">bio</span>          - About Kaviti Danush
  <span class="cmd-hl">skills</span>       - Tech stack & proficiency
  <span class="cmd-hl">projects</span>     - Production AI & Web systems
  <span class="cmd-hl">exp</span>          - Work experience (Future Interns)
  <span class="cmd-hl">achievements</span> - LeetCode Knight & CodeChef stats
  <span class="cmd-hl">education</span>    - B.Tech CSE (2024-2028), CGPA 8.45
  <span class="cmd-hl">contact</span>      - Email, phone, profiles
  <span class="cmd-hl">resume</span>       - Download verified PDF resume
  <span class="cmd-hl">hire</span>         - Direct recruit action & email link
  <span class="cmd-hl">matrix</span>       - Toggle holographic matrix mode
  <span class="cmd-hl">clear</span>        - Clear terminal screen
        `);
        break;

      case 'bio':
      case 'about':
        printLine(`
<strong>KAVITI DANUSH</strong>
Full Stack Python / Web Developer & AI/GenAI Systems Builder.
Pursuing B.Tech in Computer Science & Engineering (2024–2028) at Vignan's Institute of IT, Visakhapatnam.
Maintains a 8.45 CGPA. Passionate about solving complex algorithmic challenges (1,700+ solved) and architecting high-impact GenAI & full-stack web applications.
        `);
        break;

      case 'skills':
        printLine(`
<strong>TECHNICAL SKILLS MATRIX:</strong>
• <strong>AI/GenAI:</strong> RAG Architecture, LangGraph, LLMs & Prompt Eng, LangChain, Embeddings, Vector DBs, Hugging Face
• <strong>Architecture & System Design:</strong> System Architecture, System Design Basics, Microservices, Scalability, Load Balancing & Caching
• <strong>Databases & Caching:</strong> Redis (In-Memory / Pub-Sub), MongoDB, SQL (PostgreSQL, MySQL)
• <strong>Languages:</strong> Python, JavaScript (ES6+), Java, C, SQL, HTML5, CSS3
• <strong>Frameworks:</strong> React.js, Node.js, Express.js, Django, Bootstrap
• <strong>Tools & Cloud:</strong> Git, GitHub, VS Code, Postman, AWS Cloud, Docker (Basics), CI/CD
        `);
        break;

      case 'projects':
        printLine(`
<strong>FEATURED SYSTEMS:</strong>
1. <strong>AI-Powered Forensic Face Matching System</strong>
   - Tech: React, Node.js, Hugging Face API, Face Embeddings, Cosine Similarity
   - Generates suspect facial sketches from natural language descriptions; executes 512-D tensor embedding cosine distance ranking against suspect database.

2. <strong>IP-SAKTI AI (Ayurveda/AYUSH Guidance System)</strong>
   - Tech: LangChain, RAG, LLM, Vector Database, Embeddings
   - Context-grounded regulatory guidance for AYUSH innovators with query classification, metadata filtering, and real-time knowledge base updates.
        `);
        break;

      case 'exp':
      case 'experience':
        printLine(`
<strong>WORK EXPERIENCE:</strong>
• <strong>Future Interns — Full Stack Python Web Developer</strong>
  (9th Feb 2026 – 9th March 2026)
  - Built & integrated robust RESTful APIs and database operations (user data, auth, CRUD).
  - Designed and deployed user-friendly responsive frontend components using HTML, CSS, JavaScript, and Git.
        `);
        break;

      case 'achievements':
      case 'dsa':
      case 'leetcode':
        printLine(`
<strong>COMPETITIVE PROGRAMMING & LEADERSHIP:</strong>
🏆 <strong>LeetCode Knight</strong> | CodeChef 3-Star (Peak: 1700)
📊 <strong>1,700+ Problems Solved</strong> across LeetCode, Codeforces, HackerRank, CodeStudio & CodeChef
🎖️ <strong>IEEE Vice-Chair & SSC Club Lead</strong> - Proven technical leadership and college community mentoring
        `);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
        audio.playSuccess();
        break;

      case 'education':
      case 'route':
      case 'roadmap':
        printLine(`
<strong>ACADEMIC ROUTE MAP // 3 CONNECTED STATIONS:</strong>
[✓] <strong>STATION 01 (Foundation Waypoint):</strong> Higher Secondary Education (MPC / STEM) (2022–2024)
    • Analytical bedrock in Calculus, Physics, Discrete Math, C & Python.
[⚡] <strong>STATION 02 (Current Academic Station):</strong> B.Tech in CSE @ Vignan's Institute of IT (2024–2028)
    • CGPA: <strong>8.45 / 10</strong> | IEEE Vice-Chair & SSC Club Lead | DSA, DBMS, OS, Networks.
[✦] <strong>STATION 03 (Next Destination Waypoint):</strong> <strong>Next Journey Starts Soon .</strong>
    • Advanced Generative AI Research, Distributed Systems, Master's Horizons & Continuous Mastery.
        `);
        break;

      case 'contact':
        printLine(`
<strong>CONTACT DIRECT:</strong>
📧 Email: <a href="mailto:danushkaviti@gmail.com" class="term-link">danushkaviti@gmail.com</a>
📱 Phone: <a href="tel:+917794039459" class="term-link">+91 7794039459</a>
🌐 Location: Visakhapatnam, Andhra Pradesh, India
🔗 Profiles: <a href="https://linkedin.com" target="_blank" class="term-link">LinkedIn</a> | <a href="https://github.com" target="_blank" class="term-link">GitHub</a> | <a href="https://leetcode.com" target="_blank" class="term-link">LeetCode</a> | <a href="https://codechef.com" target="_blank" class="term-link">CodeChef</a>
        `);
        break;

      case 'resume':
        printLine(`📄 Opening Danush's verified resume...`);
        const resumeModal = document.getElementById('resume-modal');
        if (resumeModal) {
          resumeModal.classList.add('active');
        } else {
          window.open('/assets/danush_resume.pdf', '_blank');
        }
        audio.playSuccess();
        break;

      case 'hire':
        printLine(`
🎉 <strong>Ready to bring Danush onto your engineering team?</strong>
Click to send a direct interview invitation:
<a href="mailto:danushkaviti@gmail.com?subject=Job%20Opportunity%20/%20Internship%20Interview&body=Hi%20Danush,%20we%20reviewed%20your%20portfolio%20and%20would%20love%20to%20connect!" class="btn-term-cta">✉️ Send Offer / Email Danush</a>
        `);
        confetti({ particleCount: 70, spread: 80 });
        audio.playSuccess();
        break;

      case 'matrix':
        const term = document.querySelector('.terminal-card');
        term?.classList.toggle('matrix-mode');
        printLine(`[SYSTEM] Matrix phosphor mode toggled.`);
        break;

      case 'clear':
        terminalBody.innerHTML = '';
        break;

      default:
        printLine(`Command not recognized: '<span class="text-danger">${cmd}</span>'. Type <span class="cmd-hl">help</span> for a list of commands.`);
    }
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      handleCommand(val);
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        terminalInput.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (history.length > 0 && historyIndex < history.length - 1) {
        historyIndex++;
        terminalInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        terminalInput.value = '';
      }
    } else {
      audio.playTyping();
    }
  });

  quickCmdButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playClick();
      const cmd = btn.dataset.cmd;
      terminalInput.value = cmd;
      handleCommand(cmd);
    });
  });
}
