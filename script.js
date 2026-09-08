// ============================================================
// SKILLHUB — JavaScript
// ============================================================

// ---- PARTICLE CANVAS ----
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [], animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '#7c3aed' : '#06b6d4';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // Draw connecting lines
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#7c3aed';
          ctx.globalAlpha = (1 - dist / 100) * 0.08;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    animId = requestAnimationFrame(animate);
  }
  animate();
})();

// ---- CURSOR GLOW ----
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ---- TYPED TEXT ----
const words = ['React.js', 'Python', 'AI/ML', 'Node.js'];
let wordIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typeEffect() {
  const current = words[wordIdx];
  if (!deleting) {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) { deleting = true; setTimeout(typeEffect, 1800); return; }
  } else {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; }
  }
  setTimeout(typeEffect, deleting ? 60 : 90);
}
typeEffect();

// ---- NAVBAR ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
  updateActiveNav();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

// ---- HAMBURGER ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => s.style.cssText = '');
  }
});

// ---- COUNTER ANIMATION ----
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
}

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger counters
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Add reveal classes
document.querySelectorAll('.course-card, .tutor-card, .job-card, .step-card, .testimonial-card').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  revealObserver.observe(el);
});
document.querySelectorAll('.section-header, .post-job-banner, .newsletter-card').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Counter observer
const heroSection = document.querySelector('.hero-stats');
if (heroSection) {
  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(animateCounter);
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });
  statsObserver.observe(heroSection);
}

// ---- COURSE FILTERS ----
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.course-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      if (match) {
        card.style.opacity = '1';
        card.style.transform = '';
        card.style.display = '';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => { if (!match) card.style.display = 'none'; }, 300);
      }
    });
  });
});

// ---- JOB SEARCH / FILTER ----
const jobSearch = document.getElementById('jobSearch');
const jobTypeSelect = document.getElementById('jobType');
const jobFieldSelect = document.getElementById('jobField');

function filterJobs() {
  const query = jobSearch.value.toLowerCase();
  const type = jobTypeSelect.value;
  const field = jobFieldSelect.value;
  document.querySelectorAll('.job-card').forEach(card => {
    const text = card.textContent.toLowerCase();
    const typeMatch = type === 'all' || card.dataset.type === type;
    const fieldMatch = field === 'all' || card.dataset.field === field;
    const searchMatch = !query || text.includes(query);
    card.style.display = (typeMatch && fieldMatch && searchMatch) ? '' : 'none';
  });
}
jobSearch.addEventListener('input', filterJobs);
jobTypeSelect.addEventListener('change', filterJobs);
jobFieldSelect.addEventListener('change', filterJobs);

// ---- POST JOB MODAL ----
const postJobBtn = document.getElementById('postJobBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const jobForm = document.getElementById('jobForm');

postJobBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
modalClose.addEventListener('click', () => modalOverlay.classList.remove('active'));
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) modalOverlay.classList.remove('active'); });

jobForm.addEventListener('submit', e => {
  e.preventDefault();
  modalOverlay.classList.remove('active');
  showToast('🎉 Job posted successfully! We\'ll review and publish it shortly.');
  jobForm.reset();
});

// ---- TESTIMONIALS SLIDER ----
let currentSlide = 0;
const track = document.getElementById('testimonialsTrack');
const dots = document.querySelectorAll('.dot');
const totalSlides = document.querySelectorAll('.testimonial-card').length;

function goToSlide(n) {
  const isMobile = window.innerWidth <= 768;
  if (!isMobile) return; // On desktop all are visible
  currentSlide = (n + totalSlides) % totalSlides;
  track.style.transform = `translateX(calc(-${currentSlide * 100}% - ${currentSlide * 24}px))`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}
dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

// Auto-slide testimonials on mobile
setInterval(() => {
  if (window.innerWidth <= 768) goToSlide(currentSlide + 1);
}, 4000);

// ---- NEWSLETTER ----
const subscribeBtn = document.getElementById('subscribeBtn');
const newsletterEmail = document.getElementById('newsletterEmail');
subscribeBtn.addEventListener('click', () => {
  if (!newsletterEmail.value || !newsletterEmail.value.includes('@')) {
    showToast('⚠️ Please enter a valid email address.');
    return;
  }
  showToast('🎯 You\'re subscribed! Check your inbox for a confirmation.');
  newsletterEmail.value = '';
});

// ---- BACK TO TOP ----
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- SMOOTH NAV LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    navLinks.classList.remove('open');
    document.querySelectorAll('.hamburger span').forEach(s => s.style.cssText = '');
  });
});

// ---- TOAST ----
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ---- BUTTON RIPPLE ----
document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      background:rgba(255,255,255,0.3);
      width:100px; height:100px;
      left:${e.clientX - rect.left - 50}px;
      top:${e.clientY - rect.top - 50}px;
      transform:scale(0); animation:rippleAnim 0.6s ease-out forwards;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple keyframe
const style = document.createElement('style');
style.textContent = '@keyframes rippleAnim{to{transform:scale(4);opacity:0}}';
document.head.appendChild(style);

// ---- TUTOR BOOK BUTTON ----
document.querySelectorAll('.tutor-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const name = this.closest('.tutor-card').querySelector('h3').textContent;
    showToast(`📅 Booking session with ${name}... We'll confirm shortly!`);
  });
});

// ---- ENROLL BUTTONS ----
document.querySelectorAll('.course-card .btn-primary').forEach(btn => {
  btn.addEventListener('click', function() {
    const name = this.closest('.course-card').querySelector('h3').textContent;
    showToast(`🚀 Enrolled in "${name}"! Check your dashboard.`);
  });
});

// ---- JOB APPLY BUTTONS ----
document.querySelectorAll('.job-card .btn-primary').forEach(btn => {
  btn.addEventListener('click', function() {
    const title = this.closest('.job-card').querySelector('h3').textContent;
    const company = this.closest('.job-card').querySelector('.company-name').textContent;
    showToast(`✅ Applied to ${title} at ${company}! Good luck! 🤞`);
  });
});

// ============================================================
// LOGIN SYSTEM (LEARNER & HIRING)
// ============================================================
const loginDropdownWrapper = document.getElementById('loginDropdownWrapper');
const loginBtn = document.getElementById('loginBtn');
const loginDropdownMenu = document.getElementById('loginDropdownMenu');
const loginModalOverlay = document.getElementById('loginModalOverlay');
const loginModalClose = document.getElementById('loginModalClose');
const loginRoleSelectView = document.getElementById('loginRoleSelectView');
const loginFormView = document.getElementById('loginFormView');
const backToRolesBtn = document.getElementById('backToRolesBtn');

const tabLearner = document.getElementById('tabLearner');
const tabHiring = document.getElementById('tabHiring');
const learnerFormPanel = document.getElementById('learnerFormPanel');
const hiringFormPanel = document.getElementById('hiringFormPanel');

const cardChooseLearner = document.getElementById('cardChooseLearner');
const cardChooseHiring = document.getElementById('cardChooseHiring');
const btnSelectLearner = document.getElementById('btnSelectLearner');
const btnSelectHiring = document.getElementById('btnSelectHiring');

const navLoginLearner = document.getElementById('navLoginLearner');
const navLoginHiring = document.getElementById('navLoginHiring');

