// EC-CIVIL — JavaScript principal

document.addEventListener('DOMContentLoaded', () => {

  // ── Navigation mobile ─────────────────────────
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    // Fermer le menu après un choix
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // ── Barre de navigation : ombre au défilement ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const majOmbre = () => navbar.classList.toggle('scrolled', window.scrollY > 8);
    majOmbre();
    window.addEventListener('scroll', majOmbre, { passive: true });
  }

  // ── Lien actif navbar ─────────────────────────
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.endsWith(page)) a.classList.add('active');
  });

  // ── Année du pied de page ─────────────────────
  const annee = document.getElementById('annee');
  if (annee) annee.textContent = new Date().getFullYear();

  // ── Apparition des éléments au défilement ─────
  const elements = document.querySelectorAll('.apparait');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    elements.forEach((el) => obs.observe(el));
  } else {
    elements.forEach((el) => el.classList.add('visible'));
  }
});
