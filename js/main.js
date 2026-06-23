/**
 * ARUNAGIRI S. PORTFOLIO
 * Main Client-Side JS
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let skillsData = [];
  let projectsData = [];
  let certsData = [];

  // ==========================================
  // SYSTEM PRELOADER LOADER ANIMATION
  // ==========================================
  const preloader = document.getElementById('preloader');
  const preloaderTyping = document.getElementById('preloaderTyping');
  const loadingStages = [
    "Locating MongoDB Cluster...",
    "Verifying ECE Protocols...",
    "Retrieving Full Stack Repositories...",
    "Compiling UI components...",
    "Establishing Secure Handshake...",
    "System Decryption Complete."
  ];

  let stageIdx = 0;
  function updatePreloaderText() {
    if (stageIdx < loadingStages.length) {
      preloaderTyping.textContent = loadingStages[stageIdx];
      stageIdx++;
      setTimeout(updatePreloaderText, 450);
    } else {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        // Trigger achievements counter start in case it's in view
        checkCountersInView();
      }, 500);
    }
  }
  updatePreloaderText();

  // ==========================================
  // CUSTOM CURSOR TRAIL EFFECT
  // ==========================================
  const cursorDot = document.getElementById('customCursorDot');
  const cursorRing = document.getElementById('customCursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  // Smooth cursor ring movement using lerp (Linear Interpolation)
  function animateRing() {
    const lerpFactor = 0.15;
    ringX += (mouseX - ringX) * lerpFactor;
    ringY += (mouseY - ringY) * lerpFactor;
    
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Add hover class to body when over interactive items
  const interactiveSelectors = 'a, button, input, textarea, .filter-btn, .project-card, .cert-card';
  
  function addCursorHoverListeners() {
    document.querySelectorAll(interactiveSelectors).forEach(item => {
      item.addEventListener('mouseenter', () => document.body.classList.add('custom-cursor-hover'));
      item.addEventListener('mouseleave', () => document.body.classList.remove('custom-cursor-hover'));
    });
  }
  addCursorHoverListeners();

  // ==========================================
  // NATIVE LIGHTWEIGHT CANVAS PARTICLES SYSTEM
  // ==========================================
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  const maxParticles = 65;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.speedY = Math.random() * 0.6 - 0.3;
      this.color = document.body.classList.contains('light-theme') 
        ? 'rgba(79, 70, 229, 0.15)' 
        : 'rgba(99, 102, 241, 0.2)';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around bounds
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < maxParticles; i++) {
      particlesArray.push(new Particle());
    }
  }
  initParticles();

  function connectParticles() {
    const maxDistance = 120;
    const isLightTheme = document.body.classList.contains('light-theme');
    
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - (dist / maxDistance)) * 0.12;
          ctx.strokeStyle = isLightTheme 
            ? `rgba(79, 70, 229, ${alpha})` 
            : `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ==========================================
  // TYPING EFFECT - HERO
  // ==========================================
  const typingText = document.getElementById('typingText');
  const occupations = [
    "Electronics & Communication Engineering Student",
    "Full Stack Web Developer",
    "IoT & Embedded Systems Enthusiast",
    "AIoT Innovator"
  ];
  let wordIdx = 0;
  let letterIdx = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentWord = occupations[wordIdx];
    
    if (isDeleting) {
      typingText.textContent = currentWord.substring(0, letterIdx - 1);
      letterIdx--;
    } else {
      typingText.textContent = currentWord.substring(0, letterIdx + 1);
      letterIdx++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && letterIdx === currentWord.length) {
      typeSpeed = 2000; // Delay when word fully typed
      isDeleting = true;
    } else if (isDeleting && letterIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % occupations.length;
      typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeEffect, typeSpeed);
  }
  setTimeout(typeEffect, 1000);

  // ==========================================
  // SCROLL BEHAVIOR & INTERSECTION OBSERVER
  // ==========================================
  const header = document.getElementById('mainHeader');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Scroll Reveal & Nav Link Active State
  const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(sec => scrollRevealObserver.observe(sec));

  // Active section link highlighting
  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggling
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  mobileNavToggle.addEventListener('click', () => {
    mobileNavToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close nav menu on link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNavToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // ==========================================
  // LIGHT / DARK THEME TOGGLER
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  
  // Set theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.add('dark-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
  });

  // ==========================================
  // FETCH DYNAMIC DATABASE VALUES
  // ==========================================
  async function loadPortfolioData() {
    try {
      // 1. Fetch Profile Data
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const profile = await profileRes.json();
        renderProfile(profile);
      }
      
      // 2. Fetch Projects Data
      const projectsRes = await fetch('/api/projects');
      if (projectsRes.ok) {
        projectsData = await projectsRes.json();
        renderProjects(projectsData);
      }

      // 3. Fetch Certificates Data
      const certsRes = await fetch('/api/certificates');
      if (certsRes.ok) {
        certsData = await certsRes.json();
        renderCertificates(certsData);
      }

      // Re-trigger cursor listeners for new dynamic content
      addCursorHoverListeners();

    } catch (err) {
      console.error("Error loading portfolio data:", err);
      // Fallback for static display if serverless is not yet active
      renderProfile(getFallbackProfile());
      renderProjects(getFallbackProjects());
      renderCertificates(getFallbackCerts());
    }
  }

  // Populates biography and details
  function renderProfile(profile) {
    document.getElementById('aboutDegree').textContent = profile.degree || profile.degreeName || "BE Electronics & Communication Engineering";
    document.getElementById('aboutCollege').textContent = profile.college || "Adhi College of Engineering and Technology";
    document.getElementById('aboutUniversity').textContent = profile.university || "Anna University";
    document.getElementById('aboutBio').textContent = profile.about;
    document.getElementById('cgpaText').textContent = profile.cgpa;

    // CGPA stroke offsets (max value is 314.16 representing 100% or 10.0 CGPA)
    const cgpaVal = parseFloat(profile.cgpa) || 0.0;
    const ringOffset = 314.16 - (314.16 * (cgpaVal / 10.0));
    document.getElementById('cgpaRingProgress').style.strokeDashoffset = ringOffset;

    // Update Links
    document.getElementById('heroResumeBtn').href = profile.resumeUrl || '#';
    document.getElementById('socialGithub').href = profile.githubUrl || '#';
    document.getElementById('socialLinkedin').href = profile.linkedinUrl || '#';
    document.getElementById('contactEmailLink').href = `mailto:${profile.email}`;
    document.getElementById('contactEmailLink').textContent = profile.email;

    // Render Skills
    skillsData = profile.skills || [];
    renderSkills('All');
    setupSkillsFilter();

    // Achievements Setup
    if (profile.achievements) {
      document.getElementById('counterProjects').dataset.target = profile.achievements.completedProjects;
      document.getElementById('counterCerts').dataset.target = profile.achievements.certificationsEarned;
      document.getElementById('counterWorkshops').dataset.target = profile.achievements.workshopsAttended;
      document.getElementById('counterHackathons').dataset.target = profile.achievements.hackathonsParticipated;
    }
  }

  // Dynamic Skill Cards Rendering
  function renderSkills(category) {
    const grid = document.getElementById('skillsGrid');
    grid.innerHTML = '';

    const filtered = category === 'All' 
      ? skillsData 
      : skillsData.filter(s => s.category.toLowerCase() === category.toLowerCase());

    filtered.forEach(skill => {
      const card = document.createElement('div');
      card.className = 'skill-card glass-card scroll-reveal active';

      // Pick fontawesome icon based on skill name
      let iconClass = 'fa-solid fa-code';
      const name = skill.name.toLowerCase();
      if (name.includes('html')) iconClass = 'fa-brands fa-html5 text-orange';
      else if (name.includes('css')) iconClass = 'fa-brands fa-css3-alt';
      else if (name.includes('javascript') || name === 'js') iconClass = 'fa-brands fa-square-js';
      else if (name === 'react') iconClass = 'fa-brands fa-react';
      else if (name === 'node') iconClass = 'fa-brands fa-node-js';
      else if (name === 'mongodb') iconClass = 'fa-solid fa-database';
      else if (name === 'mysql') iconClass = 'fa-solid fa-server';
      else if (name === 'firebase') iconClass = 'fa-solid fa-fire';
      else if (name === 'git') iconClass = 'fa-brands fa-git-alt';
      else if (name === 'github') iconClass = 'fa-brands fa-github';
      else if (name === 'python') iconClass = 'fa-brands fa-python';
      else if (name === 'c++') iconClass = 'fa-solid fa-c';
      else if (name === 'c') iconClass = 'fa-solid fa-copyright'; // default C
      else if (name === 'flutter') iconClass = 'fa-solid fa-mobile-screen-button';

      card.innerHTML = `
        <div class="skill-icon-wrapper">
          <i class="${iconClass}"></i>
        </div>
        <h4>${skill.name}</h4>
        <div class="skill-progress-container">
          <div class="skill-progress-text">
            <span>Proficiency</span>
            <span>${skill.percentage}%</span>
          </div>
          <div class="skill-progress-bar-bg">
            <div class="skill-progress-bar" style="width: ${skill.percentage}%"></div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function setupSkillsFilter() {
    const filterButtons = document.querySelectorAll('.skills-filter .filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.category;
        renderSkills(cat);
        addCursorHoverListeners();
      });
    });
  }

  // Dynamic Projects Rendering
  function renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';

    projects.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'project-card glass-card scroll-reveal active';

      const detailsHtml = proj.details.map(det => `<li>${det}</li>`).join('');
      const tagsHtml = proj.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');
      const imageSrc = proj.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600';

      card.innerHTML = `
        <div class="project-image-wrapper">
          <img src="${imageSrc}" alt="${proj.title}">
          <div class="project-card-overlay">
            <h4>Highlights</h4>
            <ul>
              ${detailsHtml || '<li>Full implementation</li>'}
            </ul>
          </div>
        </div>
        <div class="project-body">
          <h3>${proj.title}</h3>
          <p class="project-description">${proj.description}</p>
          <div class="project-tags">
            ${tagsHtml}
          </div>
          <div class="project-actions">
            <a href="${proj.githubLink || '#'}" class="btn btn-secondary btn-sm" target="_blank"><i class="fa-brands fa-github"></i> Source</a>
            <a href="${proj.liveLink || '#'}" class="btn btn-primary btn-sm" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Dynamic Certificates Rendering
  function renderCertificates(certs) {
    const grid = document.getElementById('certificationsGrid');
    grid.innerHTML = '';

    certs.forEach(cert => {
      const card = document.createElement('div');
      card.className = 'cert-card glass-card scroll-reveal active';

      card.innerHTML = `
        <div class="cert-icon-wrapper">
          <i class="fa-solid fa-award"></i>
        </div>
        <h3>${cert.title}</h3>
        <p class="cert-issuer">${cert.issuer}</p>
        <div class="cert-meta">
          <span class="cert-date">${cert.issueDate || ''}</span>
          <a href="${cert.credentialUrl || '#'}" class="cert-btn" target="_blank">Verify <i class="fa-solid fa-angle-right"></i></a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // ==========================================
  // SCROLL-TRIGGERED COUNTERS ANIMATION
  // ==========================================
  let countersAnimated = false;
  
  function checkCountersInView() {
    if (countersAnimated) return;
    
    const panel = document.getElementById('achievementsCounters');
    if (!panel) return;
    
    const position = panel.getBoundingClientRect();
    // Check if element is in view
    if (position.top < window.innerHeight && position.bottom >= 0) {
      animateCounters();
      countersAnimated = true;
    }
  }

  function animateCounters() {
    const counters = document.querySelectorAll('.counter-number');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target) || 0;
      let current = 0;
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60 FPS approx

      function updateCount() {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
        } else {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCount);
        }
      }
      updateCount();
    });
  }

  window.addEventListener('scroll', checkCountersInView);

  // ==========================================
  // CONTACT FORM SUBMISSION HANDLER
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear alerts
    formAlert.style.display = 'none';
    formAlert.className = 'form-alert';
    
    const submitBtn = contactForm.querySelector('.form-submit-btn');
    const origBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Processing...</span><i class="fa-solid fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    const payload = {
      name: document.getElementById('formName').value.trim(),
      email: document.getElementById('formEmail').value.trim(),
      subject: document.getElementById('formSubject').value.trim(),
      message: document.getElementById('formMessage').value.trim()
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        formAlert.textContent = "Your message was sent successfully! I will get back to you shortly.";
        formAlert.classList.add('success');
        contactForm.reset();
      } else {
        const errData = await res.json();
        formAlert.textContent = errData.error || "Message delivery failed. Please try again.";
        formAlert.classList.add('error');
      }
    } catch (err) {
      formAlert.textContent = "A network error occurred. Please try again.";
      formAlert.classList.add('error');
    } finally {
      submitBtn.innerHTML = origBtnText;
      submitBtn.disabled = false;
    }
  });

  // Load everything
  loadPortfolioData();

  // ==========================================
  // STATIC PORTFOLIO FALLBACK VALUE GENERATORS
  // ==========================================
  function getFallbackProfile() {
    return {
      name: "Arunagiri S",
      degree: "BE Electronics & Communication Engineering",
      college: "Adhi College of Engineering and Technology",
      university: "Anna University",
      about: "Passionate about Full Stack Development, IoT, AIoT, Embedded Systems, and Cloud Technologies. I like bridging the gap between hardware and software, designing responsive web applications, and building connected smart systems that solve real-world problems.",
      cgpa: "7.93",
      resumeUrl: "#",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      email: "arunagiri.ece@gmail.com",
      skills: [
        { name: "HTML", percentage: 95, category: "Frontend" },
        { name: "CSS", percentage: 90, category: "Frontend" },
        { name: "JavaScript", percentage: 88, category: "Frontend" },
        { name: "React", percentage: 80, category: "Frontend" },
        { name: "Node.js", percentage: 85, category: "Backend" },
        { name: "Express.js", percentage: 82, category: "Backend" },
        { name: "MongoDB", percentage: 80, category: "Database" },
        { name: "Firebase", percentage: 85, category: "Database" },
        { name: "Git", percentage: 85, category: "Tools" }
      ]
    };
  }

  function getFallbackProjects() {
    return [
      {
        title: "Smart One Transportation System",
        description: "IoT-based smart transportation solution providing real-time tracking, ESP32 device mapping, and instant notifications.",
        details: ["IoT-based smart transportation solution", "Real-time monitoring", "Firebase integration", "Flutter application", "ESP32-based implementation"],
        tags: ["IoT", "Firebase", "Flutter", "ESP32"],
        githubLink: "#",
        liveLink: "#"
      },
      {
        title: "CareLoop – Federated Learning Based AIoT Smart Elder Care System",
        description: "An AIoT elder care monitoring ecosystem utilizing federated learning networks to maintain privacy while sharing healthcare sensor inputs.",
        details: ["AIoT healthcare monitoring", "Smart sensors", "Firebase database", "Real-time alerts", "Elder care ecosystem"],
        tags: ["AIoT", "Federated Learning", "Firebase", "Sensors"],
        githubLink: "#",
        liveLink: "#"
      }
    ];
  }

  function getFallbackCerts() {
    return [
      { title: "Oracle Course", issuer: "Oracle Academy", credentialUrl: "#", issueDate: "2025" },
      { title: "AI Fluency for Small Businesses", issuer: "LinkedIn Learning", credentialUrl: "#", issueDate: "2025" },
      { title: "Claude 101", issuer: "Anthropic / Academy", credentialUrl: "#", issueDate: "2025" },
      { title: "IoT and Smart Home Applications", issuer: "Coursera", credentialUrl: "#", issueDate: "2025" }
    ];
  }
});