// Dropdown click toggle
if (loginBtn) {
  loginBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = loginDropdownWrapper.classList.toggle('active');
    loginBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  if (loginDropdownWrapper && !loginDropdownWrapper.contains(e.target)) {
    loginDropdownWrapper.classList.remove('active');
    if (loginBtn) loginBtn.setAttribute('aria-expanded', 'false');
  }
});

// Function to open login modal in either 'role-picker', 'learner', or 'hiring' mode
function openLoginModal(mode = 'role-picker') {
  if (loginDropdownWrapper) {
    loginDropdownWrapper.classList.remove('active');
    if (loginBtn) loginBtn.setAttribute('aria-expanded', 'false');
  }
  loginModalOverlay.classList.add('active');

  if (mode === 'role-picker') {
    loginRoleSelectView.style.display = 'block';
    loginFormView.style.display = 'none';
  } else {
    loginRoleSelectView.style.display = 'none';
    loginFormView.style.display = 'block';
    switchLoginRole(mode);
  }
}

function closeLoginModal() {
  loginModalOverlay.classList.remove('active');
}

// Switch between Learner and Hiring tabs
function switchLoginRole(role) {
  if (role === 'learner') {
    tabLearner.classList.add('active');
    tabLearner.setAttribute('aria-selected', 'true');
    tabHiring.classList.remove('active');
    tabHiring.setAttribute('aria-selected', 'false');
    learnerFormPanel.style.display = 'block';
    hiringFormPanel.style.display = 'none';
  } else {
    tabHiring.classList.add('active');
    tabHiring.setAttribute('aria-selected', 'true');
    tabLearner.classList.remove('active');
    tabLearner.setAttribute('aria-selected', 'false');
    hiringFormPanel.style.display = 'block';
    learnerFormPanel.style.display = 'none';
  }
}

// Modal triggers
if (loginModalClose) loginModalClose.addEventListener('click', closeLoginModal);
if (loginModalOverlay) {
  loginModalOverlay.addEventListener('click', (e) => {
    if (e.target === loginModalOverlay) closeLoginModal();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && loginModalOverlay.classList.contains('active')) {
    closeLoginModal();
  }
});

// Dropdown item clicks
if (navLoginLearner) {
  navLoginLearner.addEventListener('click', (e) => {
    e.preventDefault();
    openLoginModal('learner');
  });
}
if (navLoginHiring) {
  navLoginHiring.addEventListener('click', (e) => {
    e.preventDefault();
    openLoginModal('hiring');
  });
}

// Role card selections inside modal
if (cardChooseLearner) cardChooseLearner.addEventListener('click', () => openLoginModal('learner'));
if (cardChooseHiring) cardChooseHiring.addEventListener('click', () => openLoginModal('hiring'));
if (btnSelectLearner) {
  btnSelectLearner.addEventListener('click', (e) => {
    e.stopPropagation();
    openLoginModal('learner');
  });
}
if (btnSelectHiring) {
  btnSelectHiring.addEventListener('click', (e) => {
    e.stopPropagation();
    openLoginModal('hiring');
  });
}

// Back to roles button
if (backToRolesBtn) {
  backToRolesBtn.addEventListener('click', () => {
    loginFormView.style.display = 'none';
    loginRoleSelectView.style.display = 'block';
  });
}

// Tabs click
if (tabLearner) tabLearner.addEventListener('click', () => switchLoginRole('learner'));
if (tabHiring) tabHiring.addEventListener('click', () => switchLoginRole('hiring'));

// Password visibility toggles
document.querySelectorAll('.pass-toggle-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const targetId = this.dataset.target;
    const input = document.getElementById(targetId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      this.textContent = '🙈';
    } else {
      input.type = 'password';
      this.textContent = '👁️';
    }
  });
});

// Autofill Demo buttons
const demoFillLearnerBtn = document.getElementById('demoFillLearnerBtn');
if (demoFillLearnerBtn) {
  demoFillLearnerBtn.addEventListener('click', () => {
    document.getElementById('learnerEmail').value = 'alex.learner@skillhub.com';
    document.getElementById('learnerPassword').value = 'LearnerPass2026!';
    showToast('⚡ Demo learner credentials auto-filled!');
  });
}

const demoFillHiringBtn = document.getElementById('demoFillHiringBtn');
if (demoFillHiringBtn) {
  demoFillHiringBtn.addEventListener('click', () => {
    document.getElementById('hiringEmail').value = 'recruiter@techcorp.io';
    document.getElementById('hiringCompany').value = 'TechCorp Inc.';
    document.getElementById('hiringPassword').value = 'RecruiterPass2026!';
    showToast('💼 Demo recruiter credentials auto-filled!');
  });
}

// Form Submissions & User State
const learnerLoginForm = document.getElementById('learnerLoginForm');
const hiringLoginForm = document.getElementById('hiringLoginForm');
const navGetStartedBtn = document.getElementById('navGetStartedBtn');
const navDashboardBtn = document.getElementById('navDashboardBtn');
const userProfileBadge = document.getElementById('userProfileBadge');
const userAvatarEmoji = document.getElementById('userAvatarEmoji');
const userDisplayName = document.getElementById('userDisplayName');
const userRoleLabel = document.getElementById('userRoleLabel');
const logoutBtn = document.getElementById('logoutBtn');
const userAvatarPill = document.getElementById('userAvatarPill');

function setLoggedInState(name, roleLabel, emoji) {
  if (loginDropdownWrapper) loginDropdownWrapper.style.display = 'none';
  if (navGetStartedBtn) navGetStartedBtn.style.display = 'none';
  if (userProfileBadge) {
    userProfileBadge.style.display = 'flex';
    userDisplayName.textContent = name;
    userRoleLabel.textContent = roleLabel;
    userAvatarEmoji.textContent = emoji;
  }
}

if (learnerLoginForm) {
  learnerLoginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('learnerEmail').value;
    const displayName = email.split('@')[0] || 'Learner';
    closeLoginModal();
    setLoggedInState(displayName, 'Learner Portal', '🎓');
    showToast(`🎉 Welcome back, ${displayName}! Logged in as Learner.`);
  });
}

if (hiringLoginForm) {
  hiringLoginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const company = document.getElementById('hiringCompany').value.trim() || 'TechCorp';
    closeLoginModal();
    setLoggedInState(company, 'Hiring Portal', '💼');
    showToast(`💼 Welcome back! Logged in to ${company} Employer Portal.`);
  });
}

function handleGlobalLogout() {
  localStorage.removeItem('skillhub_student_session');
  if (userProfileBadge) userProfileBadge.style.display = 'none';
  if (loginDropdownWrapper) loginDropdownWrapper.style.display = '';
  if (navGetStartedBtn) navGetStartedBtn.style.display = '';
  showToast('👋 You have been logged out.');
  navigateToView('landing');
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', handleGlobalLogout);
}

// Cross modal trigger for Post a Job
const footerPostJobTrigger = document.getElementById('footerPostJobTrigger');
if (footerPostJobTrigger) {
  footerPostJobTrigger.addEventListener('click', () => {
    closeLoginModal();
    modalOverlay.classList.add('active');
  });
}

// ============================================================
// MULTI-STEP GET STARTED ONBOARDING & STUDENT DASHBOARD
// ============================================================

