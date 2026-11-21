/**
 * ZAINAB MAHMOOD — LUXURY PORTFOLIO INTERACTIVITY SCRIPT
 * Blazing fast, vanilla JavaScript, zero bloat.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. PARTICLES & CONSTELLATION CANVAS
  // ==========================================
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 35 : 70;
    const particles = [];
    const mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Color swatches for glowing particles
    const particleColors = [
      'rgba(139, 92, 246, 0.7)', // Purple
      'rgba(59, 130, 246, 0.6)',  // Blue
      'rgba(6, 182, 212, 0.65)',  // Cyan
      'rgba(236, 72, 153, 0.5)'   // Pink
    ];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2.2 + 0.8;
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
        this.vx = (Math.random() - 0.5) * 0.65;
        this.vy = (Math.random() - 0.5) * 0.65;
        this.baseRadius = this.radius;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      update() {
        // Wall Bounce
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse interaction (subtle push)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = dx / distance;
            const directionY = dy / distance;
            this.x += directionX * force * 2.5;
            this.y += directionY * force * 2.5;
            this.radius = this.baseRadius * 1.5;
          } else {
            this.radius = this.baseRadius;
          }
        }

        this.x += this.vx;
        this.y += this.vy;
        this.draw();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function connectParticles() {
      const maxDistance = 115;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => p.update());
      connectParticles();
      requestAnimationFrame(animateCanvas);
    }

    animateCanvas();
  }

  // ==========================================
  // 2. MOUSE GLOW TRACKER (DESKTOP)
  // ==========================================
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // ==========================================
  // 3. STICKY NAVBAR & SCROLL SPY
  // ==========================================
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  function handleScroll() {
    const scrollY = window.pageYOffset;

    // Navbar background on scroll
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Scroll Spy active state
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // initial call

  // Back to top click
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 4. MOBILE DRAWER MENU
  // ==========================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer if clicking outside
  document.addEventListener('click', (e) => {
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      if (!mobileDrawer.contains(e.target) && !menuToggle.contains(e.target)) {
        closeDrawer();
      }
    }
  });

  // ==========================================
  // 5. ENTRANCE FADE-IN ANIMATION
  // ==========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .section-header, .glass-card').forEach((el) => {
    fadeObserver.observe(el);
  });

  // ==========================================
  // 6. 3D TILT EFFECT ON CARDS
  // ==========================================
  const tiltCards = document.querySelectorAll('[data-tilt]');
  if (window.matchMedia('(pointer: fine)').matches) {
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  // ==========================================
  // 7. SERVICE "INQUIRE" AUTO-SELECT DROPDOWN
  // ==========================================
  const serviceInquireLinks = document.querySelectorAll('[data-service-select]');
  const subjectSelect = document.getElementById('userSubject');

  serviceInquireLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const serviceName = link.getAttribute('data-service-select');
      if (subjectSelect && serviceName) {
        // Select matching option
        for (let i = 0; i < subjectSelect.options.length; i++) {
          if (subjectSelect.options[i].value === serviceName) {
            subjectSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  // ==========================================
  // 8. PORTFOLIO FILTERING
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach((item) => {
        const itemCategories = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategories.includes(filterValue)) {
          item.classList.remove('hidden');
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        } else {
          item.classList.add('hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
        }
      });
    });
  });

  // ==========================================
  // 9. CASE STUDY MODAL / LIGHTBOX
  // ==========================================
  const projectDetails = {
    nexus: {
      title: 'Nexus Marketing Labs Identity & Strategic Suite',
      category: 'Graphic Design • Brand Identity & Web Assets',
      image: 'assets/images/nexus-branding.svg',
      client: 'Nexus Marketing Labs (Internal Agency Venture)',
      duration: 'Ongoing Active Venture',
      deliverables: 'Brand Guidelines, Vector Logos, Color Systems, Ad Collateral, Social Graphics',
      description: `
        <p>As the founder and creative director of Nexus Marketing Labs, I established a comprehensive brand identity tailored for high-growth modern commerce.</p>
        <p><strong>Strategic Objectives:</strong> Establish immediate trust, command premium positioning in digital marketing, and provide cohesive visual rules for web copy, paid advertising assets, and customer outreach.</p>
        <p><strong>Execution &amp; Design:</strong> Built from the ground up using Adobe Photoshop, Illustrator, and typography principles with electric purple (#8B5CF6), neon blue, and deep dark backgrounds. Engineered vector logo assets, customer persona decks, and marketing templates resulting in seamless multichannel recognition.</p>
        <p><strong>Impact:</strong> Unified the agency's outward brand image, enhanced proposal conversion rates, and laid the foundation for high-performing client campaigns.</p>
      `
    },
    'meta-ads': {
      title: 'High-ROAS Meta Ads Creative System',
      category: 'Paid Advertising • Facebook & Google Ads',
      image: 'assets/images/meta-ads-campaign.svg',
      client: 'E-Commerce Practice & Client Portfolio',
      duration: 'Performance Sprint',
      deliverables: 'Meta Ad Creatives, Copy Variations, CBO Funnels, Conversion Tracking',
      description: `
        <p>A data-backed advertising campaign engineered to overcome rising ad costs through rigorous creative testing, high-converting copywriting, and audience optimization.</p>
        <p><strong>Key Performance Metrics:</strong></p>
        <ul style="margin: 12px 0 16px 20px; line-height: 1.8; color: #CBD5E1;">
          <li>⚡ <strong>4.6x Average ROAS</strong> achieved across scale campaigns.</li>
          <li>🎯 <strong>42% Reduction in Cost Per Lead (CPL)</strong> via hook testing.</li>
          <li>📈 <strong>1.2M+ Targeted Impressions</strong> with hyper-focused custom audiences.</li>
        </ul>
        <p><strong>Strategy:</strong> Structured modular creative angles (pain point, aspirational, social proof) combined with dynamic video formats and high-converting direct response web copy.</p>
      `
    },
    reels: {
      title: 'Viral Short-Form Comedy Skits & Brand Promotions',
      category: 'Video Editing • Reels & TikTok Optimization',
      image: 'assets/images/viral-reels-editing.svg',
      client: 'Content Creation Projects',
      duration: 'Multi-Campaign Series',
      deliverables: 'Vertical 9:16 Video Edits, Sound Design, Kinetic Subtitles, Retention Hooks',
      description: `
        <p>Creative video production blending humor, fast-paced pacing, and brand integrations designed to captivate algorithmic feeds on Facebook Reels and TikTok.</p>
        <p><strong>Editing Techniques:</strong></p>
        <p>Utilized Adobe Premiere Pro and CapCut with surgical precision: audio leveling, trending sound design, micro-zooms every 2.5 seconds to retain viewer attention, and bold animated kinetic subtitles.</p>
        <p><strong>Results:</strong> Top-performing videos amassed over 450K+ organic views, sparking high comment engagement, shares, and massive organic brand impressions.</p>
      `
    },
    'ai-video': {
      title: 'AI-Powered Product Video Commercials',
      category: 'AI Video Generation • Synthetic Cinematic Media',
      image: 'assets/images/ai-video-showcase.svg',
      client: 'Creative Media Innovations',
      duration: 'Production Prototype',
      deliverables: '4K AI Visuals, Script-to-Video Synthesis, Voiceover, Studio Motion',
      description: `
        <p>Harnessing generative AI tools to craft high-fidelity, photorealistic product commercials at a fraction of traditional production timelines.</p>
        <p><strong>Workflow &amp; Tech Stack:</strong></p>
        <p>Pioneered a specialized pipeline chaining Midjourney for consistent subject generation, Runway Gen-2 for fluid cinematic camera motions, and ElevenLabs for natural, persuasive voiceovers. Finished and color-graded in Premiere Pro.</p>
        <p><strong>Outcome:</strong> Allows rapid production of 15-second and 30-second video variations to stress-test winning creative concepts without expensive on-location shoots.</p>
      `
    },
    shopify: {
      title: 'Turnkey Shopify Store & 500+ Product Imports',
      category: 'E-Commerce Architecture • Shopify Setup',
      image: 'assets/images/shopify-storefront.svg',
      client: 'E-Commerce Store Launch',
      duration: 'Store Setup & Launch',
      deliverables: 'Full Shopify Theme Setup, Automated Product Imports, Collections & CRO',
      description: `
        <p>Comprehensive design and technical rollout of a high-converting Shopify storefront built for high product volumes and friction-free mobile checkout.</p>
        <p><strong>Execution Scope:</strong></p>
        <p>Engineered bulk CSV ingestion for 500+ products with structured variants, pricing tiers, and SEO-optimized product descriptions. Configured mobile-first navigation, trust badges, payment gateways, and automated cart abandonment recovery sequences.</p>
        <p><strong>Outcome:</strong> Fast-loading 99.8% checkout reliability, responsive UX across iOS and Android, and a modern aesthetic aligned with global e-commerce standards.</p>
      `
    },
    carousels: {
      title: 'High-Engagement Social Media Carousel Suite',
      category: 'Graphic Design • Content Strategy & Virality',
      image: 'assets/images/social-media-carousels.svg',
      client: 'Nexus Marketing Labs & Social Channels',
      duration: 'Content Suite',
      deliverables: 'Multi-slide Carousels, Hook Slides, Infographics, Saveable Templates',
      description: `
        <p>Custom multi-slide educational and marketing carousel templates designed specifically to drive high saves, shares, and algorithmic distribution.</p>
        <p><strong>Creative Methodology:</strong></p>
        <p>Designed using proven psychological triggers: bold thumb-stopping slide 1 headline, high-contrast visual typography, actionable bullet points, and seamless slide transitions. Concludes with a high-intent save/share call-to-action.</p>
        <p><strong>Metrics:</strong> Generated over 1.4K+ likes and 890+ bookmark saves on featured series, establishing authority and driving inbound inquiries.</p>
      `
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');

  function openProjectModal(projectId) {
    const data = projectDetails[projectId];
    if (!data || !modalBody || !projectModal) return;

    modalBody.innerHTML = `
      <img src="${data.image}" alt="${data.title}" class="modal-preview-img">
      <div class="modal-content-inner">
        <div class="modal-cat-tag">${data.category}</div>
        <h2 class="modal-heading">${data.title}</h2>
        
        <div class="modal-meta-grid">
          <div class="meta-item">
            <span class="meta-label">Client / Context</span>
            <div class="meta-val">${data.client}</div>
          </div>
          <div class="meta-item">
            <span class="meta-label">Timeline</span>
            <div class="meta-val">${data.duration}</div>
          </div>
          <div class="meta-item">
            <span class="meta-label">Key Deliverables</span>
            <div class="meta-val">${data.deliverables}</div>
          </div>
        </div>

        <div class="modal-body-text">
          ${data.description}
        </div>

        <div class="modal-action-row">
          <a href="#contact" class="btn btn-primary" onclick="document.getElementById('projectModal').classList.remove('open'); document.body.style.overflow = '';">
            <span>Inquire About Similar Project</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>
          <a href="https://wa.me/923276047782?text=${encodeURIComponent('Hi Zainab, I saw your ' + data.title + ' project and want to discuss work!')}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            <span>Discuss on WhatsApp</span>
          </a>
        </div>
      </div>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (projectModal) {
      projectModal.classList.remove('open');
      projectModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Attach preview click listeners
  document.querySelectorAll('.btn-preview-modal').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectKey = btn.getAttribute('data-project');
      openProjectModal(projectKey);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
      closeProjectModal();
    }
  });

  // ==========================================
  // 10. TOAST NOTIFICATION UTILITY
  // ==========================================
  function showToast(message, icon = '✓') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color: #10B981; font-weight: bold;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3600);
  }

  // Copy email buttons
  const copyButtons = [
    document.getElementById('copyEmailBtn'),
    document.getElementById('copyEmailQuickBtn')
  ];

  copyButtons.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => {
        const email = 'hayasulaiman963@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Copied ${email} to clipboard!`);
        }).catch(() => {
          showToast(`Email: ${email}`);
        });
      });
    }
  });

  // ==========================================
  // 11. CONTACT FORM VALIDATION & HANDLING
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitFormBtn');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous error messages
      document.getElementById('nameError').textContent = '';
      document.getElementById('emailError').textContent = '';
      document.getElementById('subjectError').textContent = '';
      document.getElementById('messageError').textContent = '';
      formFeedback.style.display = 'none';

      const name = document.getElementById('userName').value.trim();
      const email = document.getElementById('userEmail').value.trim();
      const subject = document.getElementById('userSubject').value;
      const message = document.getElementById('userMessage').value.trim();

      let isValid = true;

      if (!name || name.length < 2) {
        document.getElementById('nameError').textContent = 'Please enter your full name.';
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      if (!subject) {
        document.getElementById('subjectError').textContent = 'Please select a project subject.';
        isValid = false;
      }

      if (!message || message.length < 10) {
        document.getElementById('messageError').textContent = 'Please write at least 10 characters describing your request.';
        isValid = false;
      }

      if (!isValid) return;

      // Simulate sending animation state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
        <span>Sending Message...</span>
      `;

      // CSS for spinner if needed
      const style = document.createElement('style');
      style.innerHTML = '@keyframes spin { 100% { transform: rotate(360deg); } }';
      document.head.appendChild(style);

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;

        // Feedback Success state
        formFeedback.className = 'form-feedback success';
        formFeedback.style.display = 'block';
        formFeedback.innerHTML = `
          <strong>✓ Thank you, ${name}!</strong> Your message regarding <em>"${subject}"</em> has been processed.
          <br>
          <span style="font-size: 0.88rem; opacity: 0.9;">
            Zainab will contact you directly at <strong>${email}</strong>.
          </span>
          <div style="margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="mailto:hayasulaiman963@gmail.com?subject=${encodeURIComponent('Portfolio Inquiry: ' + subject)}&body=${encodeURIComponent('Hi Zainab,\n\nName: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)}" class="btn btn-glass btn-sm">
              Open in Email App
            </a>
            <a href="https://wa.me/923276047782?text=${encodeURIComponent('Hi Zainab, I sent an inquiry regarding ' + subject + ' from ' + name + ' (' + email + ').')}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
              Ping on WhatsApp
            </a>
          </div>
        `;

        showToast('Message sent successfully!');
        contactForm.reset();
      }, 900);
    });
  }

});
