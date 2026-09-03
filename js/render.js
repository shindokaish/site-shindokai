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
    { href: 'encadrement.html', label: "L'encadrement", key: 'encadrement' },
    { href: 'dojos.html',       label: 'Les Dojos',     key: 'dojos' },
    { href: 'actus.html',       label: 'Actualités',    key: 'actus' },
    { href: 'galerie.html',     label: 'Galerie',       key: 'galerie' },
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
      <img src="img/logo-shindokai-nord.png" alt="École de Karaté Shindokai du Nord" class="nav__logo-img">
    </a>
    <ul class="nav__links">${linksHtml}</ul>
    <div class="nav__right">
      <a href="membres/index.html" title="Espace Membres" style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid var(--line);border-radius:50%;color:var(--ash);transition:color .2s,border-color .2s;flex-shrink:0;" onmouseover="this.style.color='var(--gold)';this.style.borderColor='var(--gold)';" onmouseout="this.style.color='var(--ash)';this.style.borderColor='var(--line)';">
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

  // Taille logo dynamique (depuis settings.logoHeight)
  const settings = getSection('settings');
  if (settings?.logoHeight) {
    const logoImg = document.querySelector('.nav__logo-img');
    if (logoImg) logoImg.style.height = settings.logoHeight + 'px';
  }

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
          <a href="encadrement.html">L'encadrement</a>
          <a href="dojos.html">Les Dojos</a>
          <a href="actus.html">Actualités</a>
          <a href="galerie.html">Galerie</a>
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
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.innerHTML = '&#8679;';
  btn.setAttribute('aria-label', 'Retour en haut');
  btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  }, { passive: true });
}

const VAPID_PUBLIC_KEY = 'BM6ft791ClQVDu0ld7y449Hvm19wswJuJ9W56p7CR2S4DFp1gBb-PLN4VIevUedvDu4d3QCVecnTXdUTkt8uh2o';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

async function initPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  // N'afficher la bannière qu'une seule fois
  if (localStorage.getItem('push_asked')) return;

  const banner = document.createElement('div');
  banner.id = 'pushBanner';
  banner.innerHTML = `
    <span>🔔 Recevoir les actualités du club ?</span>
    <div style="display:flex;gap:.6rem;">
      <button id="pushAccept" class="btn btn--primary" style="padding:.4rem .9rem;font-size:.75rem;">Oui</button>
      <button id="pushDecline" style="background:none;border:none;color:var(--ash);cursor:pointer;font-size:.75rem;">Non merci</button>
    </div>`;
  document.body.appendChild(banner);
  setTimeout(() => banner.classList.add('is-visible'), 1500);

  document.getElementById('pushDecline').onclick = () => {
    localStorage.setItem('push_asked', '1');
    banner.remove();
  };

  document.getElementById('pushAccept').onclick = async () => {
    localStorage.setItem('push_asked', '1');
    banner.remove();
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON() })
      });
    } catch(e) { console.warn('Push subscription failed', e); }
  };
}

/* ── Applique les surcharges de texte admin (text_overrides) ── */
function applyTextOverrides(pageKey) {
  try {
    const overrides = (typeof getSection === 'function') ? getSection('text_overrides') : null;
    if (!overrides) return;
    const prefix = pageKey + '|';
    Object.entries(overrides).forEach(([k, v]) => {
      if (!k.startsWith(prefix)) return;
      const el = document.getElementById(k.slice(prefix.length));
      if (el) el.textContent = v;
    });
  } catch(e) {}
}

function pageInit(activePage) {
  renderNav(activePage);
  renderFooter();
  renderAdminTrigger();
  initScrollReveal();
  initBackToTop();
  initPushNotifications();
  renderFloatingButtons();
  // Applique les surcharges de texte et blocs custom sauvegardés par l'admin
  if (typeof applyTextOverrides === 'function') applyTextOverrides(activePage);
  if (typeof renderCustomBlocks === 'function') renderCustomBlocks(activePage);
}

function renderFloatingButtons() {
  const settings = getSection('settings') || {};
  const club     = getSection('club')     || {};

  function makeBtn({ href, bg, label, svg, bottom }) {
    const a = document.createElement('a');
    a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', label);
    a.innerHTML = svg;
    Object.assign(a.style, {
      position: 'fixed', bottom, right: '1.4rem', zIndex: '900',
      width: '52px', height: '52px', borderRadius: '50%',
      background: bg, color: '#fff', border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 16px rgba(0,0,0,.35)',
      transition: 'transform .2s, box-shadow .2s',
      textDecoration: 'none',
    });
    a.addEventListener('mouseenter', () => { a.style.transform = 'scale(1.1)'; a.style.boxShadow = '0 6px 22px rgba(0,0,0,.4)'; });
    a.addEventListener('mouseleave', () => { a.style.transform = ''; a.style.boxShadow = '0 4px 16px rgba(0,0,0,.35)'; });
    document.body.appendChild(a);
  }

  // WhatsApp
  const num = settings.whatsapp;
  if (num) {
    const msg = encodeURIComponent(settings.whatsappMsg || 'Bonjour, je souhaite un essai gratuit !');
    makeBtn({
      href:   `https://wa.me/${num}?text=${msg}`,
      bg:     '#25D366',
      label:  'Nous contacter sur WhatsApp',
      bottom: '1.4rem',
      svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.112 1.528 5.836L.057 23.572a.5.5 0 0 0 .614.614l5.735-1.471A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.013-1.374l-.36-.213-3.738.979.997-3.647-.235-.374A9.818 9.818 0 1 1 12 21.818z"/></svg>`,
    });
  }

  // Facebook
  const fb = club.facebook;
  if (fb) {
    makeBtn({
      href:   fb,
      bg:     '#1877F2',
      label:  'Nous suivre sur Facebook',
      bottom: num ? '5rem' : '1.4rem',
      svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.932-1.956 1.889v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>`,
    });
  }
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