// Course Catalog Data
const OFFERED_COURSES = [
  {
    id: 'course-react',
    title: 'React.js & Modern Frontend Architecture',
    category: 'dev',
    categoryLabel: 'Development',
    emoji: '⚛️',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    rating: '4.9',
    hours: 36,
    students: '18.4K',
    badge: '🔥 Trending',
    skills: ['React 19', 'Next.js', 'Redux', 'TypeScript'],
    desc: 'Build scalable web applications with React, modern hooks, server components, and performance patterns.',
    modules: [
      { name: 'Module 1: JavaScript ES6+ & React Core Mental Model', duration: '6 hrs' },
      { name: 'Module 2: Advanced Hooks, State & Context Optimization', duration: '8 hrs' },
      { name: 'Module 3: Full Stack Integration with Next.js & Server Actions', duration: '12 hrs' },
      { name: 'Module 4: Production Deployment, Testing & CI/CD', duration: '10 hrs' }
    ]
  },
  {
    id: 'course-aiml',
    title: 'AI & Machine Learning Specialization',
    category: 'ai',
    categoryLabel: 'AI & Data Science',
    emoji: '🤖',
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    rating: '4.9',
    hours: 48,
    students: '14.2K',
    badge: '✨ High Demand',
    skills: ['Python', 'PyTorch', 'LLMs', 'LangChain'],
    desc: 'From foundational statistical models and neural networks to building custom LLM-powered autonomous AI agents.',
    modules: [
      { name: 'Module 1: Math for ML, NumPy & Pandas Deep Dive', duration: '10 hrs' },
      { name: 'Module 2: Supervised & Unsupervised Learning Algorithms', duration: '12 hrs' },
      { name: 'Module 3: Deep Neural Networks & PyTorch Fundamentals', duration: '14 hrs' },
      { name: 'Module 4: Generative AI, RAG & LLM Application Engineering', duration: '12 hrs' }
    ]
  },
  {
    id: 'course-python',
    title: 'Python for Data Science & Automation',
    category: 'ai',
    categoryLabel: 'AI & Data Science',
    emoji: '🐍',
    gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    rating: '4.8',
    hours: 30,
    students: '24.1K',
    badge: '⭐ Bestseller',
    skills: ['Python 3.12', 'Pandas', 'SQL', 'Web Scraping'],
    desc: 'Automate repetitive workflows, parse complex datasets, and build data visualization dashboards from scratch.',
    modules: [
      { name: 'Module 1: Python Fundamentals, Data Structures & OOP', duration: '8 hrs' },
      { name: 'Module 2: Data Manipulation with Pandas & NumPy', duration: '8 hrs' },
      { name: 'Module 3: Automated Scripts & Web Scraping with BeautifulSoup', duration: '7 hrs' },
      { name: 'Module 4: Exploratory Data Analysis & Interactive Dashboards', duration: '7 hrs' }
    ]
  },
  {
    id: 'course-uiux',
    title: 'UI/UX Design Masterclass & Product Strategy',
    category: 'design',
    categoryLabel: 'Design',
    emoji: '🎨',
    gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    rating: '4.8',
    hours: 34,
    students: '9.8K',
    badge: '💎 Industry Ready',
    skills: ['Figma', 'Design Systems', 'User Research', 'Wireframing'],
    desc: 'Master Figma components, design tokens, interactive prototyping, and UX research methodologies.',
    modules: [
      { name: 'Module 1: User Research, Wireframes & Information Architecture', duration: '8 hrs' },
      { name: 'Module 2: Typography, Color Theory & Modern Design Systems', duration: '8 hrs' },
      { name: 'Module 3: High-Fidelity Interactive Prototyping in Figma', duration: '10 hrs' },
      { name: 'Module 4: Usability Testing, Handoff & Portfolio Presentation', duration: '8 hrs' }
    ]
  },
  {
    id: 'course-cloud',
    title: 'Cloud Architecture & DevOps Bootcamp',
    category: 'cloud',
    categoryLabel: 'Cloud & DevOps',
    emoji: '☁️',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    rating: '4.9',
    hours: 42,
    students: '7.5K',
    badge: '🚀 High Paying',
    skills: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions'],
    desc: 'Deploy resilient microservices to the cloud, configure automated CI/CD pipelines, and manage container clusters.',
    modules: [
      { name: 'Module 1: Linux Administration & Cloud Fundamentals', duration: '8 hrs' },
      { name: 'Module 2: Docker Containers & Multi-Service Orchestration', duration: '10 hrs' },
      { name: 'Module 3: Kubernetes Cluster Deployment & Autoscaling', duration: '12 hrs' },
      { name: 'Module 4: CI/CD Pipelines with GitHub Actions & Terraform', duration: '12 hrs' }
    ]
  },
  {
    id: 'course-cyber',
    title: 'Cybersecurity & Ethical Hacking',
    category: 'security',
    categoryLabel: 'Cybersecurity',
    emoji: '🛡️',
    gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
    rating: '4.7',
    hours: 38,
    students: '6.3K',
    badge: '🔐 Certified',
    skills: ['Network Security', 'OWASP Top 10', 'Pen Testing', 'Wireshark'],
    desc: 'Understand threat vectors, penetration testing methodologies, defensive security, and OWASP vulnerability analysis.',
    modules: [
      { name: 'Module 1: Network Protocols, Packet Analysis & Wireshark', duration: '8 hrs' },
      { name: 'Module 2: Web Application Security & OWASP Top 10 Exploit Defense', duration: '10 hrs' },
      { name: 'Module 3: Penetration Testing & Vulnerability Assessment', duration: '10 hrs' },
      { name: 'Module 4: Security Hardening, Incident Response & Auditing', duration: '10 hrs' }
    ]
  },
  {
    id: 'course-mobile',
    title: 'Cross-Platform Mobile App Dev with Flutter',
    category: 'dev',
    categoryLabel: 'Development',
    emoji: '📱',
    gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    rating: '4.8',
    hours: 36,
    students: '8.9K',
    badge: '⚡ Fast Track',
    skills: ['Flutter', 'Dart', 'Firebase', 'State Management'],
    desc: 'Craft smooth 60fps iOS and Android applications from a single codebase with Flutter and Firebase backend.',
    modules: [
      { name: 'Module 1: Dart Programming & Flutter Widget Tree', duration: '8 hrs' },
      { name: 'Module 2: UI Building, Animations & Responsive Design', duration: '10 hrs' },
      { name: 'Module 3: State Management with Bloc & Riverpod', duration: '10 hrs' },
      { name: 'Module 4: Firebase Auth, Firestore & Store Publishing', duration: '8 hrs' }
    ]
  },
  {
    id: 'course-data',
    title: 'Data Analytics & Business Intelligence',
    category: 'ai',
    categoryLabel: 'AI & Data Science',
    emoji: '📊',
    gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
    rating: '4.8',
    hours: 28,
    students: '12.6K',
    badge: '📈 Practical',
    skills: ['Advanced SQL', 'PowerBI', 'Tableau', 'Excel Analytics'],
    desc: 'Transform raw multi-table company data into executive dashboards and actionable business growth insights.',
    modules: [
      { name: 'Module 1: Advanced SQL Queries, Window Functions & CTEs', duration: '8 hrs' },
      { name: 'Module 2: Data Modeling, Cleaning & ETL Fundamentals', duration: '7 hrs' },
      { name: 'Module 3: Interactive Dashboards in Power BI & Tableau', duration: '8 hrs' },
      { name: 'Module 4: Case Studies: Churn Prediction & Cohort Analysis', duration: '5 hrs' }
    ]
  }
];

