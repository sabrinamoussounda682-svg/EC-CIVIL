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

  // ── Onglets documents légaux ──────────────────
  window.showDoc = function(type) {
    document.querySelectorAll('.doc-panel').forEach(p => p.hidden = true);
    document.querySelectorAll('.doc-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    const panel = document.getElementById('doc-' + type);
    const btn   = document.getElementById('btn-' + type);
    if (panel) { panel.hidden = false; }
    if (btn)   { btn.classList.add('active'); btn.setAttribute('aria-selected', 'true'); }
    try { sessionStorage.setItem('ec-doc', type); } catch (_) {}
  };

  // Restaurer l'onglet depuis l'URL ou la session
  if (document.querySelector('.doc-panel')) {
    let memorise = null;
    try { memorise = sessionStorage.getItem('ec-doc'); } catch (_) {}
    const params = new URLSearchParams(window.location.search);
    const doc    = params.get('doc') || memorise || 'cgu';
    if (document.getElementById('doc-' + doc)) showDoc(doc);
  }

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
