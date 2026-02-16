/* ==========================================
   StreetCafe — JavaScript
   Features:
   - Navbar scroll effect
   - Mobile menu toggle
   - Smooth scroll & active link
   - Fade-in on scroll (Intersection Observer)
   - Counter animation
   - Menu filter
   - Back to top
   - Hero particles
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Elements ----
  const navbar      = document.getElementById('navbar');
  const navToggle   = document.getElementById('navToggle');
  const navMenu     = document.getElementById('navMenu');
  const navLinks    = document.querySelectorAll('.nav-link');
  const backToTop   = document.getElementById('backToTop');
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const menuGrid    = document.getElementById('menuGrid');
  let menuCards     = [];
  const fadeEls     = document.querySelectorAll('.fade-in');
  const statNumbers = document.querySelectorAll('.stat-number');

  // ---- Navbar scroll ----
  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    backToTop.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  // ---- Mobile menu toggle ----
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // ---- Close mobile menu on link click ----
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---- Active link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const setActiveLink = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  };
  window.addEventListener('scroll', setActiveLink);

  // ---- Fade-in on scroll (Intersection Observer) ----
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  fadeEls.forEach(el => fadeObserver.observe(el));

  // ---- Counter animation ----
  let countersStarted = false;
  const animateCounters = () => {
    statNumbers.forEach(num => {
      const target = +num.getAttribute('data-target');
      const duration = 2000;
      const start = performance.now();
      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuart
        const ease = 1 - Math.pow(1 - progress, 4);
        num.textContent = Math.floor(ease * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };

  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounters();
      }
    },
    { threshold: 0.5 }
  );
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) statsObserver.observe(statsEl);

  // ---- Render menu from data.js ----
  const renderMenuCards = () => {
    if (!menuGrid || !Array.isArray(window.menuData)) return;
    menuGrid.innerHTML = window.menuData.map(item => {
      const badge = item.badge
        ? `<span class="menu-badge ${item.badgeClass || ''}">${item.badge}</span>`
        : '';

      return `
        <div class="menu-card fade-in" data-category="${item.category}">
          <div class="menu-card-img">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
            ${badge}
          </div>
          <div class="menu-card-body">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="menu-footer">
              <span class="menu-price">${item.price}</span>
              <button class="menu-order"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    menuCards = Array.from(menuGrid.querySelectorAll('.menu-card'));
    menuCards.forEach(el => fadeObserver.observe(el));
  };

  renderMenuCards();

  // ---- Menu filter ----
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      menuCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || category === filter;

        if (show) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 350);
        }
      });
    });
  });

  // ---- Back to top ----
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Hero particles ----
  const particleContainer = document.getElementById('heroParticles');
  if (particleContainer) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.width = (Math.random() * 4 + 2) + 'px';
      p.style.height = p.style.width;
      p.style.animationDelay = (Math.random() * 8) + 's';
      p.style.animationDuration = (Math.random() * 6 + 5) + 's';
      particleContainer.appendChild(p);
    }
  }

  // ---- Smooth scroll for all anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- Menu order button pulse ----
  const bindMenuOrderButtons = () => {
    document.querySelectorAll('.menu-order').forEach(btn => {
      btn.addEventListener('click', function () {
        this.style.transform = 'scale(1.3) rotate(90deg)';
        this.style.background = '#7C9A6E';
        const icon = this.querySelector('i');
        if (icon) {
          icon.className = 'fa-solid fa-check';
        }
        setTimeout(() => {
          this.style.transform = '';
          this.style.background = '';
          if (icon) icon.className = 'fa-solid fa-plus';
        }, 1200);
      });
    });
  };

  bindMenuOrderButtons();

  // ---- Newsletter form feedback ----
  const nlForm = document.querySelector('.newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = nlForm.querySelector('input');
      if (input && input.value.trim()) {
        const original = input.value;
        input.value = 'Thanks for subscribing! ☕';
        input.disabled = true;
        setTimeout(() => {
          input.value = '';
          input.disabled = false;
        }, 2500);
      }
    });
  }

});