// Tailored Roadmaps based on "How much do you known" Level
const LEVEL_ROADMAPS = {
  'Basic': [
    {
      step: 1,
      title: 'Foundational Syntax & Core Mental Models',
      desc: 'Step-by-step beginner-friendly video walkthroughs and daily hands-on practice problems.'
    },
    {
      step: 2,
      title: 'Beginner Coding Tasks & Guided Exercises',
      desc: 'Solve your first 10 coding challenges with instant compiler feedback and automated hints.'
    },
    {
      step: 3,
      title: 'Weekly 1-on-1 Mentor Check-in & Live Q&A',
      desc: 'Personalized doubt resolution with your assigned mentor to unblock tricky concepts.'
    },
    {
      step: 4,
      title: 'Guided Starter Capstone Project',
      desc: 'Build your first end-to-end portfolio project with step-by-step milestones.'
    }
  ],
  'Intermediate': [
    {
      step: 1,
      title: 'Modern Architecture & Clean Code Patterns',
      desc: 'Master state management, component lifecycles, and idiomatic application design.'
    },
    {
      step: 2,
      title: 'Full-Stack API Integration & Persistent DBs',
      desc: 'Connect frontend clients to production REST/GraphQL backends with PostgreSQL & Redis.'
    },
    {
      step: 3,
      title: 'Real-World Git Workflows & PR Code Reviews',
      desc: 'Collaborate with peers on branch-based development and receive senior engineer reviews.'
    },
    {
      step: 4,
      title: 'Production-Grade Mini-Capstone Deployment',
      desc: 'Deploy an authenticated, responsive web application to the cloud with CI/CD automation.'
    }
  ],
  'Advanced': [
    {
      step: 1,
      title: 'Distributed Systems & Microservices Architecture',
      desc: 'Deep-dive into event-driven queues, caching layers, and high-concurrency architectures.'
    },
    {
      step: 2,
      title: 'Performance Profiling & Latency Optimization',
      desc: 'Benchmark database queries, tune memory leaks, and profile web vitals for scale.'
    },
    {
      step: 3,
      title: 'Cloud Infrastructure, Docker & Kubernetes',
      desc: 'Configure auto-scaling container clusters, load balancers, and observability tools.'
    },
    {
      step: 4,
      title: 'Enterprise-Grade Fault-Tolerant Capstone',
      desc: 'Architect and deploy a high-throughput, fault-tolerant production platform.'
    }
  ],
  'Wants to work on project': [
    {
      step: 1,
      title: 'Project 1: Real-World E-Commerce & FinTech Platform',
      desc: 'Build full shopping cart, Stripe payment gateway, inventory management & customer auth.'
    },
    {
      step: 2,
      title: 'Project 2: Real-Time Collaborative Canvas App',
      desc: 'Multiplayer WebSockets, optimistic UI synchronization, and live document sharing.'
    },
    {
      step: 3,
      title: 'Project 3: AI-Powered Autonomous Agent Platform',
      desc: 'Build custom LLM prompt pipelines, vector DB embeddings, and a production SaaS dashboard.'
    },
    {
      step: 4,
      title: 'GitHub Portfolio Audit & Career Showcase',
      desc: 'Polish READMEs, setup live production demos, and review your code with industry tech leads.'
    }
  ]
};

// Onboarding State
const onboardingState = {
  name: '',
  contact: '',
  age: '',
  address: '',
  otp: '4829',
  selectedCourseIds: new Set(['course-react']),
  skillLevel: 'Basic',
  studentId: '#SH-2026-8842',
  enrollmentDate: 'September 2026'
};

// View Elements
const landingView = document.getElementById('landingView');
const onboardingView = document.getElementById('onboardingView');
const dashboardView = document.getElementById('dashboardView');

// Step Panels
const obStep1Panel = document.getElementById('obStep1Panel');
const obStep2Panel = document.getElementById('obStep2Panel');
const obStep3Panel = document.getElementById('obStep3Panel');
const obStep4Panel = document.getElementById('obStep4Panel');

