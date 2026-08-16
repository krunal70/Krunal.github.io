/**
 * KRUNAL DUBEY - PORTFOLIO INTERACTIVE CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCanvasBackground();
  initScrollProgress();
  initScrollReveals();
  initNavHighlighting();
  initSmoothScrolling();
  initMobileNav();
  initSkillFilters();
  initProjectFilters();
  initProjectModals();
  initGitHubStats();
  initContactForm();
  initBackToTop();
});

/* ==========================================
   1. THEME SWITCHER (Dark/Light Mode)
   ========================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const icon = toggleBtn ? toggleBtn.querySelector('i') : null;
  const savedTheme = localStorage.getItem('kd_portfolio_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('kd_portfolio_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!icon) return;
    if (theme === 'light') {
      icon.className = 'fas fa-moon';
      toggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      icon.className = 'fas fa-sun';
      toggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }
}

/* ==========================================
   2. DYNAMIC CANVAS BACKGROUND PARTICLES
   ========================================== */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 25), 45);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const colorRGB = isLight ? '2, 132, 199' : '56, 189, 248';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colorRGB}, ${p.alpha})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${colorRGB}, ${0.15 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================
   3. SCROLL PROGRESS BAR
   ========================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    progressBar.style.width = `${scrolled}%`;
  });
}

/* ==========================================
   4. SCROLL REVEAL ANIMATIONS
   ========================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================
   5. NAVBAR ACTIVE LINK HIGHLIGHTING
   ========================================== */
function initNavHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================
   5b. SMOOTH ANCHOR LINK INTERCEPTOR
   ========================================== */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================
   6. MOBILE NAV DRAWER
   ========================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const closeBtn = document.getElementById('mobile-close-btn');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openMenu() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================
   7. SKILL CATEGORY FILTERING
   ========================================== */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ==========================================
   8. PROJECT CATEGORY FILTERING
   ========================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-tab-btn');
  const projectCards = document.querySelectorAll('.project-card-wrap');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });
}

/* ==========================================
   9. PROJECT MODAL DRAWER
   ========================================== */
