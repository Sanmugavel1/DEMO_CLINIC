document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Launch screen ---------- */
  const launchScreen = document.getElementById('launchScreen');
  const launchQuote = document.getElementById('launchQuote');
  const launchSkip = document.getElementById('launchSkip');

  const quotes = [
    "A confident smile opens more doors than words ever could.",
    "Behind every great smile is a little care, and a lot of trust.",
    "We don't just treat teeth — we help you smile without hesitation.",
    "Good dental care is quiet, consistent, and life-changing.",
    "Your smile deserves the same care as the rest of your health.",
    "A healthy smile is always in style."
  ];

  if (launchScreen && !launchScreen.classList.contains('skip')) {
    let qIndex = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dismissLaunch = () => {
      clearInterval(quoteTimer);
      clearTimeout(autoDismissTimer);
      launchScreen.classList.add('leaving');
      document.documentElement.classList.remove('launch-lock');
      sessionStorage.setItem('pattathLaunchSeen', '1');
      setTimeout(() => launchScreen.remove(), 700);
    };

    const cycleQuote = () => {
      qIndex = (qIndex + 1) % quotes.length;
      launchQuote.classList.add('fade-out');
      setTimeout(() => {
        launchQuote.textContent = quotes[qIndex];
        launchQuote.classList.remove('fade-out');
      }, 400);
    };

    const quoteTimer = reduceMotion ? null : setInterval(cycleQuote, 2600);
    const autoDismissTimer = setTimeout(dismissLaunch, reduceMotion ? 1200 : 7200);

    launchSkip.addEventListener('click', dismissLaunch);
    launchScreen.addEventListener('click', (e) => {
      if (e.target === launchScreen) dismissLaunch();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') dismissLaunch();
    }, { once: true });
  } else if (launchScreen) {
    launchScreen.remove();
  }

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

  /* ---------- Count-up on years of experience ---------- */
  const countEls = document.querySelectorAll('.exp-num');
  const reduceMotionCount = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (reduceMotionCount) { el.textContent = target; return; }
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (countEls.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    countEls.forEach(el => countObserver.observe(el));
  }

  /* ---------- Graceful image fallback ---------- */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.closest('.hero-image-frame, .about-image-frame, .doctor-photo')?.style.setProperty(
        'background', 'linear-gradient(150deg, var(--navy), var(--navy-deep))'
      );
      img.style.display = 'none';
    }, { once: true });
  });

});