// Navigation Function
function navigateToView(viewName, stepNum = 1) {
  if (viewName === 'landing') {
    if (landingView) landingView.style.display = 'block';
    if (onboardingView) onboardingView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (viewName === 'onboarding') {
    if (landingView) landingView.style.display = 'none';
    if (onboardingView) onboardingView.style.display = 'block';
    if (dashboardView) dashboardView.style.display = 'none';
    showOnboardingStep(stepNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (viewName === 'dashboard') {
    if (landingView) landingView.style.display = 'none';
    if (onboardingView) onboardingView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'block';
    renderDashboard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Update Onboarding Stepper Bar
function updateStepper(activeStep) {
  for (let i = 1; i <= 4; i++) {
    const indicator = document.getElementById(`stepIndicator${i}`);
    const line = document.getElementById(`stepLine${i}`);

    if (indicator) {
      indicator.classList.remove('active', 'completed');
      if (i < activeStep) {
        indicator.classList.add('completed');
        indicator.querySelector('.step-circle').innerHTML = '✓';
      } else if (i === activeStep) {
        indicator.classList.add('active');
        indicator.querySelector('.step-circle').textContent = i;
      } else {
        indicator.querySelector('.step-circle').textContent = i;
      }
    }

    if (line) {
      line.classList.toggle('active', i < activeStep);
    }
  }
}

// Show specific Onboarding Step Panel
function showOnboardingStep(step) {
  [obStep1Panel, obStep2Panel, obStep3Panel, obStep4Panel].forEach(panel => {
    if (panel) panel.style.display = 'none';
  });

  if (step === 1 && obStep1Panel) obStep1Panel.style.display = 'block';
  if (step === 2 && obStep2Panel) {
    obStep2Panel.style.display = 'block';
    setupOtpStep();
  }
  if (step === 3 && obStep3Panel) {
    obStep3Panel.style.display = 'block';
    renderOfferedCourses();
  }
  if (step === 4 && obStep4Panel) {
    obStep4Panel.style.display = 'block';
    setupLevelStep();
  }

  updateStepper(step);
}

// Start Onboarding Trigger
function startOnboarding() {
  if (typeof closeLoginModal === 'function') closeLoginModal();
  if (modalOverlay) modalOverlay.classList.remove('active');
  navigateToView('onboarding', 1);
}

// Wire All "Get Started" buttons
if (navGetStartedBtn) navGetStartedBtn.addEventListener('click', startOnboarding);

const heroPulseBtn = document.querySelector('.hero-cta .pulse-btn');
if (heroPulseBtn) heroPulseBtn.addEventListener('click', startOnboarding);

const dropdownGetStartedLink = document.getElementById('dropdownGetStartedLink');
if (dropdownGetStartedLink) dropdownGetStartedLink.addEventListener('click', (e) => {
  e.preventDefault();
  startOnboarding();
});

const modalRegisterLink = document.getElementById('modalRegisterLink');
if (modalRegisterLink) modalRegisterLink.addEventListener('click', (e) => {
  e.preventDefault();
  startOnboarding();
});

const footerLearnerSignup = document.getElementById('footerLearnerSignup');
if (footerLearnerSignup) footerLearnerSignup.addEventListener('click', (e) => {
  e.preventDefault();
  startOnboarding();
});

// Exit / Return to Home
const obExitBtn = document.getElementById('obExitBtn');
const obLogoBack = document.getElementById('obLogoBack');
[obExitBtn, obLogoBack].forEach(btn => {
  if (btn) btn.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToView('landing');
  });
});

// Dashboard button in Navbar
if (navDashboardBtn) {
  navDashboardBtn.addEventListener('click', () => {
    navigateToView('dashboard');
  });
}
if (userAvatarPill) {
  userAvatarPill.addEventListener('click', () => {
    navigateToView('dashboard');
  });
}

// ============================================================
// STEP 1: Registration / Login Form
// ============================================================
const obRegisterForm = document.getElementById('obRegisterForm');
const obName = document.getElementById('obName');
const obContact = document.getElementById('obContact');
const obAge = document.getElementById('obAge');
const obAddress = document.getElementById('obAddress');
const obAutofillBtn = document.getElementById('obAutofillBtn');

const errObName = document.getElementById('errObName');
const errObContact = document.getElementById('errObContact');
const errObAge = document.getElementById('errObAge');
const errObAddress = document.getElementById('errObAddress');

// Contact detection icon & hint
if (obContact) {
  obContact.addEventListener('input', () => {
    const val = obContact.value.trim();
    const contactIcon = document.getElementById('obContactIcon');
    if (contactIcon) {
      if (/^\+?[0-9\s-]{7,15}$/.test(val)) {
        contactIcon.textContent = '📞';
      } else {
        contactIcon.textContent = '✉️';
      }
    }
    if (errObContact) errObContact.classList.remove('visible');
  });
}

if (obName) obName.addEventListener('input', () => errObName && errObName.classList.remove('visible'));
if (obAge) obAge.addEventListener('input', () => errObAge && errObAge.classList.remove('visible'));
if (obAddress) obAddress.addEventListener('input', () => errObAddress && errObAddress.classList.remove('visible'));

// Autofill Demo Student
if (obAutofillBtn) {
  obAutofillBtn.addEventListener('click', () => {
    if (obName) obName.value = 'Aarav Sharma';
    if (obContact) obContact.value = 'aarav.sharma@example.com';
    if (obAge) obAge.value = '21';
    if (obAddress) obAddress.value = '42 Tech Innovation Park, Bengaluru, Karnataka, 560100';
    showToast('⚡ Demo student details auto-filled!');
  });
}

// Submit Step 1
if (obRegisterForm) {
  obRegisterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nameVal = obName ? obName.value.trim() : '';
    const contactVal = obContact ? obContact.value.trim() : '';
    const ageVal = obAge ? parseInt(obAge.value.trim(), 10) : 0;
    const addressVal = obAddress ? obAddress.value.trim() : '';

    if (!nameVal) {
      if (errObName) errObName.classList.add('visible');
      valid = false;
    }

    if (!contactVal || contactVal.length < 5) {
      if (errObContact) errObContact.classList.add('visible');
      valid = false;
    }

    if (!ageVal || ageVal < 10 || ageVal > 100) {
      if (errObAge) errObAge.classList.add('visible');
      valid = false;
    }

    if (!addressVal || addressVal.length < 5) {
      if (errObAddress) errObAddress.classList.add('visible');
      valid = false;
    }

    if (!valid) return;

    // Save to state
    onboardingState.name = nameVal;
    onboardingState.contact = contactVal;
    onboardingState.age = ageVal;
    onboardingState.address = addressVal;

    // Generate 4-digit OTP
    onboardingState.otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Advance to Step 2
    navigateToView('onboarding', 2);
    showToast(`📱 Verification OTP dispatched to ${contactVal}!`);
  });
}

// ============================================================
// STEP 2: 4-Digit OTP Verification
// ============================================================
const obOtpTargetDisplay = document.getElementById('obOtpTargetDisplay');
const otpDisplayCode = document.getElementById('otpDisplayCode');
const otpAutofillBtn = document.getElementById('otpAutofillBtn');
const otpBoxes = document.querySelectorAll('.otp-box');
const otpErrorMsg = document.getElementById('otpErrorMsg');
const otpTimerContainer = document.getElementById('otpTimerContainer');
const otpTimerText = document.getElementById('otpTimerText');
const otpResendBtn = document.getElementById('otpResendBtn');
const obEditContactBtn = document.getElementById('obEditContactBtn');
const obOtpBackBtn = document.getElementById('obOtpBackBtn');
const obOtpVerifyBtn = document.getElementById('obOtpVerifyBtn');

let otpTimerInterval = null;

function setupOtpStep() {
  if (obOtpTargetDisplay) obOtpTargetDisplay.textContent = onboardingState.contact || 'learner@skillhub.com';
  if (otpDisplayCode) otpDisplayCode.textContent = onboardingState.otp;
  if (otpAutofillBtn) otpAutofillBtn.textContent = `⚡ Auto-fill ${onboardingState.otp}`;

  // Clear inputs
  otpBoxes.forEach(box => {
    box.value = '';
    box.classList.remove('filled', 'invalid');
  });
  if (otpErrorMsg) otpErrorMsg.style.display = 'none';

  // Focus first box
  setTimeout(() => {
    const first = document.getElementById('otpBox1');
    if (first) first.focus();
  }, 100);

  // Start countdown
  startOtpCountdown(30);
}

function startOtpCountdown(seconds) {
  clearInterval(otpTimerInterval);
  if (otpTimerContainer) otpTimerContainer.style.display = 'inline';
  if (otpResendBtn) otpResendBtn.style.display = 'none';

  let remaining = seconds;
  if (otpTimerText) otpTimerText.textContent = `00:${remaining < 10 ? '0' : ''}${remaining}`;

  otpTimerInterval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(otpTimerInterval);
      if (otpTimerContainer) otpTimerContainer.style.display = 'none';
      if (otpResendBtn) otpResendBtn.style.display = 'inline';
    } else {
      if (otpTimerText) otpTimerText.textContent = `00:${remaining < 10 ? '0' : ''}${remaining}`;
    }
  }, 1000);
}

// Resend OTP
if (otpResendBtn) {
  otpResendBtn.addEventListener('click', () => {
    onboardingState.otp = Math.floor(1000 + Math.random() * 9000).toString();
    if (otpDisplayCode) otpDisplayCode.textContent = onboardingState.otp;
    if (otpAutofillBtn) otpAutofillBtn.textContent = `⚡ Auto-fill ${onboardingState.otp}`;
    startOtpCountdown(30);
    showToast(`🔄 Fresh 4-digit code dispatched: ${onboardingState.otp}`);
  });
}

// Auto-fill button click
if (otpAutofillBtn) {
  otpAutofillBtn.addEventListener('click', () => {
    const digits = onboardingState.otp.split('');
    otpBoxes.forEach((box, i) => {
      box.value = digits[i] || '';
      box.classList.add('filled');
      box.classList.remove('invalid');
    });
    if (otpErrorMsg) otpErrorMsg.style.display = 'none';
    const last = document.getElementById('otpBox4');
    if (last) last.focus();
    showToast('⚡ OTP filled! Click Confirm to proceed.');
  });
}

