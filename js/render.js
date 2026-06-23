/* ============================================================
   SHINDOKAI-KAN I-S-L — Fonctions de rendu partagées
   ============================================================ */

/* ============ XSS ============ */
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ============ NAVIGATION ============ */
function renderNav(activePage) {
  const club = getSection('club');
  const pages = [
    { href: 'discipline.html',  label: 'La discipline', key: 'discipline' },
    { href: 'coachs.html',      label: 'Coachs',        key: 'coachs' },
    { href: 'cours.html',       label: 'Cours',         key: 'cours' },
    { href: 'dojos.html',       label: 'Dojos',         key: 'dojos' },
    { href: 'actus.html',       label: 'Actualités',    key: 'actus' },
    { href: 'tarifs.html',      label: 'Tarifs',        key: 'tarifs' },
    { href: 'contact.html',     label: 'Contact',       key: 'contact' }
  ];

  const linksHtml = pages.map(p =>
    `<li><a href="${esc(p.href)}"${activePage === p.key ? ' class="is-active"' : ''}>${esc(p.label)}</a></li>`
  ).join('');

  const mobileLinksHtml = pages.map(p =>
    `<a href="${esc(p.href)}">${esc(p.label)}</a>`
  ).join('');

  const html = `
<nav class="navbar" id="navbar">
  <div class="wrap">
    <a href="index.html" class="nav__logo">
      <span class="kanji"><img src="shinodkai.png" alt="Logo Shindokai-Kan" onerror="this.parentNode.innerHTML='SDK'"></span>
      <span>${esc(club.shortName)}</span>
    </a>
    <ul class="nav__links">${linksHtml}</ul>
    <div class="nav__right">
      <a href="membres/index.html" title="Espace Membres" style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid var(--line);border-radius:50%;color:var(--ash);transition:color .2s,border-color .2s;flex-shrink:0;" onmouseover="this.style.color='var(--gold)';this.style.borderColor='var(--gold)';" onmouseout="this.style.color='var(--ash)';this.style.borderColor='var(--line)';" ${activePage==='membres'?'style="color:var(--gold);border-color:var(--gold);"':''}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
      </a>
      <a href="inscription.html" class="btn btn--primary" style="padding:.55rem 1.1rem;font-size:.72rem;white-space:nowrap;flex-shrink:0;">S'inscrire</a>
      <button class="nav__burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</nav>
<div class="nav__mobile" id="navMobile">
  ${mobileLinksHtml}
  <a href="membres/index.html" style="font-family:var(--eyebrow);font-size:1rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);">🥋 Espace Membres</a>
  <a href="inscription.html" class="btn btn--primary" style="font-size:.9rem;">S'inscrire</a>
</div>`;

  const placeholder = document.getElementById('nav-placeholder');
  if (placeholder) placeholder.innerHTML = html;

  // Comportement nav scroll
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // Burger menu
  const burger = document.getElementById('burger');
  const navMobile = document.getElementById('navMobile');
  if (burger && navMobile) {
    burger.addEventListener('click', () => navMobile.classList.toggle('is-open'));
    navMobile.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navMobile.classList.remove('is-open'))
    );
  }
}

/* ============ FOOTER ============ */
function renderFooter() {
  const club = getSection('club');
  const dojos = getSection('dojos');
  const year = new Date().getFullYear();

  const dojoLinks = dojos.map(d =>
    `<a href="dojos.html">${esc(d.name)}</a>`
  ).join('');

  const html = `
<footer>
  <div class="wrap">
    <div class="footer-inner">
      <div>
        <div class="footer-col__logo">
          <span class="kanji"><img src="shinodkai.png" alt="Logo" onerror="this.parentNode.innerHTML='SDK'"></span>
          <span>${esc(club.shortName)}</span>
        </div>
        <p class="footer-col__desc">
          Karaté contact, boxe et soumission au sol.<br>
          Officiellement reconnu Karaté-Jutsu au sein de la FFKDA.<br>
          Fondé en ${esc(String(club.founded))}.
        </p>
        <div class="socials" style="margin-top:1.2rem;">
          <a href="${esc(club.facebook)}" aria-label="Facebook" target="_blank" rel="noopener">FB</a>
          <a href="${esc(club.instagram)}" aria-label="Instagram" target="_blank" rel="noopener">IG</a>
        </div>
      </div>
      <div>
        <div class="footer-col__title">Navigation</div>
        <div class="footer-col__links">
          <a href="index.html">Accueil</a>
          <a href="discipline.html">La discipline</a>
          <a href="coachs.html">Coachs</a>
          <a href="cours.html">Cours & planning</a>
          <a href="dojos.html">Nos dojos</a>
          <a href="actus.html">Actualités</a>
          <a href="galerie.html">Galerie</a>
          <a href="tarifs.html">Tarifs</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>
      <div>
        <div class="footer-col__title">Nos dojos</div>
        <div class="footer-col__links">${dojoLinks}</div>
      </div>
      <div>
        <div class="footer-col__title">Contact</div>
        <div class="footer-col__contact-item">
          <span class="footer-col__contact-label">Email</span>
          <a href="mailto:${esc(club.email)}" style="color:var(--ash)">${esc(club.email)}</a>
        </div>
        <div class="footer-col__contact-item">
          <span class="footer-col__contact-label">Tél.</span>
          <span>${esc(club.phone)}</span>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${year} ${esc(club.name)} — Association loi 1901 · Karaté-Jutsu FFKDA</p>
      <div class="footer-bottom__links">
        <a href="contact.html">Mentions légales</a>
        <a href="contact.html">Contact</a>
      </div>
    </div>
  </div>
</footer>`;

  const placeholder = document.getElementById('footer-placeholder');
  if (placeholder) placeholder.innerHTML = html;
}

