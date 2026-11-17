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

  // ── Documents légaux : onglets, sommaire, progression ──
  const ENTETES = {
    cgu: {
      titre: "Conditions générales d'utilisation",
      description: "Les règles d'utilisation de l'application EC-Civil : services, compte, paiement, obligations et responsabilités.",
    },
    confidentialite: {
      titre: 'Politique de confidentialité',
      description: 'Quelles données EC-Civil collecte, pourquoi, avec qui elles sont partagées, combien de temps elles sont gardées et comment elles sont protégées.',
    },
  };
  let observateurSommaire = null;

  // Sommaire construit à partir des articles du document affiché
  const construireSommaire = (panel) => {
    const liste = document.getElementById('sommaireListe');
    if (!liste || !panel) return;
    liste.innerHTML = '';
    if (observateurSommaire) observateurSommaire.disconnect();

    const articles = [...panel.querySelectorAll('.doc-article')];
    const liens = new Map();
    articles.forEach((article, i) => {
      if (!article.id) article.id = `${panel.id}-art-${i + 1}`;
      const titre = article.querySelector('h3')?.textContent.trim() || `Partie ${i + 1}`;
      const numero = (article.querySelector('.doc-article-num')?.textContent.match(/\d+/) || [''])[0];
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${article.id}`;
      a.innerHTML = `<i>${numero || '·'}</i><span></span>`;
      a.querySelector('span').textContent = titre;
      a.addEventListener('click', () => {
        // Sur mobile, le sommaire se replie après un choix
        if (window.innerWidth <= 1024) document.getElementById('sommaireBoite')?.removeAttribute('open');
      });
      li.appendChild(a);
      liste.appendChild(li);
      liens.set(article, a);
    });

    if ('IntersectionObserver' in window) {
      observateurSommaire = new IntersectionObserver((entrees) => {
        entrees.forEach((e) => {
          if (!e.isIntersecting) return;
          liens.forEach((a) => a.classList.remove('actif'));
          liens.get(e.target)?.classList.add('actif');
        });
      }, { rootMargin: '-150px 0px -65% 0px' });
      articles.forEach((a) => observateurSommaire.observe(a));
    }

    // Temps de lecture estimé (≈ 220 mots par minute)
    const mots = panel.textContent.trim().split(/\s+/).length;
    const temps = document.getElementById('tempsLecture');
    if (temps) temps.textContent = `Lecture : ${Math.max(1, Math.round(mots / 220))} min`;
  };

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

    const entete = ENTETES[type];
    if (entete) {
      const titre = document.getElementById('titreDocument');
      const desc = document.getElementById('descriptionDocument');
      if (titre) titre.textContent = entete.titre;
      if (desc) desc.textContent = entete.description;
      document.title = `${entete.titre} — EC-Civil`;
    }
    construireSommaire(panel);
    try { sessionStorage.setItem('ec-doc', type); } catch (_) {}
    try { history.replaceState(null, '', `?doc=${type}`); } catch (_) {}
  };

  // Barre de progression de lecture
  const barre = document.getElementById('progressionLecture');
  if (barre) {
    const majProgression = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      barre.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
    };
    majProgression();
    window.addEventListener('scroll', majProgression, { passive: true });
    window.addEventListener('resize', majProgression);
  }

  // Sommaire replié par défaut sur mobile
  if (window.innerWidth <= 1024) document.getElementById('sommaireBoite')?.removeAttribute('open');

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