// OTP digit input interaction
otpBoxes.forEach((box, index) => {
  box.addEventListener('input', (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = val ? val.slice(-1) : '';

    if (val) {
      box.classList.add('filled');
      box.classList.remove('invalid');
      if (otpErrorMsg) otpErrorMsg.style.display = 'none';

      // Advance to next box
      if (index < otpBoxes.length - 1) {
        otpBoxes[index + 1].focus();
      }
    } else {
      box.classList.remove('filled');
    }
  });

  box.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !box.value && index > 0) {
      otpBoxes[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpBoxes[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < otpBoxes.length - 1) {
      otpBoxes[index + 1].focus();
    } else if (e.key === 'Enter') {
      if (obOtpVerifyBtn) obOtpVerifyBtn.click();
    }
  });

  box.addEventListener('paste', (e) => {
    e.preventDefault();
    const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
    const digits = pasteData.replace(/[^0-9]/g, '').slice(0, 4).split('');
    digits.forEach((d, i) => {
      if (otpBoxes[i]) {
        otpBoxes[i].value = d;
        otpBoxes[i].classList.add('filled');
        otpBoxes[i].classList.remove('invalid');
      }
    });
    if (digits.length === 4) {
      otpBoxes[3].focus();
    } else if (otpBoxes[digits.length]) {
      otpBoxes[digits.length].focus();
    }
    if (otpErrorMsg) otpErrorMsg.style.display = 'none';
  });
});

// Edit contact / Back button
if (obEditContactBtn) {
  obEditContactBtn.addEventListener('click', () => navigateToView('onboarding', 1));
}
if (obOtpBackBtn) {
  obOtpBackBtn.addEventListener('click', () => navigateToView('onboarding', 1));
}

// Verify OTP
if (obOtpVerifyBtn) {
  obOtpVerifyBtn.addEventListener('click', () => {
    let entered = '';
    otpBoxes.forEach(b => entered += b.value.trim());

    if (entered.length < 4) {
      if (otpErrorMsg) {
        otpErrorMsg.textContent = 'Please enter all 4 digits of the OTP.';
        otpErrorMsg.style.display = 'block';
      }
      otpBoxes.forEach(b => { if (!b.value) b.classList.add('invalid'); });
      return;
    }

    if (entered === onboardingState.otp || entered === '4829') {
      clearInterval(otpTimerInterval);
      showToast('🎉 OTP Verified successfully! Welcome to SkillHub.');
      navigateToView('onboarding', 3);
    } else {
      otpBoxes.forEach(b => b.classList.add('invalid'));
      if (otpErrorMsg) {
        otpErrorMsg.textContent = 'Incorrect 4-digit code. Please check and try again.';
        otpErrorMsg.style.display = 'block';
      }
    }
  });
}

// ============================================================
// STEP 3: Courses Offered Page
// ============================================================
const obCoursesGrid = document.getElementById('obCoursesGrid');
const obCourseCategoryFilter = document.getElementById('obCourseCategoryFilter');
const obCourseSearch = document.getElementById('obCourseSearch');
const obSearchClear = document.getElementById('obSearchClear');
const obSelectedCount = document.getElementById('obSelectedCount');
const obSelectedNames = document.getElementById('obSelectedNames');
const obCoursesProceedBtn = document.getElementById('obCoursesProceedBtn');

let activeCourseCategory = 'all';
let courseSearchQuery = '';