/* ============ BOUTON ADMIN ============ */
function renderAdminTrigger() {
  const btn = document.createElement('button');
  btn.className = 'admin-trigger';
  btn.setAttribute('aria-label', 'Administration');
  btn.title = 'Administration';
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
  btn.addEventListener('click', () => { window.location.href = 'admin.html'; });
  document.body.appendChild(btn);
}

/* ============ SCROLL REVEAL ============ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  return observer;
}

/* ============ COUNTER ANIMATION ============ */
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target = +entry.target.dataset.value;
      const countEl = entry.target.querySelector('.count');
      if (!countEl) return;
      const start = performance.now();
      const duration = 1200;
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        countEl.textContent = Math.floor(p * target);
        if (p < 1) requestAnimationFrame(tick);
        else countEl.textContent = target;
      }
      requestAnimationFrame(tick);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-value]').forEach(el => observer.observe(el));
}

/* ============ HERO GLOW ============ */
function initHeroGlow(glowId, sectionId) {
  const glow = document.getElementById(glowId);
  const section = document.getElementById(sectionId);
  if (!glow || !section) return;
  if (window.matchMedia('(pointer: fine)').matches) {
    section.addEventListener('mousemove', e => {
      const rect = section.getBoundingClientRect();
      glow.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      glow.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  }
}

/* ============ RENDU ACTU CARD ============ */
function buildActuCard(a) {
  const imgHTML = a.image
    ? `<img class="actu-card__img" src="${esc(a.image)}" alt="${esc(a.title)}" loading="lazy">`
    : `<div class="actu-card__img-placeholder"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="1"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>`;
  const lienHTML = a.lien
    ? `<a href="${esc(a.lien)}" class="actu-card__link" target="_blank" rel="noopener">Lire la suite →</a>`
    : `<span class="actu-card__link" style="opacity:.4;cursor:default;">EKSN</span>`;
  const div = document.createElement('div');
  div.className = `actu-card reveal actu-card--${esc(a.type || 'actu')}`;
  div.dataset.tag = (a.tag || '').toLowerCase();
  div.innerHTML = `
    <div class="actu-card__banner"></div>
    ${imgHTML}
    <div class="actu-card__body">
      <div class="actu-card__meta">
        <span class="actu-card__tag">${esc(a.tag)}</span>
        <span class="actu-card__date">${esc(a.date)}</span>
      </div>
      <div class="actu-card__title">${esc(a.title)}</div>
      <p class="actu-card__text">${esc(a.text)}</p>
      <div class="actu-card__footer">${lienHTML}</div>
    </div>`;
  return div;
}

/* ============ RENDU COACH CARD ============ */
function buildCoachCard(c, fullBio = false) {
  const photoHTML = c.photo
    ? `<img src="${esc(c.photo)}" alt="Photo de ${esc(c.name)}" loading="lazy">`
    : `<span class="initials">${esc(c.initials)}</span>`;
  const dojoHTML = c.dojo ? `<div class="coach-card__dojo">Dojo : ${esc(c.dojo)}</div>` : '';
  const div = document.createElement('div');
  div.className = `coach-card reveal${fullBio ? ' coach-card--full' : ''}`;
  div.setAttribute('tabindex', '0');
  div.innerHTML = `
    <div class="coach-card__photo">
      <div class="coach-card__belt"></div>
      ${photoHTML}
    </div>
    <div class="coach-card__body">
      <div class="coach-card__name">${esc(c.name)}</div>
      <div class="coach-card__grade">${esc(c.grade)}</div>
      <div class="coach-card__role">${esc(c.role)}</div>
      <div class="coach-card__bio">${esc(c.bio)}</div>
      ${fullBio ? dojoHTML : ''}
    </div>`;
  return div;
}

/* ============ INIT COMMUNE ============ */
function pageInit(activePage) {
  renderNav(activePage);
  renderFooter();
  renderAdminTrigger();
  initScrollReveal();
}

/* ============ APPLY TEXTES ============ */
/* setT: textContent simple | setH: innerHTML avec \n→<br> | setLines: hero-mini lines */
function setT(id, v) { const e = document.getElementById(id); if (e && v != null) e.textContent = v; }
function setH(id, v) { const e = document.getElementById(id); if (e && v != null) e.innerHTML = esc(v).replace(/\n/g, '<br>'); }
function setLines(prefix, arr) {
  if (!arr) return;
  arr.forEach((txt, i) => {
    const el = document.getElementById(prefix + (i + 1));
    if (el) el.querySelector('span').textContent = txt;
  });
}
function applyPageTextes(pageKey) {
  const tx = getSection('textes') || {};
  return tx[pageKey] || {};
}
