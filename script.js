/* ============================================
   AL FAWAZ GROUP - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initHeader();
  initMobileMenu();
  initLanguage();
  initScrollReveal();
  initCounters();
  initProjectSlider();
  initProductTabs();
  initContactForm();
  initBackToTop();
  initActiveNav();
});

/* ============ LOADER ============ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const hide = () => loader.classList.add('hidden');
  if (document.readyState === 'complete') {
    setTimeout(hide, 600);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 600));
  }
  setTimeout(hide, 3000); // fallback
}

/* ============ HEADER SCROLL ============ */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============ MOBILE MENU ============ */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;
  const icon = toggle.querySelector('i');

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const isOpen = nav.classList.contains('open');
    icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      icon.className = 'fas fa-bars';
      document.body.style.overflow = '';
    });
  });
}

/* ============ LANGUAGE TOGGLE ============ */
function initLanguage() {
  const langBtn = document.getElementById('langBtn');
  const langLabel = document.getElementById('langLabel');
  const html = document.documentElement;
  if (!langBtn) return;

  const savedLang = localStorage.getItem('alfawaz_lang') || 'ar';
  applyLang(savedLang);

  langBtn.addEventListener('click', () => {
    const current = html.getAttribute('lang');
    applyLang(current === 'ar' ? 'en' : 'ar');
  });

  function applyLang(lang) {
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    if (langLabel) langLabel.textContent = lang === 'ar' ? 'EN' : 'AR';
    localStorage.setItem('alfawaz_lang', lang);

    document.title = lang === 'ar'
      ? 'مجموعة فواز الصغير | حلول الطاقة الشمسية والمقاولات في اليمن - عدن'
      : 'Al Fawaz Group | Solar Energy & Contracting in Yemen - Aden';

    document.querySelectorAll('[data-ar]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) el.textContent = text;
    });

    document.querySelectorAll('[data-ar-ph]').forEach(el => {
      const ph = el.getAttribute(`data-${lang}-ph`);
      if (ph) el.placeholder = ph;
    });
  }
}

/* ============ SCROLL REVEAL ============ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  elements.forEach(el => observer.observe(el));
}

/* ============ COUNTERS ============ */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const animate = (counter) => {
    const target = +counter.dataset.target;
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
      else counter.textContent = target;
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ============ PROJECT SLIDER ============ */
function initProjectSlider() {
  const track = document.getElementById('projectsTrack');
  const prev = document.getElementById('prevProject');
  const next = document.getElementById('nextProject');
  if (!track || !prev || !next) return;

  const scrollAmount = () => {
    const card = track.querySelector('.project-card');
    return card ? card.offsetWidth + 24 : 350;
  };

  prev.addEventListener('click', () => {
    const dir = document.documentElement.dir === 'rtl' ? 1 : -1;
    track.scrollBy({ left: scrollAmount() * dir, behavior: 'smooth' });
  });
  next.addEventListener('click', () => {
    const dir = document.documentElement.dir === 'rtl' ? -1 : 1;
    track.scrollBy({ left: scrollAmount() * dir, behavior: 'smooth' });
  });
}

/* ============ PRODUCT TABS ============ */
function initProductTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${target}`)?.classList.add('active');
    });
  });
}

/* ============ CONTACT FORM ============ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const lang = document.documentElement.getAttribute('lang');
    const data = new FormData(form);
    const name = (data.get('name') || '').trim();
    const phone = (data.get('phone') || '').trim();
    const email = (data.get('email') || '').trim();
    const service = data.get('service');
    const message = (data.get('message') || '').trim();

    status.className = 'form-status';
    status.textContent = '';

    if (name.length < 3) return showStatus(lang === 'ar' ? 'يرجى إدخال اسم صحيح' : 'Please enter a valid name', 'error');
    if (!/^[\d\s+\-()]{7,20}$/.test(phone)) return showStatus(lang === 'ar' ? 'يرجى إدخال رقم هاتف صحيح' : 'Please enter a valid phone', 'error');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showStatus(lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email', 'error');
    if (!service) return showStatus(lang === 'ar' ? 'يرجى اختيار نوع الخدمة' : 'Please select a service', 'error');
    if (message.length < 10) return showStatus(lang === 'ar' ? 'الرسالة قصيرة جداً' : 'Message too short', 'error');

    showStatus(lang === 'ar' ? '✓ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً' : '✓ Message sent successfully! We will contact you soon', 'success');
    form.reset();
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = `form-status ${type}`;
    if (type === 'success') {
      setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 6000);
    }
  }
}

/* ============ BACK TO TOP ============ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  const onScroll = () => btn.classList.toggle('show', window.scrollY > 500);
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============ ACTIVE NAV ============ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
}