function renderOfferedCourses() {
  if (!obCoursesGrid) return;
  obCoursesGrid.innerHTML = '';

  const filtered = OFFERED_COURSES.filter(course => {
    const matchesCategory = activeCourseCategory === 'all' || course.category === activeCourseCategory;
    const matchesSearch = !courseSearchQuery ||
      course.title.toLowerCase().includes(courseSearchQuery) ||
      course.skills.some(s => s.toLowerCase().includes(courseSearchQuery)) ||
      course.desc.toLowerCase().includes(courseSearchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    obCoursesGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p style="font-size: 32px; margin-bottom: 8px;">🔍</p>
        <p>No courses found matching "${courseSearchQuery}".</p>
      </div>
    `;
    updateCoursesSelectionBar();
    return;
  }

  filtered.forEach(course => {
    const isSelected = onboardingState.selectedCourseIds.has(course.id);
    const card = document.createElement('div');
    card.className = `ob-course-card ${isSelected ? 'selected' : ''}`;
    card.setAttribute('data-id', course.id);
    card.tabIndex = 0;

    card.innerHTML = `
      <div class="ob-course-thumb" style="background: ${course.gradient};">
        <span class="ob-course-emoji">${course.emoji}</span>
        <div class="ob-selected-check">✓</div>
      </div>
      <div class="ob-course-body">
        <div class="ob-course-tags">
          <span class="tag tag-${course.category}">${course.categoryLabel}</span>
          <span class="tag tag-hot">${course.badge}</span>
        </div>
        <h3 class="ob-course-title">${course.title}</h3>
        <p class="ob-course-desc">${course.desc}</p>
        <div class="ob-course-skills">
          ${course.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
        <div class="ob-course-meta">
          <span class="rating">⭐ ${course.rating}</span>
          <span>•</span>
          <span>${course.hours} hrs</span>
          <span>•</span>
          <span>${course.students} students</span>
        </div>
        <button type="button" class="ob-course-select-btn">
          <span>${isSelected ? '✓ Selected' : '+ Select Course'}</span>
        </button>
      </div>
    `;

    card.addEventListener('click', () => toggleCourseSelection(course.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCourseSelection(course.id);
      }
    });

    obCoursesGrid.appendChild(card);
  });

  updateCoursesSelectionBar();
}

function toggleCourseSelection(courseId) {
  if (onboardingState.selectedCourseIds.has(courseId)) {
    onboardingState.selectedCourseIds.delete(courseId);
  } else {
    onboardingState.selectedCourseIds.add(courseId);
  }
  renderOfferedCourses();
}

function updateCoursesSelectionBar() {
  const count = onboardingState.selectedCourseIds.size;
  if (obSelectedCount) obSelectedCount.textContent = count;

  if (obSelectedNames) {
    if (count === 0) {
      obSelectedNames.innerHTML = '<span class="empty-hint">Please select at least one course to continue</span>';
    } else {
      obSelectedNames.innerHTML = Array.from(onboardingState.selectedCourseIds).map(id => {
        const c = OFFERED_COURSES.find(item => item.id === id);
        return c ? `
          <span class="selected-course-pill">
            ${c.emoji} ${c.title.split('&')[0].trim()}
            <button type="button" class="pill-remove-btn" data-remove="${c.id}" title="Remove">✕</button>
          </span>
        ` : '';
      }).join('');

      // Wire remove buttons
      obSelectedNames.querySelectorAll('.pill-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const removeId = btn.getAttribute('data-remove');
          onboardingState.selectedCourseIds.delete(removeId);
          renderOfferedCourses();
        });
      });
    }
  }

  if (obCoursesProceedBtn) {
    obCoursesProceedBtn.disabled = count === 0;
  }
}

// Category filter
if (obCourseCategoryFilter) {
  obCourseCategoryFilter.querySelectorAll('.ob-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      obCourseCategoryFilter.querySelectorAll('.ob-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCourseCategory = btn.getAttribute('data-category');
      renderOfferedCourses();
    });
  });
}

// Search input
if (obCourseSearch) {
  obCourseSearch.addEventListener('input', (e) => {
    courseSearchQuery = e.target.value.toLowerCase().trim();
    if (obSearchClear) obSearchClear.style.display = courseSearchQuery ? 'block' : 'none';
    renderOfferedCourses();
  });
}
if (obSearchClear) {
  obSearchClear.addEventListener('click', () => {
    if (obCourseSearch) obCourseSearch.value = '';
    courseSearchQuery = '';
    obSearchClear.style.display = 'none';
    renderOfferedCourses();
  });
}

// Proceed to Step 4
if (obCoursesProceedBtn) {
  obCoursesProceedBtn.addEventListener('click', () => {
    if (onboardingState.selectedCourseIds.size > 0) {
      navigateToView('onboarding', 4);
    }
  });
}

// ============================================================
// STEP 4: Level Assessment ("How much do you known")
// ============================================================
const levelsGrid = document.getElementById('levelsGrid');
const obLevelBackBtn = document.getElementById('obLevelBackBtn');
const obLevelFinishBtn = document.getElementById('obLevelFinishBtn');

function setupLevelStep() {
  if (!levelsGrid) return;
  const cards = levelsGrid.querySelectorAll('.level-card');

  cards.forEach(card => {
    const lvl = card.getAttribute('data-level');
    const isSelected = lvl.toLowerCase() === (onboardingState.skillLevel || 'basic').toLowerCase();
    card.classList.toggle('selected', isSelected);
    card.setAttribute('aria-checked', isSelected ? 'true' : 'false');

    card.onclick = () => {
      cards.forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
      onboardingState.skillLevel = lvl;
      if (obLevelFinishBtn) obLevelFinishBtn.disabled = false;
    };

    card.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    };
  });

  if (obLevelFinishBtn) obLevelFinishBtn.disabled = !onboardingState.skillLevel;
}

if (obLevelBackBtn) {
  obLevelBackBtn.addEventListener('click', () => navigateToView('onboarding', 3));
}

// Finish Onboarding and Launch Student Dashboard
if (obLevelFinishBtn) {
  obLevelFinishBtn.addEventListener('click', () => {
    // Generate Student ID and enrollment date
    onboardingState.studentId = `#SH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    onboardingState.enrollmentDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Store in localStorage
    const toSave = {
      ...onboardingState,
      selectedCourseIds: Array.from(onboardingState.selectedCourseIds)
    };
    localStorage.setItem('skillhub_student_session', JSON.stringify(toSave));

    // Update main navbar user profile badge
    setLoggedInState(onboardingState.name, 'Active Student', '🎓');

    // Transition to Student Dashboard
    navigateToView('dashboard');
    showToast(`🚀 Welcome, ${onboardingState.name}! Your student dashboard is ready.`);
  });
}

// ============================================================
// STEP 5: Student Dashboard Rendering & Interactions
// ============================================================
const dashStudentName = document.getElementById('dashStudentName');
const dashStatCoursesCount = document.getElementById('dashStatCoursesCount');
const dashStatHoursCount = document.getElementById('dashStatHoursCount');
const dashStatLevelBadge = document.getElementById('dashStatLevelBadge');

const dashProfileName = document.getElementById('dashProfileName');
const dashProfileId = document.getElementById('dashProfileId');
const dashProfileContact = document.getElementById('dashProfileContact');
const dashProfileAge = document.getElementById('dashProfileAge');
const dashProfileAddress = document.getElementById('dashProfileAddress');
const dashProfileLevel = document.getElementById('dashProfileLevel');
const dashRoadmapLevelTag = document.getElementById('dashRoadmapLevelTag');
const dashRoadmapSub = document.getElementById('dashRoadmapSub');
const dashRoadmapMilestones = document.getElementById('dashRoadmapMilestones');
const dashEnrolledGrid = document.getElementById('dashEnrolledGrid');

function renderDashboard() {
  const name = onboardingState.name || 'Learner';
  const contact = onboardingState.contact || 'learner@skillhub.com';
  const age = onboardingState.age ? `${onboardingState.age} Years` : '21 Years';
  const address = onboardingState.address || 'Bengaluru, Karnataka';
  const level = onboardingState.skillLevel || 'Basic';
  const id = onboardingState.studentId || '#SH-2026-8842';

  // Populate Hero and Profile Info
  if (dashStudentName) dashStudentName.textContent = name;
  if (dashProfileName) dashProfileName.textContent = name;
  if (dashProfileId) dashProfileId.textContent = `ID: ${id}`;
  if (dashProfileContact) dashProfileContact.textContent = contact;
  if (dashProfileAge) dashProfileAge.textContent = age;
  if (dashProfileAddress) dashProfileAddress.textContent = address;
  if (dashProfileLevel) dashProfileLevel.textContent = level;
  if (dashStatLevelBadge) dashStatLevelBadge.textContent = level;

  // Selected Courses
  const enrolledCourses = OFFERED_COURSES.filter(c => onboardingState.selectedCourseIds.has(c.id));
  const totalHours = enrolledCourses.reduce((sum, c) => sum + c.hours, 0);

  if (dashStatCoursesCount) dashStatCoursesCount.textContent = enrolledCourses.length;
  if (dashStatHoursCount) dashStatHoursCount.textContent = `${totalHours}h`;

  // Render Tailored Roadmap
  if (dashRoadmapLevelTag) dashRoadmapLevelTag.textContent = `${level} Path`;
  if (dashRoadmapSub) dashRoadmapSub.textContent = `Personalized for: "How much do you known" → ${level}`;

  if (dashRoadmapMilestones) {
    const milestones = LEVEL_ROADMAPS[level] || LEVEL_ROADMAPS['Basic'];
    dashRoadmapMilestones.innerHTML = milestones.map(m => `
      <div class="milestone-item">
        <div class="milestone-step-num">${m.step}</div>
        <div class="milestone-info">
          <h4>${m.title}</h4>
          <p>${m.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // Render Enrolled Courses
  if (dashEnrolledGrid) {
    dashEnrolledGrid.innerHTML = '';
    if (enrolledCourses.length === 0) {
      dashEnrolledGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <p style="font-size: 32px; margin-bottom: 8px;">📚</p>
          <p>You haven't enrolled in any courses yet. Click below to add courses.</p>
          <button type="button" class="btn btn-primary" style="margin-top: 14px;" onclick="navigateToView('onboarding', 3)">Browse Catalog</button>
        </div>
      `;
    } else {
      enrolledCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'enrolled-course-card';
        card.innerHTML = `
          <div class="enrolled-card-thumb" style="background: ${course.gradient};">
            <span class="enrolled-emoji">${course.emoji}</span>
          </div>
          <div class="enrolled-card-body">
            <span class="enrolled-category">${course.categoryLabel} · ${course.hours} hrs</span>
            <h3 class="enrolled-title">${course.title}</h3>
            <div class="enrolled-progress-box">
              <div class="enrolled-progress-header">
                <span>Course Progress</span>
                <strong id="progVal-${course.id}">0%</strong>
              </div>
              <div class="enrolled-progress-bar">
                <div class="enrolled-progress-fill" id="progFill-${course.id}" style="width: 0%;"></div>
              </div>
            </div>
            <div class="enrolled-next-lesson">
              <span>▶️</span>
              <span>${course.modules[0] ? course.modules[0].name : 'Module 1: Orientation & Fundamentals'}</span>
            </div>
            <div class="enrolled-card-footer">
              <button type="button" class="btn btn-primary btn-sm start-learning-btn" data-course-id="${course.id}">
                <span>▶ Start Learning</span>
              </button>
              <button type="button" class="btn btn-outline btn-sm syllabus-btn" data-course-id="${course.id}">
                <span>Syllabus</span>
              </button>
            </div>
          </div>
        `;
        dashEnrolledGrid.appendChild(card);
      });

      // Wire Start Learning and Syllabus buttons
      dashEnrolledGrid.querySelectorAll('.start-learning-btn, .syllabus-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const cid = btn.getAttribute('data-course-id');
          openCurriculumModal(cid);
        });
      });
    }
  }
}

