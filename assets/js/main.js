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
  }

  // ── Lien actif navbar ─────────────────────────
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.endsWith(page)) a.classList.add('active');
  });

  // ── Smooth scroll ancres ──────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Onglets documents légaux ──────────────────
  window.showDoc = function(type) {
    document.querySelectorAll('.doc-panel').forEach(p => p.hidden = true);
    document.querySelectorAll('.doc-btn').forEach(b => b.classList.remove('active'));
    const panel = document.getElementById('doc-' + type);
    const btn   = document.getElementById('btn-' + type);
    if (panel) { panel.hidden = false; }
    if (btn)   { btn.classList.add('active'); }
    sessionStorage.setItem('ec-doc', type);
    if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Restaurer l'onglet depuis URL ou session
  const params = new URLSearchParams(window.location.search);
  const doc    = params.get('doc') || sessionStorage.getItem('ec-doc') || 'cgu';
  if (document.getElementById('doc-' + doc)) showDoc(doc);

  // ── Animation entrée sections ─────────────────
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.feature-card, .securite-item, .tarif-card, .step').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
      obs.observe(el);
    });
  }
});