const projectData = {
  'fleet-management': {
    title: 'Fleet Management System (Mobile)',
    company: 'Maruti Techlabs',
    tech: ['React Native', 'Expo', 'Redux Toolkit', 'REST APIs', 'Async Storage'],
    overview: 'Shipped a cross-platform production mobile application for fleet administrators and drivers to conduct real-time vehicle inspections, manage DVIRs (Driver Vehicle Inspection Reports), and schedule preventive maintenance.',
    highlights: [
      'Built a cross-platform mobile app enabling fleet administrators and drivers to manage inspections, DVIRs, and preventive maintenance in real time.',
      'Added cost-per-mile summaries, fuel tax reporting, meter readings, and fuel-event tracking to support regulatory compliance and reporting.',
      'Integrated real-time, asynchronous API data updates to provide accurate live fleet status for decision making.'
    ],
    link: '#',
    github: 'https://github.com/krunal70'
  },
  'cloud-security': {
    title: 'Cloud Security & Audit Management Platform',
    company: 'Maruti Techlabs',
    tech: ['React.js', 'Next.js 16', 'NextAuth', 'Google OAuth', 'ShadCN/UI', 'Tailwind CSS'],
    overview: 'Independently architected and built an enterprise cloud security and audit management platform from scratch without predefined Figma designs, later leading its migration from React.js to Next.js 16 for optimal SSR performance.',
    highlights: [
      "Independently developed the platform's frontend from scratch — including dashboard, audit logging, and authentication flows — then led its migration from React.js to Next.js 16 for improved performance and maintainability.",
      'Set up secure authentication and session management using NextAuth and Google OAuth, including Forgot/Reset Password and multi-workspace user invitation flows.',
      'Created a reusable UI component library with ShadCN/UI (including data tables) and introduced pagination, improving consistency, development speed, and performance on large datasets.'
    ],
    link: '#',
    github: 'https://github.com/krunal70'
  },
  'maruti-corporate': {
    title: 'Maruti Techlabs Corporate Platform & Assessment Engine',
    company: 'Maruti Techlabs',
    tech: ['Next.js', 'React.js', 'AWS Lambda', 'Lambda@Edge', 'Amazon SES', 'Sanity CMS', 'Technical SEO'],
    overview: 'Revamped the company homepage with modern UI/UX practices and launched an interactive multi-step data-maturity assessment tool with dynamic form handling, validation logic, and real-time scoring.',
    highlights: [
      'Revamped the company homepage with modern UI/UX practices, standardizing typography and layout for consistent, responsive, cross-browser presentation.',
      'Engineered an interactive multi-step assessment tool with dynamic form handling, validation logic, and real-time scoring, shipped with zero functional issues reported after production deployment.',
      'Produced new service pages and CMS-driven AI content pages using reusable, scalable component architecture.',
      'Migrated the site from GCP to AWS, building AWS Lambda functions for form submissions and transactional email via Amazon SES, plus Lambda@Edge functions for URL redirects and rewrites, with the codebase restructured into static frontend and serverless backend modules.',
      'Resolved Google indexing and crawling issues via custom sitemap generation to improve technical SEO.'
    ],
    link: 'https://marutitech.com/',
    github: 'https://github.com/krunal70'
  },
  'car-marketplace': {
    title: 'Car Marketplace Mobile App',
    company: 'Personal Project',
    tech: ['React Native', 'Expo', 'Redux Toolkit', 'Google Auth', 'Vector Icons'],
    overview: 'Architected and built a vehicle marketplace application from scratch supporting buyer, seller, and dealership workflows.',
    highlights: [
      'Built a vehicle marketplace app from scratch with standard and Google authentication for secure user onboarding.',
      'Designed home, sale, and buy screens, plus an account module supporting profile editing, package management, and vehicle listing management.'
    ],
    link: '#',
    github: 'https://github.com/krunal70'
  },
  'worker-management': {
    title: 'Worker & Workforce Management Platform',
    company: 'Personal Project',
    tech: ['React.js', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    overview: 'End-to-end workforce management platform supporting worker, agency, client, department, and job administration.',
    highlights: [
      'Architected an end-to-end workforce management platform supporting worker, agency, client, department, and job administration.',
      'Enabled worker–client association, attendance tracking, and payroll management functionality.'
    ],
    link: '#',
    github: 'https://github.com/krunal70'
  },
  'mail-merge': {
    title: 'Mail Merge & Document Automation Tool',
    company: 'Open Source',
    tech: ['Python', 'File I/O', 'String Parsing'],
    overview: 'Python automation tool designed to streamline bulk document personalizations and template name replacement.',
    highlights: [
      'Automates string matching and file creation for mass email/letter distributions.',
      'Efficient memory handling for large text template files.'
    ],
    link: 'https://github.com/krunal70/100days-of-code/tree/master/Mail%20Merge%20Project%20Start',
    github: 'https://github.com/krunal70/100days-of-code/tree/master/Mail%20Merge%20Project%20Start'
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalCompany = document.getElementById('modal-company');
  const modalTech = document.getElementById('modal-tech');
  const modalOverview = document.getElementById('modal-overview');
  const modalHighlights = document.getElementById('modal-highlights');
  const modalGithub = document.getElementById('modal-github');

  if (!modalOverlay) return;

  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];

      if (data) {
        modalTitle.textContent = data.title;
        modalCompany.textContent = data.company;
        modalOverview.textContent = data.overview;
        modalGithub.setAttribute('href', data.github);

        modalTech.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
        modalHighlights.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join('');

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

/* ==========================================
   10. LIVE GITHUB API INTEGRATION
   ========================================== */
async function initGitHubStats() {
  const username = 'krunal70';
  const repoCountEl = document.getElementById('gh-repo-count');
  const followerCountEl = document.getElementById('gh-follower-count');
  const repoContainer = document.getElementById('gh-featured-repos');

  const fallbackRepos = [
    { name: 'Krunal.github.io', description: 'Personal modern portfolio website built with React, Next.js design patterns, and HTML5/CSS3.', stargazers_count: 5, language: 'HTML/CSS/JS', html_url: 'https://github.com/krunal70/Krunal.github.io' },
    { name: 'Password_Manager', description: 'Python Tkinter application for secure password generation and local clipboard storage.', stargazers_count: 8, language: 'Python', html_url: 'https://github.com/krunal70/Password_Manager' },
    { name: '100days-of-code', description: 'Mail Merge automation project and data structure solutions repository.', stargazers_count: 12, language: 'Python', html_url: 'https://github.com/krunal70/100days-of-code' },
    { name: 'Worker-Management', description: 'Workforce administration and payroll management platform.', stargazers_count: 4, language: 'JavaScript', html_url: 'https://github.com/krunal70' }
  ];

  function renderRepos(repos) {
    if (!repoContainer) return;
    repoContainer.innerHTML = repos.map(repo => `
      <div class="repo-card">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <i class="far fa-bookmark" style="color:var(--accent-cyan);"></i>
            <span style="font-size:0.75rem; color:var(--text-muted);"><i class="far fa-star"></i> ${repo.stargazers_count}</span>
          </div>
          <h4 style="font-size:1rem; margin-bottom:0.4rem; color:var(--text-primary);">${repo.name}</h4>
          <p style="font-size:0.825rem; color:var(--text-secondary); margin-bottom:1rem;">${repo.description || 'Public GitHub repository'}</p>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:var(--text-muted);">
          <span><i class="fas fa-circle" style="color:var(--accent-cyan); font-size:0.6rem;"></i> ${repo.language || 'Code'}</span>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-cyan); text-decoration:none;">View <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    `).join('');
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (userRes.ok) {
      const userData = await userRes.json();
      if (repoCountEl) repoCountEl.textContent = userData.public_repos || '15+';
      if (followerCountEl) followerCountEl.textContent = userData.followers || '10+';
    }

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`);
    if (reposRes.ok) {
      const repos = await reposRes.json();
      renderRepos(repos);
    } else {
      renderRepos(fallbackRepos);
    }
  } catch (err) {
    renderRepos(fallbackRepos);
  }
}

/* ==========================================
   11. CONTACT FORM VALIDATION & FEEDBACK
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Simulate sending network request
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      showStatus('Thank you! Your message has been sent successfully. Krunal will get back to you shortly.', 'success');
    }, 1200);
  });

  function showStatus(text, type) {
    if (!statusMsg) return;
    statusMsg.textContent = text;
    statusMsg.className = `form-status ${type}`;
    setTimeout(() => {
      statusMsg.className = 'form-status';
    }, 6000);
  }
}

/* ==========================================
   12. BACK TO TOP BUTTON
   ========================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
