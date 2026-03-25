

document.addEventListener('DOMContentLoaded', () => {

  /* ────────────────────────────────────────
     THEME SYSTEM (Multi-theme + Mode)
  ──────────────────────────────────────── */
  const html = document.documentElement;
  const themePanel = document.getElementById('themePanel');
  const themePanelToggle = document.getElementById('themePanelToggle');
  const swatches = document.querySelectorAll('.swatch');
  const modeDark = document.getElementById('modeDark');
  const modeLight = document.getElementById('modeLight');

  const THEMES = {
    dark:   { base: 'dark',   name: 'Classic Dark' },
    light:  { base: 'light',  name: 'Light Ivory' },
    forest: { base: 'forest', name: 'Forest Dark' },
    slate:  { base: 'slate',  name: 'Midnight Blue' },
    rose:   { base: 'rose',   name: 'Rose Noir' },
    sand:   { base: 'sand',   name: 'Sand Light' },
  };

  const darkThemes = ['dark', 'forest', 'slate', 'rose'];
  const lightThemes = ['light', 'sand'];

  let currentTheme = localStorage.getItem('aura-theme') || 'dark';

  const applyTheme = (theme) => {
    currentTheme = theme;
    html.setAttribute('data-theme', theme);
    localStorage.setItem('aura-theme', theme);

    // Update swatch active states
    swatches.forEach(s => s.classList.toggle('active', s.dataset.theme === theme));

    // Update mode buttons
    const isDark = darkThemes.includes(theme);
    modeDark.classList.toggle('active', isDark);
    modeLight.classList.toggle('active', !isDark);
  };

  applyTheme(currentTheme);

  // Panel toggle
  themePanelToggle.addEventListener('click', () => {
    themePanel.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!themePanel.contains(e.target)) themePanel.classList.remove('open');
  });

  // Swatch click
  swatches.forEach(s => {
    s.addEventListener('click', () => applyTheme(s.dataset.theme));
  });

  // Mode buttons
  modeDark.addEventListener('click', () => {
    if (!darkThemes.includes(currentTheme)) applyTheme('dark');
  });
  modeLight.addEventListener('click', () => {
    if (!lightThemes.includes(currentTheme)) applyTheme('light');
  });

  /* ────────────────────────────────────────
     STICKY NAVBAR
  ──────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  let lastY = 0;

  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    lastY = y;

    // Back to top visibility
    backToTop.classList.toggle('visible', y > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ────────────────────────────────────────
     MOBILE MENU
  ──────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  const openMenu = () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ────────────────────────────────────────
     HERO SLIDESHOW
  ──────────────────────────────────────── */
  const slides = document.querySelectorAll('.hero-slide');
  const slideDots = document.querySelectorAll('.slide-dot');
  let currentSlide = 0;
  let slideInterval;

  const goToSlide = (idx) => {
    slides[currentSlide].classList.remove('active');
    slideDots[currentSlide]?.classList.remove('active');
    currentSlide = (idx + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    slideDots[currentSlide]?.classList.add('active');
  };

  const startSlideshow = () => {
    slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5500);
  };
  const resetSlideshow = () => {
    clearInterval(slideInterval);
    startSlideshow();
  };

  slideDots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); resetSlideshow(); });
  });

  startSlideshow();

  /* ────────────────────────────────────────
     SCROLL REVEAL
  ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ────────────────────────────────────────
     PROJECT FILTER
  ──────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectItems.forEach((item, i) => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.style.transition = `opacity 0.4s ${i * 0.05}s, transform 0.4s ${i * 0.05}s`;
        if (match) {
          item.style.opacity = '';
          item.style.transform = '';
          item.style.display = '';
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (btn.classList.contains('active') && filter !== 'all' && item.dataset.category !== filter) {
              item.style.display = 'none';
            }
          }, 450);
        }
      });

      // Re-show hidden items that match
      setTimeout(() => {
        projectItems.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          if (match && item.style.display === 'none') {
            item.style.display = '';
            requestAnimationFrame(() => {
              item.style.opacity = '';
              item.style.transform = '';
            });
          }
        });
      }, 460);
    });
  });

  /* ────────────────────────────────────────
     TESTIMONIALS SLIDER
  ──────────────────────────────────────── */
  const testimonialsTrack = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testimPrev');
  const nextBtn = document.getElementById('testimNext');
  const tDots = document.querySelectorAll('.t-dot');
  let currentTestim = 0;

  const getCard = () => testimonialsTrack.querySelector('.testimonial-card');
  const getCardWidth = () => {
    const card = getCard();
    if (!card) return 0;
    return card.offsetWidth + 24; // gap
  };

  const scrollTo = (idx) => {
    const total = tDots.length;
    currentTestim = (idx + total) % total;
    const scrollLeft = currentTestim * getCardWidth();
    testimonialsTrack.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    tDots.forEach((d, i) => d.classList.toggle('active', i === currentTestim));
  };

  prevBtn?.addEventListener('click', () => scrollTo(currentTestim - 1));
  nextBtn?.addEventListener('click', () => scrollTo(currentTestim + 1));
  tDots.forEach((d, i) => d.addEventListener('click', () => scrollTo(i)));

  testimonialsTrack?.addEventListener('scroll', () => {
    const idx = Math.round(testimonialsTrack.scrollLeft / getCardWidth());
    tDots.forEach((d, i) => d.classList.toggle('active', i === idx));
    currentTestim = idx;
  }, { passive: true });

  /* ────────────────────────────────────────
     CONTACT FORM
  ──────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      const origHTML = btn.innerHTML;
      btn.innerHTML = '<span>Sending…</span>';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      await new Promise(r => setTimeout(r, 1600));

      btn.innerHTML = '<span>✓ Message Sent! We\'ll call you within 2 hours.</span>';
      btn.style.background = '#2E7D52';
      btn.style.opacity = '1';
      contactForm.reset();

      setTimeout(() => {
        btn.innerHTML = origHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    });
  }

  /* ────────────────────────────────────────
     SMOOTH ANCHOR SCROLL
  ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(html).getPropertyValue('--nav-h')) || 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* ────────────────────────────────────────
     NUMBER COUNTER
  ──────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 2000;
      let startTime = null;

      const step = (ts) => {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / dur, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * end) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ────────────────────────────────────────
     BACK TO TOP
  ──────────────────────────────────────── */
  const backToTop = document.getElementById('backToTop');
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ────────────────────────────────────────
     NEWSLETTER FORM
  ──────────────────────────────────────── */
  const newsletterBtn = document.querySelector('.newsletter-btn');
  const newsletterInput = newsletterBtn?.previousElementSibling;
  newsletterBtn?.addEventListener('click', () => {
    if (!newsletterInput?.value.includes('@')) {
      newsletterInput?.focus();
      return;
    }
    newsletterBtn.innerHTML = '<span>✓</span>';
    newsletterBtn.style.background = '#2E7D52';
    setTimeout(() => {
      newsletterBtn.innerHTML = '<span>→</span>';
      newsletterBtn.style.background = '';
      if (newsletterInput) newsletterInput.value = '';
    }, 3000);
  });

  /* ────────────────────────────────────────
     PARALLAX HERO
  ──────────────────────────────────────── */
  const heroSlides = document.getElementById('heroSlides');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (heroSlides && window.scrollY < window.innerHeight) {
          heroSlides.style.transform = `translateY(${window.scrollY * 0.3}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ────────────────────────────────────────
     SERVICE CARDS — Touch Support
  ──────────────────────────────────────── */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('touchstart', () => {
      card.classList.add('touch-hover');
    }, { passive: true });
    card.addEventListener('touchend', () => {
      setTimeout(() => card.classList.remove('touch-hover'), 1200);
    }, { passive: true });
  });

  /* ────────────────────────────────────────
     IMAGE LAZY LOAD (native fallback polyfill)
  ──────────────────────────────────────── */
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
  } else {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          if (img.dataset.src) img.src = img.dataset.src;
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imgObserver.observe(img));
  }

});
