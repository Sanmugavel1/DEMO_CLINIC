document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const closeMenu = () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* ---------- Appointment modal ---------- */
  const overlay = document.getElementById('modalOverlay');
  const openTriggers = document.querySelectorAll('[data-open-modal]');
  const closeBtn = document.getElementById('modalClose');
  const doneBtn = document.getElementById('modalDone');
  const formWrap = document.getElementById('modalFormWrap');
  const successWrap = document.getElementById('modalSuccess');
  const apptForm = document.getElementById('apptForm');

  const openModal = () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const resetModal = () => {
    formWrap.style.display = '';
    successWrap.classList.remove('show');
    apptForm.reset();
  };

  const closeModal = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(resetModal, 300);
  };

  openTriggers.forEach(btn => btn.addEventListener('click', openModal));
  closeBtn.addEventListener('click', closeModal);
  doneBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  apptForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formWrap.style.display = 'none';
    successWrap.classList.add('show');
  });

  /* ---------- Graceful image fallback ---------- */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.closest('.hero-image-frame, .about-image-frame')?.style.setProperty(
        'background', 'linear-gradient(150deg, var(--navy), var(--navy-deep))'
      );
      img.style.display = 'none';
    }, { once: true });
  });

});