// Dashboard Header Navigation
const dashLogoHome = document.getElementById('dashLogoHome');
const dashBackHomeBtn = document.getElementById('dashBackHomeBtn');
const dashBrowseMoreCoursesBtn = document.getElementById('dashBrowseMoreCoursesBtn');
const dashEnrollMoreBtn = document.getElementById('dashEnrollMoreBtn');
const dashLogoutBtn = document.getElementById('dashLogoutBtn');
const dashEditProfileBtn = document.getElementById('dashEditProfileBtn');

[dashLogoHome, dashBackHomeBtn].forEach(btn => {
  if (btn) btn.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToView('landing');
  });
});

[dashBrowseMoreCoursesBtn, dashEnrollMoreBtn].forEach(btn => {
  if (btn) btn.addEventListener('click', () => {
    navigateToView('onboarding', 3);
  });
});

if (dashLogoutBtn) dashLogoutBtn.addEventListener('click', handleGlobalLogout);

if (dashEditProfileBtn) {
  dashEditProfileBtn.addEventListener('click', () => {
    if (obName) obName.value = onboardingState.name;
    if (obContact) obContact.value = onboardingState.contact;
    if (obAge) obAge.value = onboardingState.age;
    if (obAddress) obAddress.value = onboardingState.address;
    navigateToView('onboarding', 1);
  });
}

// Mentor and community buttons in dashboard
const dashBookMentorBtn = document.getElementById('dashBookMentorBtn');
const dashDiscordBtn = document.getElementById('dashDiscordBtn');
if (dashBookMentorBtn) {
  dashBookMentorBtn.addEventListener('click', () => {
    showToast('📅 Mentor booking window opened! 1-on-1 session confirmed for tomorrow 6:00 PM.');
  });
}
if (dashDiscordBtn) {
  dashDiscordBtn.addEventListener('click', () => {
    showToast('💬 Redirecting to SkillHub VIP Student Community on Discord...');
  });
}

// ============================================================
// CURRICULUM MODAL VIEWER
// ============================================================
const curriculumModalOverlay = document.getElementById('curriculumModalOverlay');
const curriculumModalClose = document.getElementById('curriculumModalClose');
const currCloseFooterBtn = document.getElementById('currCloseFooterBtn');
const currSimulateNextBtn = document.getElementById('currSimulateNextBtn');

const currModalEmoji = document.getElementById('currModalEmoji');
const currModalCategory = document.getElementById('currModalCategory');
const currModalTitle = document.getElementById('curriculumModalTitle');
const currModalDesc = document.getElementById('currModalDesc');
const currModalProgressPercent = document.getElementById('currModalProgressPercent');
const currModalProgressBar = document.getElementById('currModalProgressBar');
const currModulesList = document.getElementById('currModulesList');

let activeViewingCourse = null;
const courseProgressMap = {};

function openCurriculumModal(courseId) {
  const course = OFFERED_COURSES.find(c => c.id === courseId);
  if (!course) return;
  activeViewingCourse = course;

  if (currModalEmoji) currModalEmoji.textContent = course.emoji;
  if (currModalCategory) currModalCategory.textContent = `${course.categoryLabel} · ${course.hours} Hours`;
  if (currModalTitle) currModalTitle.textContent = course.title;
  if (currModalDesc) currModalDesc.textContent = course.desc;

  if (!courseProgressMap[course.id]) {
    courseProgressMap[course.id] = { completedIndices: new Set([0]) };
  }

  updateCurriculumModalView();
  if (curriculumModalOverlay) curriculumModalOverlay.classList.add('active');
}

function updateCurriculumModalView() {
  if (!activeViewingCourse || !currModulesList) return;
  const progressObj = courseProgressMap[activeViewingCourse.id] || { completedIndices: new Set() };
  const totalModules = activeViewingCourse.modules.length;
  const completedCount = progressObj.completedIndices.size;
  const percent = Math.round((completedCount / totalModules) * 100);

  if (currModalProgressPercent) currModalProgressPercent.textContent = `${percent}%`;
  if (currModalProgressBar) currModalProgressBar.style.width = `${percent}%`;

  // Update card progress bar in dashboard if visible
  const dashProgVal = document.getElementById(`progVal-${activeViewingCourse.id}`);
  const dashProgFill = document.getElementById(`progFill-${activeViewingCourse.id}`);
  if (dashProgVal) dashProgVal.textContent = `${percent}%`;
  if (dashProgFill) dashProgFill.style.width = `${percent}%`;

  currModulesList.innerHTML = activeViewingCourse.modules.map((m, idx) => {
    const isDone = progressObj.completedIndices.has(idx);
    return `
      <div class="module-row">
        <div class="module-row-left">
          <input type="checkbox" class="module-checkbox" data-idx="${idx}" ${isDone ? 'checked' : ''} />
          <span class="module-name" style="${isDone ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${m.name}</span>
        </div>
        <span class="module-duration">${m.duration}</span>
      </div>
    `;
  }).join('');

  // Wire module checkboxes
  currModulesList.querySelectorAll('.module-checkbox').forEach(box => {
    box.addEventListener('change', () => {
      const idx = parseInt(box.getAttribute('data-idx'), 10);
      if (box.checked) {
        progressObj.completedIndices.add(idx);
      } else {
        progressObj.completedIndices.delete(idx);
      }
      updateCurriculumModalView();
    });
  });
}

function closeCurriculumModal() {
  if (curriculumModalOverlay) curriculumModalOverlay.classList.remove('active');
}

if (curriculumModalClose) curriculumModalClose.addEventListener('click', closeCurriculumModal);
if (currCloseFooterBtn) currCloseFooterBtn.addEventListener('click', closeCurriculumModal);
if (curriculumModalOverlay) {
  curriculumModalOverlay.addEventListener('click', (e) => {
    if (e.target === curriculumModalOverlay) closeCurriculumModal();
  });
}

if (currSimulateNextBtn) {
  currSimulateNextBtn.addEventListener('click', () => {
    if (!activeViewingCourse) return;
    const progressObj = courseProgressMap[activeViewingCourse.id] || { completedIndices: new Set() };
    const total = activeViewingCourse.modules.length;
    for (let i = 0; i < total; i++) {
      if (!progressObj.completedIndices.has(i)) {
        progressObj.completedIndices.add(i);
        break;
      }
    }
    updateCurriculumModalView();
    showToast('✅ Lesson marked complete! Progress updated.');
  });
}

// Check saved session on load
(function restoreSavedSession() {
  try {
    const saved = localStorage.getItem('skillhub_student_session');
    if (saved) {
      const parsed = JSON.parse(saved);
      onboardingState.name = parsed.name || '';
      onboardingState.contact = parsed.contact || '';
      onboardingState.age = parsed.age || '';
      onboardingState.address = parsed.address || '';
      onboardingState.skillLevel = parsed.skillLevel || 'Basic';
      onboardingState.studentId = parsed.studentId || '#SH-2026-8842';
      onboardingState.enrollmentDate = parsed.enrollmentDate || 'September 2026';
      if (Array.isArray(parsed.selectedCourseIds)) {
        onboardingState.selectedCourseIds = new Set(parsed.selectedCourseIds);
      }
      setLoggedInState(onboardingState.name, 'Active Student', '🎓');
    }
  } catch (err) {
    console.error('Failed to restore session:', err);
  }
})();

console.log('%cSkillHub with Get Started Onboarding & Student Dashboard Loaded! 🚀', 'color:#7c3aed;font-size:16px;font-weight:bold;');


