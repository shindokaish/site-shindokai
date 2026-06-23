/* ============================================================
   SHINDOKAI-KAN I-S-L — Panel d'administration complet
   ============================================================ */

/* ============ ÉTAT ============ */
let currentSection = 'club';
let editingIndex = null;

/* ============ UTILITAIRES ============ */
function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.cloneNode(true);
}

function showToast(msg, ok = true) {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.style.cssText = 'position:fixed;bottom:5rem;right:1.5rem;z-index:999;font-family:var(--mono);font-size:.8rem;padding:.75rem 1.2rem;border-radius:2px;transition:opacity .4s;pointer-events:none;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.background = ok ? 'rgba(100,200,100,.15)' : 'rgba(224,36,27,.15)';
  toast.style.border = ok ? '1px solid rgba(100,200,100,.3)' : '1px solid rgba(224,36,27,.3)';
  toast.style.color = ok ? '#7ecf7e' : '#ff5a3c';
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 2800);
}

function confirmDel(msg) {
  return confirm(msg || 'Supprimer cet élément ?');
}

/* ============ FORMULAIRE INPUT ============ */
function fv(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}
function fs(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val ?? '';
}

/* ============ MIGRATION DONNÉES ============ */
/* Fusionne les clés manquantes du DEFAULT_DATA dans le localStorage */
function migrateData() {
  const data = getData();
  let changed = false;

  /* Met à jour les photos des coachs si elles sont vides */
  if (Array.isArray(data.coaches)) {
    const photoMap = { 'David':'img/coach-david.png', 'Morgan':'img/coach-morgan.png', 'Julien':'img/coach-julien.png' };
    data.coaches.forEach((c, i) => {
      const newPhoto = photoMap[c.name];
      if (newPhoto && !c.photo) { data.coaches[i].photo = newPhoto; changed = true; }
    });
  }

  /* S'assure que discipline, settings et textes existent */
  if (!data.discipline)       { data.discipline       = DEFAULT_DATA.discipline;       changed = true; }
  if (!data.settings)         { data.settings         = DEFAULT_DATA.settings;         changed = true; }
  if (!data.textes)           { data.textes           = DEFAULT_DATA.textes;           changed = true; }
  if (!data.ceintures_noires) { data.ceintures_noires = DEFAULT_DATA.ceintures_noires; changed = true; }

  /* S'assure que membres a toutes ses sous-clés */
  if (!data.membres) { data.membres = DEFAULT_DATA.membres; changed = true; }
  else {
    if (!data.membres.jeux)        { data.membres.jeux = DEFAULT_DATA.membres.jeux; changed = true; }
    if (!data.membres.quiz || !Array.isArray(data.membres.quiz) || data.membres.quiz.length === 0) {
      data.membres.quiz = DEFAULT_DATA.membres.quiz; changed = true;
    }
    if (!data.membres.vocabulaire || !Array.isArray(data.membres.vocabulaire) || data.membres.vocabulaire.length === 0) {
      data.membres.vocabulaire = DEFAULT_DATA.membres.vocabulaire; changed = true;
    }
    if (!data.membres.ceintures || !Array.isArray(data.membres.ceintures) || data.membres.ceintures.length === 0) {
      data.membres.ceintures = DEFAULT_DATA.membres.ceintures; changed = true;
    }
    if (!data.membres.password) { data.membres.password = DEFAULT_DATA.membres.password; changed = true; }
  }

  if (changed) saveData(data);
}

/* ============ LOGIN ============ */
function initLogin() {
  const overlay = document.getElementById('loginOverlay');
  const input = document.getElementById('loginPwd');
  const btn = document.getElementById('loginBtn');
  const err = document.getElementById('loginErr');

  function tryLogin() {
    const data = getData();
    if (input.value === data.adminPassword) {
      overlay.style.display = 'none';
      document.getElementById('adminApp').style.display = 'flex';
      loadSection('club');
    } else {
      err.style.display = 'block';
      input.value = '';
      input.focus();
    }
  }

  btn.addEventListener('click', tryLogin);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
  setTimeout(() => input.focus(), 100);
}

/* ============ SIDEBAR ============ */
function loadSection(key) {
  currentSection = key;
  document.querySelectorAll('.sidebar-item').forEach(el => el.classList.toggle('is-active', el.dataset.section === key));
  const title = document.getElementById('sectionTitle');
  const labels = {
    club: 'Informations du club',
    stats: 'Statistiques',
    coaches: 'Coachs',
    courses: 'Cours & planning',
    dojos: 'Nos dojos',
    actus: 'Actualités',
    galerie: 'Galerie',
    tarifs: 'Tarifs',
    textes: 'Textes du site',
    discipline: 'Page Discipline',
    ceintures_noires: 'Ceintures noires',
    inscription: 'Formulaire d\'inscription',
    contact: 'Contact & formulaire',
    settings: 'Paramètres',
    membres: 'Espace Membres'
  };
  title.textContent = labels[key] || key;
  const content = document.getElementById('sectionContent');
  content.innerHTML = '';

  const renders = {
    club: renderClubSection,
    stats: renderStatsSection,
    coaches: renderCoachesSection,
    courses: renderCoursesSection,
    dojos: renderDojosSection,
    actus: renderActusSection,
    galerie: renderGalerieSection,
    tarifs: renderTarifsSection,
    textes: renderTextesSection,
    discipline: renderDisciplineSection,
    ceintures_noires: renderCeinturesNoiresSection,
    inscription: renderInscriptionSection,
    contact: renderContactSection,
    settings: renderSettingsSection,
    membres: renderMembresSection
  };
  if (renders[key]) renders[key](content);
}

/* ============ SECTION CLUB ============ */
function renderClubSection(container) {
  const club = getSection('club');
  const heroTitle = club.heroTitle || ['Respect.', 'Honneur.', 'Discipline.'];
  container.innerHTML = `
<div class="admin-section-form">

  <div class="admin-card">
    <div class="admin-card__title">🏯 Identité du club</div>
    <div class="admin-form-grid" style="margin-top:1rem;">
      <div class="admin-field"><label>Nom complet du club</label><input id="c-name" value="${esc(club.name)}"></div>
      <div class="admin-field"><label>Nom court (nav/footer)</label><input id="c-shortName" value="${esc(club.shortName)}"></div>
      <div class="admin-field"><label>Email de contact</label><input id="c-email" type="email" value="${esc(club.email)}"></div>
      <div class="admin-field"><label>Téléphone</label><input id="c-phone" value="${esc(club.phone)}"></div>
      <div class="admin-field"><label>Lien Facebook</label><input id="c-facebook" value="${esc(club.facebook)}"></div>
      <div class="admin-field"><label>Lien Instagram</label><input id="c-instagram" value="${esc(club.instagram)}"></div>
      <div class="admin-field"><label>Année de fondation</label><input id="c-founded" type="number" value="${esc(String(club.founded))}"></div>
    </div>
  </div>

  <div class="admin-card">
    <div class="admin-card__title">🦸 Page d'accueil — Hero</div>
    <p style="color:var(--ash);font-size:.82rem;margin:.5rem 0 1rem;">Texte affiché en grand sur la page d'accueil.</p>
    <div class="admin-form-grid" style="margin-bottom:1rem;">
      <div class="admin-field"><label>Texte au-dessus du titre (eyebrow)</label><input id="c-eyebrow" value="${esc(club.heroEyebrow || 'Karaté-Jutsu FFKDA · Nord (59)')}"></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem;">
      <div class="admin-field"><label>Mot 1</label><input id="c-hero1" value="${esc(heroTitle[0] || 'Respect.')}"></div>
      <div class="admin-field"><label>Mot 2 <span style="color:var(--crimson-2);">(en rouge)</span></label><input id="c-hero2" value="${esc(heroTitle[1] || 'Honneur.')}"></div>
      <div class="admin-field"><label>Mot 3</label><input id="c-hero3" value="${esc(heroTitle[2] || 'Discipline.')}"></div>
    </div>
    <div class="admin-field"><label>Sous-titre hero</label><textarea id="c-heroSub" rows="2">${esc(club.heroSub)}</textarea></div>
  </div>

  <div class="admin-card">
    <div class="admin-card__title">📖 La discipline — Textes</div>
    <div class="admin-field" style="margin-top:1rem;"><label>Paragraphe 1</label><textarea id="c-p1" rows="3">${esc(club.aboutP1)}</textarea></div>
    <div class="admin-field"><label>Paragraphe 2</label><textarea id="c-p2" rows="3">${esc(club.aboutP2)}</textarea></div>
    <div class="admin-field"><label>Paragraphe 3</label><textarea id="c-p3" rows="3">${esc(club.aboutP3)}</textarea></div>
    <div class="admin-field"><label>Badges discipline (un par ligne)</label><textarea id="c-badges" rows="4">${esc(getSection('disciplineBadges').join('\n'))}</textarea></div>
  </div>

  <button class="btn btn--primary" id="saveClubBtn" style="align-self:flex-start;">Enregistrer toutes les modifications</button>
</div>`;

  document.getElementById('saveClubBtn').addEventListener('click', () => {
    const data = getData();
    data.club = {
      ...data.club,
      name:        fv('c-name'),
      shortName:   fv('c-shortName'),
      email:       fv('c-email'),
      phone:       fv('c-phone'),
      facebook:    fv('c-facebook'),
      instagram:   fv('c-instagram'),
      founded:     +fv('c-founded') || 2006,
      heroEyebrow: fv('c-eyebrow'),
      heroTitle:   [fv('c-hero1'), fv('c-hero2'), fv('c-hero3')],
      heroSub:     fv('c-heroSub'),
      aboutP1:     fv('c-p1'),
      aboutP2:     fv('c-p2'),
      aboutP3:     fv('c-p3')
    };
    data.disciplineBadges = fv('c-badges').split('\n').map(s => s.trim()).filter(Boolean);
    saveData(data);
    showToast('Informations enregistrées ✓');
  });
}

/* ============ SECTION STATS ============ */
function renderStatsSection(container) {
  const stats = getSection('stats');
  container.innerHTML = `<div id="statsAdmin"></div><button class="btn btn--ghost" id="addStatBtn" style="margin-top:1rem;">+ Ajouter une statistique</button>`;
  renderStatsList();
  document.getElementById('addStatBtn').addEventListener('click', () => {
    const s = getSection('stats');
    s.push({ value: 0, suffix: '', label: 'Nouvelle stat' });
    saveSection('stats', s);
    renderStatsList();
  });
}

function renderStatsList() {
  const stats = getSection('stats');
  const el = document.getElementById('statsAdmin');
  if (!el) return;
  el.innerHTML = '';
  stats.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'admin-item';
    row.innerHTML = `
      <div class="admin-item__info" style="display:grid;grid-template-columns:1fr 1fr 2fr;gap:1rem;flex:1;">
        <div><label class="admin-label">Valeur</label><input class="admin-input" value="${esc(String(s.value))}" data-field="value" data-i="${i}"></div>
        <div><label class="admin-label">Suffixe</label><input class="admin-input" value="${esc(s.suffix)}" data-field="suffix" data-i="${i}"></div>
        <div><label class="admin-label">Label</label><input class="admin-input" value="${esc(s.label)}" data-field="label" data-i="${i}"></div>
      </div>
      <div class="admin-item__actions">
        <button class="admin-btn admin-btn--del" data-i="${i}">✕</button>
      </div>`;
    el.appendChild(row);
  });
  el.querySelectorAll('.admin-input').forEach(inp => {
    inp.addEventListener('change', () => {
      const stats = getSection('stats');
      const i = +inp.dataset.i;
      const field = inp.dataset.field;
      stats[i][field] = field === 'value' ? +inp.value : inp.value;
      saveSection('stats', stats);
      showToast('Enregistré ✓');
    });
  });
  el.querySelectorAll('.admin-btn--del').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirmDel()) return;
      const stats = getSection('stats');
      stats.splice(+btn.dataset.i, 1);
      saveSection('stats', stats);
      renderStatsList();
    });
  });
}

/* ============ SECTION COACHES ============ */
function renderCoachesSection(container) {
  const coaches = getSection('coaches');
  container.innerHTML = `<div id="coachesAdmin"></div><button class="btn btn--ghost" id="addCoachBtn" style="margin-top:1rem;">+ Ajouter un coach</button>`;
  renderCoachesList();
  document.getElementById('addCoachBtn').addEventListener('click', () => {
    editingIndex = null;
    openCoachModal(null);
  });
}

function renderCoachesList() {
  const coaches = getSection('coaches');
  const el = document.getElementById('coachesAdmin');
  if (!el) return;
  el.innerHTML = '';
  if (!coaches.length) { el.innerHTML = '<p class="admin-empty">Aucun coach.</p>'; return; }
  coaches.forEach((c, i) => {
    const row = document.createElement('div');
    row.className = 'admin-item';
    row.innerHTML = `
      <div class="admin-item__info">
        <div class="admin-item__tag">${esc(c.grade)}</div>
        <div class="admin-item__title">${esc(c.name)} — ${esc(c.role)}</div>
        <div class="admin-item__date">${esc(c.bio.substring(0, 80))}…</div>
      </div>
      <div class="admin-item__actions">
        <button class="admin-btn admin-btn--edit" data-i="${i}">✏ Modifier</button>
        <button class="admin-btn admin-btn--del" data-i="${i}">✕</button>
      </div>`;
    el.appendChild(row);
  });
  el.querySelectorAll('.admin-btn--edit').forEach(btn =>
    btn.addEventListener('click', () => openCoachModal(+btn.dataset.i))
  );
  el.querySelectorAll('.admin-btn--del').forEach(btn =>
    btn.addEventListener('click', () => {
      if (!confirmDel('Supprimer ce coach ?')) return;
      const coaches = getSection('coaches');
      coaches.splice(+btn.dataset.i, 1);
      saveSection('coaches', coaches);
      renderCoachesList();
    })
  );
}

function openCoachModal(index) {
  editingIndex = index;
  const coaches = getSection('coaches');
  const c = index !== null ? coaches[index] : { initials: '', photo: '', name: '', grade: '', role: '', bio: '', dojo: '' };
  openModal('Coach', [
    { id: 'cm-initials', label: 'Initiales', value: c.initials },
    { id: 'cm-name', label: 'Prénom / Nom', value: c.name },
    { id: 'cm-grade', label: 'Grade(s)', value: c.grade },
    { id: 'cm-role', label: 'Rôle / Diplôme', value: c.role },
    { id: 'cm-dojo', label: 'Dojo', value: c.dojo || '' },
    { id: 'cm-photo', label: 'URL Photo', value: c.photo || '' },
    { id: 'cm-bio', label: 'Biographie', value: c.bio, textarea: true }
  ], () => {
    const coaches = getSection('coaches');
    const entry = {
      initials: fv('cm-initials'),
      photo: fv('cm-photo'),
      name: fv('cm-name'),
      grade: fv('cm-grade'),
      role: fv('cm-role'),
      bio: fv('cm-bio'),
      dojo: fv('cm-dojo')
    };
    if (editingIndex !== null) coaches[editingIndex] = entry;
    else coaches.push(entry);
    saveSection('coaches', coaches);
    renderCoachesList();
    closeModal();
    showToast('Coach enregistré ✓');
  });
}

/* ============ SECTION COURSES ============ */
function renderCoursesSection(container) {
  const courses = getSection('courses');
  container.innerHTML = `<div id="coursesAdmin"></div><button class="btn btn--ghost" id="addCourseBtn" style="margin-top:1rem;">+ Ajouter un cours</button>`;
  renderCoursesList();
  document.getElementById('addCourseBtn').addEventListener('click', () => {
    editingIndex = null;
    openCourseModal(null);
  });
}

function renderCoursesList() {
  const courses = getSection('courses');
  const el = document.getElementById('coursesAdmin');
  if (!el) return;
  el.innerHTML = '';
  if (!courses.length) { el.innerHTML = '<p class="admin-empty">Aucun cours.</p>'; return; }
  courses.forEach((c, i) => {
    const row = document.createElement('div');
    row.className = 'admin-item';
    row.innerHTML = `
      <div style="width:8px;height:auto;background:${esc(c.belt)};align-self:stretch;flex-shrink:0;border-radius:1px;"></div>
      <div class="admin-item__info">
        <div class="admin-item__title">${esc(c.name)} <span style="color:var(--ash-2);font-size:.8rem;">(${esc(c.age)})</span></div>
        <div class="admin-item__date">${esc(c.days)} · ${esc(c.time)} · ${esc(c.level)}</div>
      </div>
      <div class="admin-item__actions">
        <button class="admin-btn admin-btn--edit" data-i="${i}">✏</button>
        <button class="admin-btn admin-btn--del" data-i="${i}">✕</button>
      </div>`;
    el.appendChild(row);
  });
  el.querySelectorAll('.admin-btn--edit').forEach(btn =>
    btn.addEventListener('click', () => openCourseModal(+btn.dataset.i))
  );
  el.querySelectorAll('.admin-btn--del').forEach(btn =>
    btn.addEventListener('click', () => {
      if (!confirmDel('Supprimer ce cours ?')) return;
      const courses = getSection('courses');
      courses.splice(+btn.dataset.i, 1);
      saveSection('courses', courses);
      renderCoursesList();
    })
  );
}

function openCourseModal(index) {
  editingIndex = index;
  const courses = getSection('courses');
  const c = index !== null ? courses[index] : { age: '', name: '', level: '', days: '', time: '', belt: '#e0241b' };
  openModal('Cours', [
    { id: 'crm-name', label: 'Nom du cours', value: c.name },
    { id: 'crm-age', label: 'Tranche d\'âge', value: c.age },
    { id: 'crm-level', label: 'Niveau / description', value: c.level },
    { id: 'crm-days', label: 'Jours', value: c.days },
    { id: 'crm-time', label: 'Horaire', value: c.time },
    { id: 'crm-belt', label: 'Couleur ceinture (hex)', value: c.belt }
  ], () => {
    const courses = getSection('courses');
    const entry = {
      name: fv('crm-name'),
      age: fv('crm-age'),
      level: fv('crm-level'),
      days: fv('crm-days'),
      time: fv('crm-time'),
      belt: fv('crm-belt') || '#e0241b'
    };
    if (editingIndex !== null) courses[editingIndex] = entry;
    else courses.push(entry);
    saveSection('courses', courses);
    renderCoursesList();
    closeModal();
    showToast('Cours enregistré ✓');
  });
}

/* ============ SECTION DOJOS ============ */
function renderDojosSection(container) {
  container.innerHTML = `<div id="dojosAdmin"></div><button class="btn btn--ghost" id="addDojoBtn" style="margin-top:1rem;">+ Ajouter un dojo</button>`;
  renderDojosList();
  document.getElementById('addDojoBtn').addEventListener('click', () => {
    editingIndex = null;
    openDojoModal(null);
  });
}

function renderDojosList() {
  const dojos = getSection('dojos');
  const el = document.getElementById('dojosAdmin');
  if (!el) return;
  el.innerHTML = '';
  if (!dojos.length) { el.innerHTML = '<p class="admin-empty">Aucun dojo.</p>'; return; }
  dojos.forEach((d, i) => {
    const row = document.createElement('div');
    row.className = 'admin-item';
    row.innerHTML = `
      <div class="admin-item__info">
        <div class="admin-item__title">${esc(d.name)}</div>
        <div class="admin-item__date">${esc(d.address)}</div>
      </div>
      <div class="admin-item__actions">
        <button class="admin-btn admin-btn--edit" data-i="${i}">✏ Modifier</button>
        <button class="admin-btn admin-btn--del" data-i="${i}">✕</button>
      </div>`;
    el.appendChild(row);
  });
  el.querySelectorAll('.admin-btn--edit').forEach(btn =>
    btn.addEventListener('click', () => openDojoModal(+btn.dataset.i))
  );
  el.querySelectorAll('.admin-btn--del').forEach(btn =>
    btn.addEventListener('click', () => {
      if (!confirmDel('Supprimer ce dojo ?')) return;
      const dojos = getSection('dojos');
      dojos.splice(+btn.dataset.i, 1);
      saveSection('dojos', dojos);
      renderDojosList();
    })
  );
}

function openDojoModal(index) {
  editingIndex = index;
  const dojos = getSection('dojos');
  const d = index !== null ? dojos[index] : { name: '', logo: '', address: '', phone: '', horaires: '', acces: '', mapEmbed: '', mapLink: '', president: '', presidentPhone: '', presidentEmail: '', instructeur: '' };
  openModal('Dojo', [
    { id: 'dm-name',           label: 'Nom du dojo',                  value: d.name },
    { id: 'dm-logo',           label: 'Logo (URL ou nom de fichier)',  value: d.logo || '' },
    { id: 'dm-address',        label: 'Adresse complète',             value: d.address },
    { id: 'dm-phone',          label: 'Téléphone du dojo',            value: d.phone || '' },
    { id: 'dm-horaires',       label: 'Horaires',                     value: d.horaires, textarea: true },
    { id: 'dm-acces',          label: 'Accès / transports',           value: d.acces || '' },
    { id: 'dm-president',      label: 'Président — Nom',              value: d.president || '' },
    { id: 'dm-presidentPhone', label: 'Président — Téléphone',        value: d.presidentPhone || '' },
    { id: 'dm-presidentEmail', label: 'Président — Email',            value: d.presidentEmail || '' },
    { id: 'dm-instructeur',    label: 'Instructeur référent',         value: d.instructeur || '' },
    { id: 'dm-mapEmbed',       label: 'Src iframe Google Maps',       value: d.mapEmbed || '' },
    { id: 'dm-mapLink',        label: 'Lien Google Maps',             value: d.mapLink || '' }
  ], () => {
    const dojos = getSection('dojos');
    const entry = {
      name:           fv('dm-name'),
      logo:           fv('dm-logo'),
      address:        fv('dm-address'),
      phone:          fv('dm-phone'),
      horaires:       fv('dm-horaires'),
      acces:          fv('dm-acces'),
      president:      fv('dm-president'),
      presidentPhone: fv('dm-presidentPhone'),
      presidentEmail: fv('dm-presidentEmail'),
      instructeur:    fv('dm-instructeur'),
      mapEmbed:       fv('dm-mapEmbed'),
      mapLink:        fv('dm-mapLink')
    };
    if (editingIndex !== null) dojos[editingIndex] = entry;
    else dojos.push(entry);
    saveSection('dojos', dojos);
    renderDojosList();
    closeModal();
    showToast('Dojo enregistré ✓');
  });
}

/* ============ SECTION ACTUS ============ */
function renderActusSection(container) {
  const actus = getSection('actus');
  container.innerHTML = `
<div style="display:flex;gap:1rem;align-items:center;margin-bottom:1.5rem;">
  <h3 style="font-family:var(--eyebrow);font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:var(--ash);">${actus.length} actualité${actus.length > 1 ? 's' : ''}</h3>
  <button class="btn btn--primary" id="addActuBtn" style="padding:.5rem 1rem;font-size:.75rem;">+ Nouvelle actualité</button>
</div>
<div id="actusList"></div>`;

  renderActusList();

  document.getElementById('addActuBtn').addEventListener('click', () => {
    editingIndex = null;
    openActuModal(null);
  });
}

function renderActusList() {
  const actus = getSection('actus');
  const el = document.getElementById('actusList');
  if (!el) return;
  el.innerHTML = '';
  if (!actus.length) { el.innerHTML = '<p class="admin-empty">Aucune actualité. Cliquez sur "+ Nouvelle actualité".</p>'; return; }
  actus.forEach((a, i) => {
    const row = document.createElement('div');
    row.className = 'admin-item';
    row.draggable = true;
    row.dataset.i = i;
    row.innerHTML = `
      <div style="display:flex;align-items:center;gap:.8rem;cursor:grab;color:var(--ash-2);flex-shrink:0;">⠿</div>
      <div class="admin-item__info">
        <div class="admin-item__tag">${esc(a.tag)} · ${esc(a.date)} · <span style="color:var(--ash-2);">${esc(a.type)}</span></div>
        <div class="admin-item__title">${esc(a.title)}</div>
        <div class="admin-item__date">${esc((a.text || '').substring(0, 90))}…</div>
      </div>
      <div class="admin-item__actions">
        <button class="admin-btn admin-btn--edit" data-i="${i}">✏ Modifier</button>
        <button class="admin-btn admin-btn--del" data-i="${i}">✕</button>
      </div>`;
    el.appendChild(row);
  });
  el.querySelectorAll('.admin-btn--edit').forEach(btn =>
    btn.addEventListener('click', () => openActuModal(+btn.dataset.i))
  );
  el.querySelectorAll('.admin-btn--del').forEach(btn =>
    btn.addEventListener('click', () => {
      if (!confirmDel('Supprimer cette actualité ?')) return;
      const actus = getSection('actus');
      actus.splice(+btn.dataset.i, 1);
      saveSection('actus', actus);
      renderActusList();
      renderActusSection(document.getElementById('sectionContent'));
    })
  );
  initDragSort(el, 'actus');
}

function openActuModal(index) {
  editingIndex = index;
  const modal = document.getElementById('adminModal');
  const actus = getSection('actus');
  const a = index !== null ? actus[index] : { tag: '', date: '', title: '', text: '', image: '', lien: '', type: 'actu' };

  // Formulaire spécial avec preview
  modal.innerHTML = `
<div class="admin-modal__box" style="max-width:800px;display:grid;grid-template-columns:1fr 1fr;gap:2rem;">
  <div style="display:flex;flex-direction:column;gap:1rem;">
    <div class="admin-modal__title">${index !== null ? 'Modifier' : 'Nouvelle'} actualité</div>
    <div><label class="admin-modal-label">Tag</label><input id="am-tag" class="admin-modal-input" value="${esc(a.tag)}" placeholder="Compétition, Stage, Grades…"></div>
    <div><label class="admin-modal-label">Date</label><input id="am-date" class="admin-modal-input" value="${esc(a.date)}" placeholder="Juin 2025"></div>
    <div><label class="admin-modal-label">Titre</label><input id="am-title" class="admin-modal-input" value="${esc(a.title)}"></div>
    <div><label class="admin-modal-label">Texte</label><textarea id="am-text" class="admin-modal-input" rows="4">${esc(a.text)}</textarea></div>
    <div><label class="admin-modal-label">Image (URL)</label><input id="am-image" class="admin-modal-input" value="${esc(a.image || '')}" placeholder="https://…"></div>
    <div><label class="admin-modal-label">Lien "Lire la suite"</label><input id="am-lien" class="admin-modal-input" value="${esc(a.lien || '')}" placeholder="https://…"></div>
    <div><label class="admin-modal-label">Couleur</label>
      <select id="am-type" class="admin-modal-input">
        <option value="actu"${a.type==='actu'?' selected':''}>Rouge — Compétition, Événement</option>
        <option value="gold"${a.type==='gold'?' selected':''}>Or — Résultats, Récompenses</option>
        <option value="dark"${a.type==='dark'?' selected':''}>Gris — Informations générales</option>
      </select>
    </div>
    <div style="display:flex;gap:.8rem;padding-top:.5rem;border-top:1px solid var(--line);">
      <button class="btn btn--ghost" id="amCancel">Annuler</button>
      <button class="btn btn--primary" id="amSave">Enregistrer</button>
    </div>
  </div>
  <div>
    <div style="font-family:var(--eyebrow);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ash-2);margin-bottom:.8rem;">Aperçu</div>
    <div id="amPreview"></div>
  </div>
</div>`;

  modal.classList.add('is-open');

  function updatePreview() {
    const prev = document.getElementById('amPreview');
    if (!prev) return;
    const type = fv('am-type');
    const tag = fv('am-tag') || 'Tag';
    const date = fv('am-date') || 'Date';
    const title = fv('am-title') || 'Titre';
    const text = fv('am-text') || 'Texte de l\'actualité…';
    const img = fv('am-image');
    const lien = fv('am-lien');
    const imgHTML = img
      ? `<img class="actu-card__img" src="${esc(img)}" alt="" style="height:130px;">`
      : `<div class="actu-card__img-placeholder" style="height:130px;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="1"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>`;
    prev.innerHTML = `<div class="actu-card actu-card--${esc(type)}" style="max-width:300px;pointer-events:none;">
      <div class="actu-card__banner"></div>${imgHTML}
      <div class="actu-card__body">
        <div class="actu-card__meta"><span class="actu-card__tag">${esc(tag)}</span><span class="actu-card__date">${esc(date)}</span></div>
        <div class="actu-card__title">${esc(title)}</div>
        <p class="actu-card__text">${esc(text.substring(0, 120))}</p>
        <div class="actu-card__footer"><span class="actu-card__link">${lien ? 'Lire la suite →' : 'EKSN'}</span></div>
      </div></div>`;
  }

  ['am-tag','am-date','am-title','am-text','am-image','am-lien','am-type'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updatePreview);
  });
  updatePreview();

  document.getElementById('amCancel').addEventListener('click', closeModal);
  document.getElementById('amSave').addEventListener('click', () => {
    const title = fv('am-title').trim();
    if (!title) { showToast('Le titre est obligatoire', false); return; }
    const actus = getSection('actus');
    const entry = {
      id: editingIndex !== null ? actus[editingIndex].id : Date.now(),
      tag: fv('am-tag').trim() || 'Info',
      date: fv('am-date').trim() || new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
      title,
      text: fv('am-text').trim(),
      image: fv('am-image').trim(),
      lien: fv('am-lien').trim(),
      type: fv('am-type')
    };
    if (editingIndex !== null) actus[editingIndex] = entry;
    else actus.unshift(entry);
    saveSection('actus', actus);
    closeModal();
    renderActusSection(document.getElementById('sectionContent'));
    showToast('Actualité enregistrée ✓');
  });

  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.getElementById('am-title').focus();
}

/* ============ SECTION GALERIE ============ */
function renderGalerieSection(container) {
  const galerie = getSection('galerie');
  container.innerHTML = `
<div class="admin-field" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
  <div><label class="admin-label">URL de l'image</label><input id="g-url" class="admin-input" placeholder="https://… ou nom-fichier.jpg"></div>
  <div><label class="admin-label">Légende</label><input id="g-caption" class="admin-input" placeholder="Description…"></div>
  <div><label class="admin-label">Catégorie</label><input id="g-cat" class="admin-input" placeholder="Compétition, Stage…"></div>
</div>
<button class="btn btn--primary" id="addGalerieBtn" style="margin-bottom:2rem;">+ Ajouter cette image</button>
<div id="galerieAdmin" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1rem;"></div>`;

  renderGalerieList();

  document.getElementById('addGalerieBtn').addEventListener('click', () => {
    const url = fv('g-url').trim();
    if (!url) { showToast('URL manquante', false); return; }
    const galerie = getSection('galerie');
    galerie.push({ url, caption: fv('g-caption').trim(), cat: fv('g-cat').trim(), id: Date.now() });
    saveSection('galerie', galerie);
    renderGalerieList();
    fs('g-url', ''); fs('g-caption', ''); fs('g-cat', '');
    showToast('Image ajoutée ✓');
  });
}

function renderGalerieList() {
  const galerie = getSection('galerie');
  const el = document.getElementById('galerieAdmin');
  if (!el) return;
  el.innerHTML = '';
  if (!galerie.length) { el.innerHTML = '<p class="admin-empty" style="grid-column:1/-1;">Aucune image. Ajoutez-en une ci-dessus.</p>'; return; }
  galerie.forEach((img, i) => {
    const div = document.createElement('div');
    div.style.cssText = 'background:var(--char);border:1px solid var(--line);overflow:hidden;position:relative;';
    div.innerHTML = `
      <img src="${esc(img.url)}" alt="${esc(img.caption)}" style="width:100%;height:120px;object-fit:cover;display:block;" onerror="this.style.background='var(--char-2)'">
      <div style="padding:.5rem .7rem;">
        <div style="font-size:.75rem;color:var(--ash-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(img.caption || img.url)}</div>
        ${img.cat ? `<div style="font-family:var(--mono);font-size:.65rem;color:var(--crimson-2);margin-top:.2rem;">${esc(img.cat)}</div>` : ''}
      </div>
      <button class="admin-btn admin-btn--del" data-i="${i}" style="position:absolute;top:.3rem;right:.3rem;padding:.2rem .5rem;">✕</button>`;
    el.appendChild(div);
  });
  el.querySelectorAll('.admin-btn--del').forEach(btn =>
    btn.addEventListener('click', () => {
      if (!confirmDel('Supprimer cette image ?')) return;
      const galerie = getSection('galerie');
      galerie.splice(+btn.dataset.i, 1);
      saveSection('galerie', galerie);
      renderGalerieList();
    })
  );
}

/* ============ SECTION TARIFS ============ */
function renderTarifsSection(container) {
  container.innerHTML = `<div id="tarifsAdmin"></div><button class="btn btn--ghost" id="addTarifBtn" style="margin-top:1rem;">+ Ajouter une formule</button>`;
  renderTarifsList();
  document.getElementById('addTarifBtn').addEventListener('click', () => {
    editingIndex = null;
    openTarifModal(null);
  });
}

function renderTarifsList() {
  const tarifs = getSection('tarifs');
  const el = document.getElementById('tarifsAdmin');
  if (!el) return;
  el.innerHTML = '';
  tarifs.forEach((t, i) => {
    const row = document.createElement('div');
    row.className = 'admin-item';
    row.innerHTML = `
      <div class="admin-item__info">
        <div class="admin-item__title">${esc(t.name)} <span style="color:var(--gold);font-family:var(--mono);">${esc(t.price)}${esc(t.period)}</span>${t.featured ? ' <span style="color:var(--crimson-2);font-size:.7rem;">[Le plus choisi]</span>' : ''}</div>
        <div class="admin-item__date">${t.features.map(f => esc(f)).join(' · ')}</div>
      </div>
      <div class="admin-item__actions">
        <button class="admin-btn admin-btn--edit" data-i="${i}">✏</button>
        <button class="admin-btn admin-btn--del" data-i="${i}">✕</button>
      </div>`;
    el.appendChild(row);
  });
  el.querySelectorAll('.admin-btn--edit').forEach(btn =>
    btn.addEventListener('click', () => openTarifModal(+btn.dataset.i))
  );
  el.querySelectorAll('.admin-btn--del').forEach(btn =>
    btn.addEventListener('click', () => {
      if (!confirmDel('Supprimer cette formule ?')) return;
      const tarifs = getSection('tarifs');
      tarifs.splice(+btn.dataset.i, 1);
      saveSection('tarifs', tarifs);
      renderTarifsList();
    })
  );
}

function openTarifModal(index) {
  editingIndex = index;
  const tarifs = getSection('tarifs');
  const t = index !== null ? tarifs[index] : { name: '', price: '', period: '/an', featured: false, features: [] };
  openModal('Formule', [
    { id: 'tm-name', label: 'Nom de la formule', value: t.name },
    { id: 'tm-price', label: 'Prix', value: t.price },
    { id: 'tm-period', label: 'Période', value: t.period },
    { id: 'tm-features', label: 'Avantages (un par ligne)', value: t.features.join('\n'), textarea: true },
    { id: 'tm-featured', label: 'Mise en avant ? (oui/non)', value: t.featured ? 'oui' : 'non' }
  ], () => {
    const tarifs = getSection('tarifs');
    const entry = {
      name: fv('tm-name'),
      price: fv('tm-price'),
      period: fv('tm-period'),
      featured: fv('tm-featured').toLowerCase() === 'oui',
      features: fv('tm-features').split('\n').map(s => s.trim()).filter(Boolean)
    };
    if (editingIndex !== null) tarifs[editingIndex] = entry;
    else tarifs.push(entry);
    saveSection('tarifs', tarifs);
    renderTarifsList();
    closeModal();
    showToast('Formule enregistrée ✓');
  });
}

/* ============ SECTION TEXTES ============ */
function renderTextesSection(container) {
  const tx = getSection('textes') || DEFAULT_DATA.textes || {};

  const TABS = [
    { key: 'accueil',    label: '🏠 Accueil' },
    { key: 'coachs',     label: '🥋 Coachs' },
    { key: 'dojos',      label: '🏯 Dojos' },
    { key: 'actus',      label: '📰 Actualités' },
    { key: 'cours',      label: '📅 Cours' },
    { key: 'tarifs',     label: '💰 Tarifs' },
    { key: 'galerie',    label: '🖼️ Galerie' },
    { key: 'inscription',label: '📋 Inscription' },
    { key: 'contact',    label: '📞 Contact' },
  ];

  let activeTab = 'accueil';

  function field(label, id, val, type='input', rows=2) {
    if (type === 'textarea') {
      return `<div class="admin-field"><label>${label}</label><textarea id="${id}" rows="${rows}" class="admin-modal-input" style="resize:vertical;">${esc(val||'')}</textarea></div>`;
    }
    return `<div class="admin-field"><label>${label}</label><input id="${id}" value="${esc(val||'')}" class="admin-modal-input"></div>`;
  }
  function row2(...fields) { return `<div class="admin-form-grid">${fields.join('')}</div>`; }
  function card(title, content) { return `<div class="admin-card" style="margin-bottom:1.2rem;"><div class="admin-card__title">${title}</div><div style="margin-top:1rem;display:flex;flex-direction:column;gap:.8rem;">${content}</div></div>`; }

  function buildAccueil(d) { return `
    ${card('Héro', row2(field('Eyebrow','tx-acc-discEyebrow',d.disciplineEyebrow), field('Titre (\\n = saut de ligne)','tx-acc-discTitre',d.disciplineTitre)))}
    ${card('Section Cours', row2(field('Eyebrow','tx-acc-coursEyebrow',d.coursEyebrow), field('Titre','tx-acc-coursTitre',d.coursTitre)) + field('Accroche','tx-acc-coursLede',d.coursLede))}
    ${card('Carte Enfants', row2(field('Âge','tx-acc-c0age',(d.cards||[])[0]?.age), field('Titre','tx-acc-c0titre',(d.cards||[])[0]?.titre)) + field('Description','tx-acc-c0desc',(d.cards||[])[0]?.desc,'textarea',3))}
    ${card('Carte Adolescents', row2(field('Âge','tx-acc-c1age',(d.cards||[])[1]?.age), field('Titre','tx-acc-c1titre',(d.cards||[])[1]?.titre)) + field('Description','tx-acc-c1desc',(d.cards||[])[1]?.desc,'textarea',3))}
    ${card('Carte Adultes', row2(field('Âge','tx-acc-c2age',(d.cards||[])[2]?.age), field('Titre','tx-acc-c2titre',(d.cards||[])[2]?.titre)) + field('Description','tx-acc-c2desc',(d.cards||[])[2]?.desc,'textarea',3))}
    ${card('Section Dojos', row2(field('Eyebrow','tx-acc-dojosEyebrow',d.dojosEyebrow), field('Titre','tx-acc-dojosTitre',d.dojosTitre)) + field('Accroche','tx-acc-dojosLede',d.dojosLede))}
    ${card('Section Coachs', row2(field('Eyebrow','tx-acc-coachsEyebrow',d.coachsEyebrow), field('Titre','tx-acc-coachsTitre',d.coachsTitre)) + field('Accroche','tx-acc-coachsLede',d.coachsLede))}
    ${card('Section Actus', row2(field('Eyebrow','tx-acc-actusEyebrow',d.actusEyebrow), field('Titre','tx-acc-actusTitre',d.actusTitre)) + field('Accroche','tx-acc-actusLede',d.actusLede))}
    ${card('Section Tarifs', row2(field('Eyebrow','tx-acc-tarifsEyebrow',d.tarifsEyebrow), field('Titre','tx-acc-tarifsTitre',d.tarifsTitre)) + field('Accroche','tx-acc-tarifsLede',d.tarifsLede))}
    ${card('Bandeau CTA', row2(field('Titre','tx-acc-ctaTitre',d.ctaTitre), field('Sous-titre','tx-acc-ctaSub',d.ctaSub)))}
  `; }

  function buildSimple(prefix, d, sections) {
    return sections.map(s => {
      if (s.type === 'hero') {
        return card('Héro', row2(field('Eyebrow', `${prefix}-heroEyebrow`, d.heroEyebrow), '') +
          row2(field('Ligne 1', `${prefix}-heroT1`, (d.heroTitre||[])[0]), field('Ligne 2', `${prefix}-heroT2`, (d.heroTitre||[])[1])));
      }
      if (s.type === 'cta') {
        return card('Bandeau CTA', row2(field('Titre', `${prefix}-ctaTitre`, d.ctaTitre), field('Sous-titre', `${prefix}-ctaSub`, d.ctaSub)));
      }
      const lede = s.lede ? field('Accroche', `${prefix}-${s.id}Lede`, d[s.id+'Lede']) : '';
      return card(s.label, row2(field('Eyebrow', `${prefix}-${s.id}Eyebrow`, d[s.id+'Eyebrow']), field('Titre', `${prefix}-${s.id}Titre`, d[s.id+'Titre'])) + lede);
    }).join('');
  }

  function buildTab(key) {
    const d = tx[key] || {};
    switch(key) {
      case 'accueil': return buildAccueil(d);
      case 'coachs': return buildSimple('ch', d, [
        { type:'hero' },
        { id:'s1', label:'Section principale', lede:true },
        { id:'s2', label:'Section diplômes', lede:true },
        { id:'s3', label:'Section formation continue', lede:false },
        { type:'cta' }
      ]);
      case 'dojos': return buildSimple('dj', d, [
        { type:'hero' },
        { id:'s1', label:'Section localisation', lede:true },
        { id:'s2', label:'Section infos pratiques', lede:false },
        { type:'cta' }
      ]);
      case 'actus': return buildSimple('ac', d, [
        { type:'hero' },
        { id:'s1', label:'Section actualités', lede:true },
        { type:'cta' }
      ]);
      case 'cours': return buildSimple('co', d, [
        { type:'hero' },
        { id:'s1', label:'Section niveaux', lede:true },
        { id:'s2', label:'Section déroulement', lede:true },
        { id:'s3', label:'Section premier cours', lede:false },
        { type:'cta' }
      ]);
      case 'tarifs': return buildSimple('ta', d, [
        { type:'hero' },
        { id:'s1', label:'Section formules', lede:true },
        { id:'s2', label:'Section FAQ', lede:false },
        { id:'s3', label:'Section comparatif', lede:false },
        { type:'cta' }
      ]);
      case 'galerie': return buildSimple('ga', d, [
        { type:'hero' },
        { id:'s1', label:'Section galerie', lede:true },
        { type:'cta' }
      ]);
      case 'inscription': return card('Héro', field('Eyebrow','tx-ins-heroEyebrow', d.heroEyebrow));
      case 'contact': return card('Héro', row2(field('Eyebrow','tx-con-heroEyebrow', d.heroEyebrow), '') +
        row2(field('Ligne 1','tx-con-heroT1',(d.heroTitre||[])[0]), field('Ligne 2','tx-con-heroT2',(d.heroTitre||[])[1])));
      default: return '';
    }
  }

  function collect(key) {
    const d = {...(tx[key] || {})};
    switch(key) {
      case 'accueil': {
        const cards = (d.cards || [{},{},{}]).map((c,i) => ({
          age:  fv(`tx-acc-c${i}age`)  || c.age,
          titre:fv(`tx-acc-c${i}titre`)|| c.titre,
          desc: (document.getElementById(`tx-acc-c${i}desc`)||{}).value || c.desc,
          couleur: c.couleur || ['#e0241b','#c9a227','#9a98a0'][i]
        }));
        return {
          disciplineEyebrow: fv('tx-acc-discEyebrow'),  disciplineTitre: fv('tx-acc-discTitre'),
          coursEyebrow: fv('tx-acc-coursEyebrow'),      coursTitre: fv('tx-acc-coursTitre'),      coursLede: fv('tx-acc-coursLede'),
          cards,
          dojosEyebrow: fv('tx-acc-dojosEyebrow'),     dojosTitre: fv('tx-acc-dojosTitre'),     dojosLede: fv('tx-acc-dojosLede'),
          coachsEyebrow:fv('tx-acc-coachsEyebrow'),    coachsTitre:fv('tx-acc-coachsTitre'),    coachsLede:fv('tx-acc-coachsLede'),
          actusEyebrow: fv('tx-acc-actusEyebrow'),     actusTitre: fv('tx-acc-actusTitre'),     actusLede: fv('tx-acc-actusLede'),
          tarifsEyebrow:fv('tx-acc-tarifsEyebrow'),    tarifsTitre:fv('tx-acc-tarifsTitre'),    tarifsLede:fv('tx-acc-tarifsLede'),
          ctaTitre: fv('tx-acc-ctaTitre'), ctaSub: fv('tx-acc-ctaSub')
        };
      }
      case 'coachs': return { heroEyebrow:fv('ch-heroEyebrow'), heroTitre:[fv('ch-heroT1'),fv('ch-heroT2')], s1Eyebrow:fv('ch-s1Eyebrow'),s1Titre:fv('ch-s1Titre'),s1Lede:fv('ch-s1Lede'), s2Eyebrow:fv('ch-s2Eyebrow'),s2Titre:fv('ch-s2Titre'),s2Lede:fv('ch-s2Lede'), s3Eyebrow:fv('ch-s3Eyebrow'),s3Titre:fv('ch-s3Titre'), ctaTitre:fv('ch-ctaTitre'),ctaSub:fv('ch-ctaSub') };
      case 'dojos':  return { heroEyebrow:fv('dj-heroEyebrow'), heroTitre:[fv('dj-heroT1'),fv('dj-heroT2')], s1Eyebrow:fv('dj-s1Eyebrow'),s1Titre:fv('dj-s1Titre'),s1Lede:fv('dj-s1Lede'), s2Eyebrow:fv('dj-s2Eyebrow'),s2Titre:fv('dj-s2Titre'), ctaTitre:fv('dj-ctaTitre'),ctaSub:fv('dj-ctaSub') };
      case 'actus':  return { heroEyebrow:fv('ac-heroEyebrow'), heroTitre:[fv('ac-heroT1')], s1Eyebrow:fv('ac-s1Eyebrow'),s1Titre:fv('ac-s1Titre'),s1Lede:fv('ac-s1Lede'), ctaTitre:fv('ac-ctaTitre'),ctaSub:fv('ac-ctaSub') };
      case 'cours':  return { heroEyebrow:fv('co-heroEyebrow'), heroTitre:[fv('co-heroT1'),fv('co-heroT2')], s1Eyebrow:fv('co-s1Eyebrow'),s1Titre:fv('co-s1Titre'),s1Lede:fv('co-s1Lede'), s2Eyebrow:fv('co-s2Eyebrow'),s2Titre:fv('co-s2Titre'),s2Lede:fv('co-s2Lede'), s3Eyebrow:fv('co-s3Eyebrow'),s3Titre:fv('co-s3Titre'), ctaTitre:fv('co-ctaTitre'),ctaSub:fv('co-ctaSub') };
      case 'tarifs': return { heroEyebrow:fv('ta-heroEyebrow'), heroTitre:[fv('ta-heroT1'),fv('ta-heroT2')], s1Eyebrow:fv('ta-s1Eyebrow'),s1Titre:fv('ta-s1Titre'),s1Lede:fv('ta-s1Lede'), s2Eyebrow:fv('ta-s2Eyebrow'),s2Titre:fv('ta-s2Titre'), s3Eyebrow:fv('ta-s3Eyebrow'),s3Titre:fv('ta-s3Titre'), ctaTitre:fv('ta-ctaTitre'),ctaSub:fv('ta-ctaSub') };
      case 'galerie':return { heroEyebrow:fv('ga-heroEyebrow'), heroTitre:[fv('ga-heroT1'),fv('ga-heroT2')], s1Eyebrow:fv('ga-s1Eyebrow'),s1Titre:fv('ga-s1Titre'),s1Lede:fv('ga-s1Lede'), ctaTitre:fv('ga-ctaTitre'),ctaSub:fv('ga-ctaSub') };
      case 'inscription': return { heroEyebrow:fv('tx-ins-heroEyebrow') };
      case 'contact':     return { heroEyebrow:fv('tx-con-heroEyebrow'), heroTitre:[fv('tx-con-heroT1'),fv('tx-con-heroT2')] };
      default: return d;
    }
  }

  function renderTabContent() {
    const body = document.getElementById('txTabBody');
    body.innerHTML = buildTab(activeTab);
  }

  container.innerHTML = `
<div class="admin-section-form" style="max-width:100%;">
  <div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:1.4rem;" id="txTabs"></div>
  <div id="txTabBody"></div>
  <div style="display:flex;gap:1rem;align-items:center;margin-top:1rem;">
    <button class="btn btn--primary" id="txSaveBtn">💾 Enregistrer la page</button>
    <span id="txSaveStatus" style="font-family:var(--mono);font-size:.75rem;color:var(--crimson-2);display:none;">Sauvegardé ✓</span>
  </div>
</div>`;

  // Build tabs
  const tabsEl = document.getElementById('txTabs');
  TABS.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'admin-btn admin-btn--edit';
    btn.textContent = t.label;
    btn.dataset.key = t.key;
    if (t.key === activeTab) btn.style.cssText = 'background:rgba(224,36,27,.15);border-color:var(--crimson-2);color:var(--bone);';
    btn.addEventListener('click', () => {
      activeTab = t.key;
      tabsEl.querySelectorAll('button').forEach(b => b.style.cssText = '');
      btn.style.cssText = 'background:rgba(224,36,27,.15);border-color:var(--crimson-2);color:var(--bone);';
      renderTabContent();
    });
    tabsEl.appendChild(btn);
  });

  renderTabContent();

  document.getElementById('txSaveBtn').addEventListener('click', () => {
    const newTx = {...(getSection('textes') || {})};
    newTx[activeTab] = collect(activeTab);
    saveSection('textes', newTx);
    const st = document.getElementById('txSaveStatus');
    st.style.display = 'block';
    setTimeout(() => st.style.display = 'none', 2000);
  });
}

/* ============ SECTION DISCIPLINE ============ */
function renderDisciplineSection(container) {
  const disc = getSection('discipline') || {};
  const piliers = disc.piliers || [{title:'',text:''},{title:'',text:''},{title:'',text:''}];
  const valeurs = disc.valeurs || [{icon:'',title:'',text:''},{icon:'',title:'',text:''},{icon:'',title:'',text:''}];

  container.innerHTML = `
<div class="admin-section-form">

  <div class="admin-card">
    <div class="admin-card__title">🦸 Héro de la page</div>
    <div class="admin-form-grid" style="margin-top:1rem;">
      <div class="admin-field"><label>Texte eyebrow</label><input id="disc-eyebrow" value="${esc(disc.heroEyebrow||'La discipline')}"></div>
    </div>
    <div style="margin-top:1rem;">
      <div class="admin-label" style="margin-bottom:.5rem;">Titre (2 lignes)</div>
      <div class="admin-form-grid">
        <div class="admin-field"><label>Ligne 1</label><input id="disc-h1" value="${esc((disc.heroTitle||[])[0]||'Voie de')}"></div>
        <div class="admin-field"><label>Ligne 2</label><input id="disc-h2" value="${esc((disc.heroTitle||[])[1]||'la vérité.')}"></div>
      </div>
    </div>
  </div>

  <div class="admin-card">
    <div class="admin-card__title">📜 Section Histoire</div>
    <div class="admin-field" style="margin-top:1rem;">
      <label>Titre (utilise \\n pour un saut de ligne)</label>
      <input id="disc-histoireTitre" value="${esc(disc.histoireTitre||'Le Shindokai,\nné en 2006.')}">
    </div>
    <p style="font-family:var(--mono);font-size:.72rem;color:var(--ash-2);margin-top:.5rem;">Les textes de présentation (aboutP1/P2/P3) sont éditables dans la section <strong>Club</strong>.</p>
  </div>

  <div class="admin-card">
    <div class="admin-card__title">🥊 Les 3 piliers</div>
    ${[0,1,2].map(i => `
    <div style="margin-top:1.2rem;padding-top:1.2rem;${i>0?'border-top:1px solid var(--line)':''}">
      <div class="admin-label" style="margin-bottom:.6rem;">Pilier ${i+1}</div>
      <div class="admin-form-grid">
        <div class="admin-field"><label>Titre</label><input id="disc-p${i}-title" value="${esc(piliers[i]?.title||'')}"></div>
      </div>
      <div class="admin-field" style="margin-top:.6rem;"><label>Texte</label><textarea id="disc-p${i}-text" rows="3">${esc(piliers[i]?.text||'')}</textarea></div>
    </div>`).join('')}
  </div>

  <div class="admin-card">
    <div class="admin-card__title">🙏 Les 3 valeurs</div>
    ${[0,1,2].map(i => `
    <div style="margin-top:1.2rem;padding-top:1.2rem;${i>0?'border-top:1px solid var(--line)':''}">
      <div class="admin-label" style="margin-bottom:.6rem;">Valeur ${i+1}</div>
      <div class="admin-form-grid">
        <div class="admin-field"><label>Emoji</label><input id="disc-v${i}-icon" value="${esc(valeurs[i]?.icon||'')}" style="max-width:80px;"></div>
        <div class="admin-field"><label>Titre</label><input id="disc-v${i}-title" value="${esc(valeurs[i]?.title||'')}"></div>
      </div>
      <div class="admin-field" style="margin-top:.6rem;"><label>Texte</label><textarea id="disc-v${i}-text" rows="3">${esc(valeurs[i]?.text||'')}</textarea></div>
    </div>`).join('')}
  </div>

  <div class="admin-card">
    <div class="admin-card__title">📣 Bandeau CTA</div>
    <div class="admin-form-grid" style="margin-top:1rem;">
      <div class="admin-field"><label>Titre</label><input id="disc-ctaTitre" value="${esc(disc.ctaTitre||'Rejoignez la discipline.')}"></div>
      <div class="admin-field"><label>Sous-titre</label><input id="disc-ctaSub" value="${esc(disc.ctaSub||'')}"></div>
    </div>
  </div>

  <button class="btn btn--primary" id="saveDisciplineBtn" style="align-self:flex-start;">💾 Enregistrer</button>
  <div id="discSaveStatus" style="font-family:var(--mono);font-size:.78rem;color:var(--crimson-2);display:none;">Sauvegardé ✓</div>
</div>`;

  document.getElementById('saveDisciplineBtn').addEventListener('click', () => {
    const newDisc = {
      heroEyebrow: document.getElementById('disc-eyebrow').value.trim(),
      heroTitle: [
        document.getElementById('disc-h1').value.trim(),
        document.getElementById('disc-h2').value.trim()
      ],
      histoireTitre: document.getElementById('disc-histoireTitre').value,
      piliers: [0,1,2].map(i => ({
        title: document.getElementById(`disc-p${i}-title`).value.trim(),
        text: document.getElementById(`disc-p${i}-text`).value.trim()
      })),
      valeurs: [0,1,2].map(i => ({
        icon: document.getElementById(`disc-v${i}-icon`).value.trim(),
        title: document.getElementById(`disc-v${i}-title`).value.trim(),
        text: document.getElementById(`disc-v${i}-text`).value.trim()
      })),
      ctaTitre: document.getElementById('disc-ctaTitre').value.trim(),
      ctaSub: document.getElementById('disc-ctaSub').value.trim()
    };
    saveSection('discipline', newDisc);
    const st = document.getElementById('discSaveStatus');
    st.style.display = 'block';
    setTimeout(() => st.style.display = 'none', 2000);
  });
}

/* ============ SECTION CONTACT ============ */
function renderContactSection(container) {
  const club = getSection('club');
  const settings = getSection('settings') || {};
  container.innerHTML = `
<div style="display:flex;flex-direction:column;gap:1.6rem;max-width:700px;">

  <div class="admin-card">
    <div class="admin-card__title">📞 Informations de contact</div>
    <p style="color:var(--ash);font-size:.82rem;margin:.4rem 0 1rem;">Ces infos s'affichent sur la page Contact et dans le footer.</p>
    <div class="admin-form-grid" style="margin-top:.5rem;">
      <div class="admin-field"><label>Email</label><input id="ct-email" class="admin-input" value="${esc(club.email)}"></div>
      <div class="admin-field"><label>Téléphone</label><input id="ct-phone" class="admin-input" value="${esc(club.phone)}"></div>
      <div class="admin-field"><label>Facebook</label><input id="ct-fb" class="admin-input" value="${esc(club.facebook)}"></div>
      <div class="admin-field"><label>Instagram</label><input id="ct-ig" class="admin-input" value="${esc(club.instagram)}"></div>
    </div>
    <button class="btn btn--primary" id="saveContactBtn" style="margin-top:1rem;">Enregistrer</button>
  </div>

  <div class="admin-card">
    <div class="admin-card__title">📧 Formulaire d'inscription — Web3Forms</div>
    <p style="color:var(--ash);font-size:.82rem;margin:.4rem 0 1rem;">Clé API Web3Forms pour recevoir les inscriptions par email.</p>
    <div class="admin-field">
      <label>Access Key Web3Forms</label>
      <input id="ct-w3f" class="admin-input" value="${esc(settings.web3formsKey || '109f2859-b8c5-49fa-b6e9-4fd2fee3c5ab')}" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx">
      <p style="font-size:.75rem;color:var(--ash-2);margin-top:.4rem;">Compte sur <a href="https://web3forms.com" target="_blank" style="color:var(--crimson-2);">web3forms.com</a> — 250 emails/mois gratuits.</p>
    </div>
    <button class="btn btn--primary" id="saveW3fBtn" style="margin-top:1rem;">Enregistrer la clé</button>
  </div>

</div>`;

  document.getElementById('saveContactBtn').addEventListener('click', () => {
    const data = getData();
    data.club = { ...data.club, email: fv('ct-email'), phone: fv('ct-phone'), facebook: fv('ct-fb'), instagram: fv('ct-ig') };
    saveData(data);
    showToast('Contact enregistré ✓');
  });

  document.getElementById('saveW3fBtn').addEventListener('click', () => {
    const data = getData();
    if (!data.settings) data.settings = {};
    data.settings.web3formsKey = fv('ct-w3f').trim();
    saveData(data);
    showToast('Clé Web3Forms enregistrée ✓');
  });
}

/* ============ SECTION PARAMÈTRES ============ */
function renderSettingsSection(container) {
  const settings = getSection('settings') || DEFAULT_DATA.settings || {};
  container.innerHTML = `
<div style="display:flex;flex-direction:column;gap:2rem;">
  <!-- Web3Forms -->
  <div class="admin-card">
    <div class="admin-card__title">📧 Web3Forms — clé API</div>
    <p style="color:var(--ash);font-size:.85rem;margin:.4rem 0 1rem;">Utilisée pour les formulaires d'inscription et de contact. Créez un compte sur <a href="https://web3forms.com" target="_blank" rel="noopener" style="color:var(--crimson-2);">web3forms.com</a> pour obtenir votre clé.</p>
    <div style="display:flex;gap:1rem;align-items:flex-end;flex-wrap:wrap;">
      <div style="flex:1;min-width:200px;"><label class="admin-label">Clé Web3Forms</label><input id="w3f-key" class="admin-input" value="${esc(settings.web3formsKey||'')}"></div>
      <button class="btn btn--primary" id="saveW3fBtn">Enregistrer</button>
    </div>
    <div id="w3fStatus" style="font-family:var(--mono);font-size:.75rem;color:var(--crimson-2);margin-top:.5rem;display:none;">Clé sauvegardée ✓</div>
  </div>
  <!-- Mot de passe -->
  <div class="admin-card">
    <div class="admin-card__title">Changer le mot de passe admin</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem;">
      <div><label class="admin-label">Nouveau mot de passe</label><input id="pw-new" type="password" class="admin-input" placeholder="••••••••"></div>
      <div><label class="admin-label">Confirmer</label><input id="pw-confirm" type="password" class="admin-input" placeholder="••••••••"></div>
    </div>
    <button class="btn btn--primary" id="savePwBtn" style="margin-top:1rem;">Changer le mot de passe</button>
  </div>
  <!-- Export / Import -->
  <div class="admin-card">
    <div class="admin-card__title">Sauvegarde des données</div>
    <p style="color:var(--ash);font-size:.85rem;margin:.6rem 0 1.2rem;">Exportez toutes les données du site en JSON. Importez pour restaurer une sauvegarde.</p>
    <div style="display:flex;gap:1rem;flex-wrap:wrap;">
      <button class="btn btn--ghost" id="exportBtn">⬇ Télécharger la sauvegarde</button>
      <label class="btn btn--ghost" style="cursor:pointer;">⬆ Importer une sauvegarde<input type="file" id="importFile" accept=".json" style="display:none;"></label>
    </div>
  </div>
  <!-- Reset -->
  <div class="admin-card" style="border-color:rgba(224,36,27,.3);">
    <div class="admin-card__title" style="color:var(--crimson-2);">Zone de danger</div>
    <p style="color:var(--ash);font-size:.85rem;margin:.6rem 0 1.2rem;">Réinitialiser toutes les données aux valeurs par défaut. Cette action est irréversible.</p>
    <button class="btn" style="background:rgba(224,36,27,.15);border:1px solid rgba(224,36,27,.4);color:var(--crimson-2);" id="resetBtn">⚠ Réinitialiser aux données par défaut</button>
  </div>
</div>`;

  document.getElementById('saveW3fBtn').addEventListener('click', () => {
    const key = document.getElementById('w3f-key').value.trim();
    const s = getSection('settings') || {};
    s.web3formsKey = key;
    saveSection('settings', s);
    const st = document.getElementById('w3fStatus');
    st.style.display = 'block';
    setTimeout(() => st.style.display = 'none', 2500);
  });

  document.getElementById('savePwBtn').addEventListener('click', () => {
    const pw = fv('pw-new').trim();
    const conf = fv('pw-confirm').trim();
    if (!pw) { showToast('Entrez un mot de passe', false); return; }
    if (pw !== conf) { showToast('Les mots de passe ne correspondent pas', false); return; }
    const data = getData();
    data.adminPassword = pw;
    saveData(data);
    fs('pw-new', ''); fs('pw-confirm', '');
    showToast('Mot de passe modifié ✓');
  });

  document.getElementById('exportBtn').addEventListener('click', () => {
    const data = getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `shindokai-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Sauvegarde téléchargée ✓');
  });

  document.getElementById('importFile').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        saveData(data);
        showToast('Données importées ✓ — rechargement…');
        setTimeout(() => location.reload(), 1200);
      } catch {
        showToast('Fichier JSON invalide', false);
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('Réinitialiser TOUTES les données ? Cette action est irréversible.')) return;
    resetData();
    showToast('Données réinitialisées — rechargement…');
    setTimeout(() => location.reload(), 1200);
  });
}

/* ============ MODAL GÉNÉRIQUE ============ */
function openModal(title, fields, onSave) {
  const modal = document.getElementById('adminModal');
  const fieldsHtml = fields.map(f => `
    <div>
      <label class="admin-modal-label">${esc(f.label)}</label>
      ${f.textarea
        ? `<textarea id="${esc(f.id)}" class="admin-modal-input" rows="3">${esc(f.value ?? '')}</textarea>`
        : `<input id="${esc(f.id)}" class="admin-modal-input" value="${esc(f.value ?? '')}">`}
    </div>`).join('');

  modal.innerHTML = `
<div class="admin-modal__box">
  <div class="admin-modal__title">${esc(title)}</div>
  ${fieldsHtml}
  <div style="display:flex;gap:.8rem;justify-content:flex-end;padding-top:.8rem;border-top:1px solid var(--line);">
    <button class="btn btn--ghost" id="genericModalCancel">Annuler</button>
    <button class="btn btn--primary" id="genericModalSave">Enregistrer</button>
  </div>
</div>`;

  modal.classList.add('is-open');
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.getElementById('genericModalCancel').addEventListener('click', closeModal);
  document.getElementById('genericModalSave').addEventListener('click', onSave);
  if (fields[0]) {
    const first = document.getElementById(fields[0].id);
    if (first) first.focus();
  }
}

function closeModal() {
  const modal = document.getElementById('adminModal');
  if (modal) modal.classList.remove('is-open');
  editingIndex = null;
}

/* ============ DRAG & DROP (réordonnement) ============ */
function initDragSort(container, sectionKey) {
  let dragged = null;
  container.querySelectorAll('[draggable="true"]').forEach(row => {
    row.addEventListener('dragstart', e => { dragged = row; row.style.opacity = '.4'; });
    row.addEventListener('dragend', () => { dragged.style.opacity = '1'; dragged = null; });
    row.addEventListener('dragover', e => { e.preventDefault(); });
    row.addEventListener('drop', e => {
      e.preventDefault();
      if (!dragged || dragged === row) return;
      const items = getSection(sectionKey);
      const fromI = +dragged.dataset.i;
      const toI = +row.dataset.i;
      const [moved] = items.splice(fromI, 1);
      items.splice(toI, 0, moved);
      saveSection(sectionKey, items);
      renderActusList();
    });
  });
}

/* ============================================================
   SECTION INSCRIPTION
   ============================================================ */
function renderInscriptionSection(container) {
  container.innerHTML = `
    <!-- Onglets -->
    <div style="display:flex;gap:0;border-bottom:1px solid var(--line);margin-bottom:2rem;">
      <button class="insc-tab is-active" data-tab="champs"     style="font-family:var(--eyebrow);font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;padding:.85rem 1.6rem;border-bottom:2px solid var(--crimson-2);color:var(--bone);background:none;border-top:none;border-left:none;border-right:none;cursor:pointer;">⚙ Champs du formulaire</button>
      <button class="insc-tab"           data-tab="reponses"   style="font-family:var(--eyebrow);font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;padding:.85rem 1.6rem;border-bottom:2px solid transparent;color:var(--ash);background:none;border-top:none;border-left:none;border-right:none;cursor:pointer;">📥 Réponses reçues</button>
      <button class="insc-tab"           data-tab="parametres" style="font-family:var(--eyebrow);font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;padding:.85rem 1.6rem;border-bottom:2px solid transparent;color:var(--ash);background:none;border-top:none;border-left:none;border-right:none;cursor:pointer;">✉ Paramètres</button>
    </div>
    <div id="inscTab-champs"></div>
    <div id="inscTab-reponses"   style="display:none;"></div>
    <div id="inscTab-parametres" style="display:none;"></div>`;

  /* Gestion des onglets */
  container.querySelectorAll('.insc-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.insc-tab').forEach(b => {
        b.style.borderBottomColor = 'transparent';
        b.style.color = 'var(--ash)';
        b.classList.remove('is-active');
      });
      btn.style.borderBottomColor = 'var(--crimson-2)';
      btn.style.color = 'var(--bone)';
      btn.classList.add('is-active');
      ['champs','reponses','parametres'].forEach(t =>
        document.getElementById(`inscTab-${t}`).style.display = t === btn.dataset.tab ? '' : 'none');
      if (btn.dataset.tab === 'champs')     renderInscChamps();
      if (btn.dataset.tab === 'reponses')   renderInscReponses();
      if (btn.dataset.tab === 'parametres') renderInscParametres();
    });
  });

  renderInscChamps();
}

/* ── Onglet Champs ── */
function renderInscChamps() {
  const el = document.getElementById('inscTab-champs');
  const insc = getSection('inscription');
  const fields = insc.fields || [];

  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.4rem;">
      <p style="color:var(--ash);font-size:.88rem;">Activez/désactivez les champs, rendez-les obligatoires, ou ajoutez des champs personnalisés.</p>
      <button class="btn btn--primary" id="addCustomField" style="padding:.55rem 1rem;font-size:.75rem;white-space:nowrap;">+ Champ personnalisé</button>
    </div>
    <div id="inscFieldsList"></div>`;

  renderInscFieldsList();

  document.getElementById('addCustomField').addEventListener('click', () => openInscFieldModal(null));
}

function renderInscFieldsList() {
  const el = document.getElementById('inscFieldsList');
  if (!el) return;
  const insc = getSection('inscription');
  const fields = insc.fields || [];
  const groups = {};
  fields.forEach((f, i) => {
    if (!groups[f.group]) groups[f.group] = [];
    groups[f.group].push({ ...f, _i: i });
  });

  el.innerHTML = Object.entries(groups).map(([g, gFields]) => `
    <div style="margin-bottom:1.8rem;">
      <div style="font-family:var(--eyebrow);font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--crimson-2);border-bottom:1px solid var(--line);padding-bottom:.5rem;margin-bottom:.8rem;">${esc(g)}</div>
      ${gFields.map(f => `
        <div style="display:flex;align-items:center;gap:1rem;padding:.75rem 1rem;background:var(--char);border:1px solid var(--line);margin-bottom:.4rem;border-left:3px solid ${f.enabled ? 'var(--crimson-2)' : 'var(--line)'};">
          <div style="flex:1;">
            <span style="font-family:var(--eyebrow);font-size:.88rem;color:${f.enabled ? 'var(--bone)' : 'var(--ash-2)'};">${esc(f.label)}</span>
            <span style="font-family:var(--mono);font-size:.7rem;color:var(--ash-2);margin-left:.8rem;">${esc(f.type)}${f.required ? ' · <span style="color:var(--crimson-2)">obligatoire</span>' : ''}</span>
          </div>
          <label style="display:flex;align-items:center;gap:.4rem;font-family:var(--eyebrow);font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ash-2);cursor:pointer;">
            <input type="checkbox" data-field-i="${f._i}" data-action="enabled" ${f.enabled ? 'checked' : ''} style="accent-color:var(--crimson-2);"> Actif
          </label>
          <label style="display:flex;align-items:center;gap:.4rem;font-family:var(--eyebrow);font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ash-2);cursor:pointer;">
            <input type="checkbox" data-field-i="${f._i}" data-action="required" ${f.required ? 'checked' : ''} style="accent-color:var(--crimson-2);"> Requis
          </label>
          ${f.id.startsWith('custom_') ? `<button data-field-i="${f._i}" data-action="edit" style="font-family:var(--eyebrow);font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;padding:.3rem .7rem;background:rgba(255,255,255,.05);border:1px solid var(--line);color:var(--ash);cursor:pointer;">✏</button>
          <button data-field-i="${f._i}" data-action="delete" style="font-family:var(--eyebrow);font-size:.7rem;padding:.3rem .7rem;background:rgba(224,36,27,.08);border:1px solid rgba(224,36,27,.2);color:var(--crimson-2);cursor:pointer;">✕</button>` : ''}
        </div>`).join('')}
    </div>`).join('');

  /* Events */
  el.querySelectorAll('input[data-action]').forEach(inp => {
    inp.addEventListener('change', () => {
      const insc = getSection('inscription');
      const i = +inp.dataset.fieldI;
      if (inp.dataset.action === 'enabled')  insc.fields[i].enabled  = inp.checked;
      if (inp.dataset.action === 'required') insc.fields[i].required = inp.checked;
      saveSection('inscription', insc);
      showToast('Champ mis à jour ✓');
      renderInscFieldsList();
    });
  });
  el.querySelectorAll('button[data-action="edit"]').forEach(btn =>
    btn.addEventListener('click', () => openInscFieldModal(+btn.dataset.fieldI)));
  el.querySelectorAll('button[data-action="delete"]').forEach(btn =>
    btn.addEventListener('click', () => {
      if (!confirmDel('Supprimer ce champ personnalisé ?')) return;
      const insc = getSection('inscription');
      insc.fields.splice(+btn.dataset.fieldI, 1);
      saveSection('inscription', insc);
      showToast('Champ supprimé');
      renderInscFieldsList();
    }));
}

/* Modal champ personnalisé */
function openInscFieldModal(fieldIndex) {
  const insc = getSection('inscription');
  const existing = fieldIndex !== null ? insc.fields[fieldIndex] : null;
  const modal = document.getElementById('adminModal');
  modal.innerHTML = `
    <div class="modal-box" style="max-width:480px;">
      <div style="font-family:var(--display);font-size:1.2rem;text-transform:uppercase;margin-bottom:1.4rem;">${existing ? 'Modifier le champ' : 'Nouveau champ personnalisé'}</div>
      <div style="display:flex;flex-direction:column;gap:.9rem;">
        <div>
          <label style="font-family:var(--eyebrow);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ash-2);display:block;margin-bottom:.35rem;">Label (affiché sur le formulaire)</label>
          <input id="cf-label" type="text" value="${esc(existing?.label||'')}" placeholder="Ex: Nom du club précédent" style="background:var(--char-2);border:1px solid var(--line);color:var(--bone);padding:.8rem 1rem;width:100%;font-family:var(--body);font-size:.92rem;">
        </div>
        <div>
          <label style="font-family:var(--eyebrow);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ash-2);display:block;margin-bottom:.35rem;">Type de champ</label>
          <select id="cf-type" style="background:var(--char-2);border:1px solid var(--line);color:var(--bone);padding:.8rem 1rem;width:100%;font-family:var(--body);font-size:.92rem;">
            <option value="text"     ${existing?.type==='text'?'selected':''}>Texte court</option>
            <option value="textarea" ${existing?.type==='textarea'?'selected':''}>Texte long</option>
            <option value="select"   ${existing?.type==='select'?'selected':''}>Menu déroulant</option>
            <option value="checkbox" ${existing?.type==='checkbox'?'selected':''}>Case à cocher</option>
            <option value="number"   ${existing?.type==='number'?'selected':''}>Nombre</option>
            <option value="date"     ${existing?.type==='date'?'selected':''}>Date</option>
          </select>
        </div>
        <div id="cf-options-wrap" style="${existing?.type==='select'?'':'display:none'}">
          <label style="font-family:var(--eyebrow);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ash-2);display:block;margin-bottom:.35rem;">Options (une par ligne)</label>
          <textarea id="cf-options" rows="4" placeholder="Option 1&#10;Option 2&#10;Option 3" style="background:var(--char-2);border:1px solid var(--line);color:var(--bone);padding:.8rem 1rem;width:100%;font-family:var(--body);font-size:.9rem;">${(existing?.options||[]).join('\n')}</textarea>
        </div>
        <div>
          <label style="font-family:var(--eyebrow);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ash-2);display:block;margin-bottom:.35rem;">Groupe / Catégorie</label>
          <input id="cf-group" type="text" value="${esc(existing?.group||'Informations complémentaires')}" placeholder="Ex: Informations complémentaires" style="background:var(--char-2);border:1px solid var(--line);color:var(--bone);padding:.8rem 1rem;width:100%;font-family:var(--body);font-size:.92rem;">
        </div>
        <label style="display:flex;align-items:center;gap:.7rem;font-size:.88rem;color:var(--ash);cursor:pointer;">
          <input type="checkbox" id="cf-required" ${existing?.required?'checked':''} style="accent-color:var(--crimson-2);"> Champ obligatoire
        </label>
      </div>
      <div style="display:flex;gap:.8rem;justify-content:flex-end;margin-top:1.6rem;padding-top:1rem;border-top:1px solid var(--line);">
        <button class="btn btn--ghost" onclick="closeModal()">Annuler</button>
        <button class="btn btn--primary" id="cf-save">Enregistrer</button>
      </div>
    </div>`;
  modal.classList.add('is-open');

  document.getElementById('cf-type').addEventListener('change', function() {
    document.getElementById('cf-options-wrap').style.display = this.value === 'select' ? '' : 'none';
  });

  document.getElementById('cf-save').addEventListener('click', () => {
    const label = document.getElementById('cf-label').value.trim();
    if (!label) { alert('Le label est obligatoire.'); return; }
    const type  = document.getElementById('cf-type').value;
    const group = document.getElementById('cf-group').value.trim() || 'Informations complémentaires';
    const req   = document.getElementById('cf-required').checked;
    const opts  = type === 'select' ? document.getElementById('cf-options').value.split('\n').map(s=>s.trim()).filter(Boolean) : [];
    const insc  = getSection('inscription');
    const field = {
      id: existing?.id || `custom_${Date.now()}`,
      label, type, required: req, enabled: true, group,
      placeholder: '', options: opts
    };
    if (fieldIndex !== null) insc.fields[fieldIndex] = field;
    else insc.fields.push(field);
    saveSection('inscription', insc);
    closeModal();
    showToast(fieldIndex !== null ? 'Champ modifié ✓' : 'Champ ajouté ✓');
    renderInscFieldsList();
  });
}

/* ── Onglet Réponses ── */
function renderInscReponses() {
  const el = document.getElementById('inscTab-reponses');
  const insc = getSection('inscription');
  const subs = insc.submissions || [];

  if (!subs.length) {
    el.innerHTML = `<div style="text-align:center;padding:4rem 2rem;color:var(--ash-2);">
      <div style="font-size:2.5rem;margin-bottom:1rem;">📭</div>
      <p style="font-family:var(--mono);font-size:.85rem;">Aucune inscription reçue pour le moment.</p>
      <p style="font-size:.82rem;margin-top:.5rem;">Les inscriptions soumises via le formulaire apparaîtront ici.</p>
    </div>`;
    return;
  }

  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.4rem;">
      <p style="color:var(--ash);font-size:.88rem;">${subs.length} inscription(s) reçue(s)</p>
      <div style="display:flex;gap:.8rem;">
        <button class="btn btn--ghost" id="exportCsv" style="padding:.55rem 1rem;font-size:.75rem;">⬇ Exporter CSV</button>
        <button class="btn btn--ghost" id="clearSubs" style="padding:.55rem 1rem;font-size:.75rem;color:var(--crimson-2);border-color:rgba(224,36,27,.3);">✕ Tout effacer</button>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:.8rem;" id="subsList"></div>`;

  const list = document.getElementById('subsList');
  subs.forEach((sub, i) => {
    const nom    = sub.fields?.nom    || '';
    const prenom = sub.fields?.prenom || '';
    const email  = sub.fields?.email  || '';
    const dojo   = sub.fields?.dojo   || '';
    const cours  = sub.fields?.cours  || '';

    const item = document.createElement('div');
    item.style.cssText = 'background:var(--char);border:1px solid var(--line);border-radius:2px;overflow:hidden;';
    item.innerHTML = `
      <div style="display:flex;align-items:center;gap:1rem;padding:1rem 1.2rem;cursor:pointer;" class="sub-header">
        <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--crimson),var(--crimson-2));display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:1rem;flex-shrink:0;">${esc((prenom[0]||'?').toUpperCase())}</div>
        <div style="flex:1;">
          <div style="font-family:var(--eyebrow);font-size:.92rem;">${esc(prenom)} ${esc(nom)}</div>
          <div style="font-family:var(--mono);font-size:.72rem;color:var(--ash-2);">${esc(email)} ${dojo ? '· '+esc(dojo) : ''} ${cours ? '· '+esc(cours) : ''}</div>
        </div>
        <span style="font-family:var(--mono);font-size:.72rem;color:var(--ash-2);">${esc(sub.date||'')}</span>
        <button data-sub-i="${i}" class="del-sub" style="font-family:var(--eyebrow);font-size:.68rem;padding:.3rem .6rem;background:rgba(224,36,27,.08);border:1px solid rgba(224,36,27,.2);color:var(--crimson-2);cursor:pointer;">✕</button>
        <span class="chevron" style="color:var(--ash-2);transition:transform .2s;">▼</span>
      </div>
      <div class="sub-detail" style="display:none;padding:1.2rem;border-top:1px solid var(--line);background:var(--char-2);">
        ${Object.entries(sub.fields||{}).map(([k,v]) => {
          const field = (insc.fields||[]).find(f => f.id === k);
          const label = field ? field.label : k;
          const val = typeof v === 'boolean' ? (v ? '✓ Oui' : '✗ Non') : esc(String(v||'—'));
          return `<div style="display:flex;gap:1rem;padding:.4rem 0;border-bottom:1px solid var(--line);">
            <span style="font-family:var(--eyebrow);font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ash-2);width:180px;flex-shrink:0;">${esc(label)}</span>
            <span style="font-size:.88rem;color:var(--bone);">${val}</span>
          </div>`;
        }).join('')}
      </div>`;
    list.appendChild(item);

    /* Toggle détail */
    item.querySelector('.sub-header').addEventListener('click', e => {
      if (e.target.classList.contains('del-sub')) return;
      const detail = item.querySelector('.sub-detail');
      const chevron = item.querySelector('.chevron');
      const open = detail.style.display !== 'none';
      detail.style.display = open ? 'none' : '';
      chevron.style.transform = open ? '' : 'rotate(180deg)';
    });
  });

  /* Supprimer une inscription */
  list.querySelectorAll('.del-sub').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (!confirmDel('Supprimer cette inscription ?')) return;
      const insc = getSection('inscription');
      insc.submissions.splice(+btn.dataset.subI, 1);
      saveSection('inscription', insc);
      showToast('Inscription supprimée');
      renderInscReponses();
    });
  });

  /* Effacer tout */
  document.getElementById('clearSubs').addEventListener('click', () => {
    if (!confirmDel(`Effacer les ${subs.length} inscription(s) ? Cette action est irréversible.`)) return;
    const insc = getSection('inscription');
    insc.submissions = [];
    saveSection('inscription', insc);
    showToast('Inscriptions effacées');
    renderInscReponses();
  });

  /* Export CSV */
  document.getElementById('exportCsv').addEventListener('click', () => {
    const insc = getSection('inscription');
    const subs = insc.submissions || [];
    if (!subs.length) return;
    const headers = ['Date', ...(insc.fields||[]).filter(f=>f.enabled).map(f=>f.label)];
    const rows = subs.map(sub => [
      sub.date||'',
      ...(insc.fields||[]).filter(f=>f.enabled).map(f => {
        const v = sub.fields?.[f.id];
        return typeof v === 'boolean' ? (v ? 'Oui' : 'Non') : (v||'');
      })
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv);
    a.download = `inscriptions-shindokai-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    showToast('Export CSV téléchargé ✓');
  });
}

/* ── Onglet Paramètres inscription ── */
function renderInscParametres() {
  const el = document.getElementById('inscTab-parametres');
  const insc = getSection('inscription');
  el.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:1.4rem;max-width:560px;">
      <div>
        <label style="font-family:var(--eyebrow);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ash-2);display:block;margin-bottom:.4rem;">Titre du formulaire</label>
        <input id="insc-titre-input" type="text" value="${esc(insc.titre||'')}" style="background:var(--char-2);border:1px solid var(--line);color:var(--bone);padding:.85rem 1rem;width:100%;font-family:var(--body);font-size:.92rem;">
      </div>
      <div>
        <label style="font-family:var(--eyebrow);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ash-2);display:block;margin-bottom:.4rem;">Texte d'introduction</label>
        <textarea id="insc-intro-input" rows="4" style="background:var(--char-2);border:1px solid var(--line);color:var(--bone);padding:.85rem 1rem;width:100%;font-family:var(--body);font-size:.92rem;">${esc(insc.intro||'')}</textarea>
      </div>
      <div>
        <label style="font-family:var(--eyebrow);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ash-2);display:block;margin-bottom:.4rem;">ID Formspree (pour recevoir les inscriptions par email)</label>
        <input id="insc-formspree-input" type="text" value="${esc(insc.formspreeId||'')}" placeholder="Ex: xpzgkwrd — laisser vide pour mailto" style="background:var(--char-2);border:1px solid var(--line);color:var(--bone);padding:.85rem 1rem;width:100%;font-family:var(--body);font-size:.92rem;">
        <p style="font-size:.78rem;color:var(--ash-2);margin-top:.4rem;">Créez un compte gratuit sur <a href="https://formspree.io" target="_blank" style="color:var(--crimson-2);">formspree.io</a> pour recevoir les inscriptions par email.</p>
      </div>
      <button class="btn btn--primary" id="saveInscParams" style="align-self:flex-start;">Enregistrer les paramètres</button>
    </div>`;

  document.getElementById('saveInscParams').addEventListener('click', () => {
    const insc = getSection('inscription');
    insc.titre      = document.getElementById('insc-titre-input').value.trim();
    insc.intro      = document.getElementById('insc-intro-input').value.trim();
    insc.formspreeId = document.getElementById('insc-formspree-input').value.trim();
    saveSection('inscription', insc);
    showToast('Paramètres sauvegardés ✓');
  });
}

/* ============ SECTION CEINTURES NOIRES ============ */
function renderCeinturesNoiresSection(container) {
  container.innerHTML = `<div id="cnAdmin"></div><button class="btn btn--ghost" id="addCnBtn" style="margin-top:1rem;">+ Ajouter une ceinture noire</button>`;
  renderCeinturesNoiresList();
  document.getElementById('addCnBtn').addEventListener('click', () => {
    editingIndex = null;
    openCeintureNoireModal(null);
  });
}

function renderCeinturesNoiresList() {
  const list = getSection('ceintures_noires') || [];
  const el = document.getElementById('cnAdmin');
  if (!el) return;
  el.innerHTML = '';
  if (!list.length) { el.innerHTML = '<p class="admin-empty">Aucune ceinture noire enregistrée.</p>'; return; }
  list.forEach((c, i) => {
    const row = document.createElement('div');
    row.className = 'admin-item';
    row.innerHTML = `
      <div class="admin-item__info">
        <div class="admin-item__tag">${esc(c.dan)}</div>
        <div class="admin-item__title">${esc(c.name)}</div>
        ${c.dojo ? `<div class="admin-item__date">Dojo : ${esc(c.dojo)}</div>` : ''}
      </div>
      <div class="admin-item__actions">
        <button class="admin-btn admin-btn--edit" data-i="${i}">✏ Modifier</button>
        <button class="admin-btn admin-btn--del" data-i="${i}">✕</button>
      </div>`;
    el.appendChild(row);
  });
  el.querySelectorAll('.admin-btn--edit').forEach(btn =>
    btn.addEventListener('click', () => openCeintureNoireModal(+btn.dataset.i))
  );
  el.querySelectorAll('.admin-btn--del').forEach(btn =>
    btn.addEventListener('click', () => {
      if (!confirmDel('Supprimer cette ceinture noire ?')) return;
      const list = getSection('ceintures_noires');
      list.splice(+btn.dataset.i, 1);
      saveSection('ceintures_noires', list);
      renderCeinturesNoiresList();
    })
  );
}

function openCeintureNoireModal(index) {
  editingIndex = index;
  const list = getSection('ceintures_noires') || [];
  const c = index !== null ? list[index] : { name: '', dan: '', dojo: '', photo: '' };
  openModal('Ceinture noire', [
    { id: 'cn-name',  label: 'Nom complet',   value: c.name },
    { id: 'cn-dan',   label: 'Grade (ex: 3e Dan Shindokai)', value: c.dan },
    { id: 'cn-dojo',  label: 'Dojo (facultatif)', value: c.dojo || '' },
    { id: 'cn-photo', label: 'URL Photo (facultatif)', value: c.photo || '' }
  ], () => {
    const list = getSection('ceintures_noires') || [];
    const entry = {
      name: fv('cn-name'),
      dan:  fv('cn-dan'),
      dojo: fv('cn-dojo'),
      photo: fv('cn-photo')
    };
    if (editingIndex !== null) list[editingIndex] = entry;
    else list.push(entry);
    saveSection('ceintures_noires', list);
    renderCeinturesNoiresList();
    closeModal();
    showToast('Ceinture noire enregistrée ✓');
  });
}

/* ============ SECTION MEMBRES ============ */
/* ============================================================
   ESPACE MEMBRES — GESTION COMPLÈTE DES JEUX
   ============================================================ */

/* Onglet actif de la section membres */
let membresTab = 'acces';

function renderMembresSection(container) {
  const tabs = [
    { id:'acces',      label:'🔑 Accès & membres' },
    { id:'quiz',       label:'🎯 Quiz' },
    { id:'flashcards', label:'📚 Flashcards' },
    { id:'memory',     label:'🃏 Memory' },
    { id:'ceintures',  label:'🥋 Ceintures' }
  ];

  container.innerHTML = `
    <div style="display:flex;gap:0;border-bottom:1px solid var(--line);margin-bottom:2rem;flex-wrap:wrap;">
      ${tabs.map(t => `
        <button class="membres-tab${membresTab===t.id?' is-active':''}" data-tab="${t.id}"
          style="font-family:var(--eyebrow);font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;
          padding:.85rem 1.3rem;border-bottom:2px solid ${membresTab===t.id?'var(--gold)':'transparent'};
          color:${membresTab===t.id?'var(--bone)':'var(--ash)'};background:none;
          border-top:none;border-left:none;border-right:none;cursor:pointer;white-space:nowrap;">
          ${t.label}
        </button>`).join('')}
    </div>
    <div id="membresTabContent" style="max-width:900px;"></div>`;

  /* Gestion des onglets */
  container.querySelectorAll('.membres-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      membresTab = btn.dataset.tab;
      container.querySelectorAll('.membres-tab').forEach(b => {
        b.style.borderBottomColor = b.dataset.tab === membresTab ? 'var(--gold)' : 'transparent';
        b.style.color = b.dataset.tab === membresTab ? 'var(--bone)' : 'var(--ash)';
      });
      renderMembresTab();
    });
  });

  renderMembresTab();
}

function renderMembresTab() {
  const content = document.getElementById('membresTabContent');
  if (!content) return;
  content.innerHTML = '';
  const renders = {
    acces:      renderMembresAcces,
    quiz:       renderMembresQuiz,
    flashcards: renderMembresFlashcards,
    memory:     renderMembresMemory,
    ceintures:  renderMembresCeintures
  };
  if (renders[membresTab]) renders[membresTab](content);
}

/* ── Onglet Accès & Membres ── */
function renderMembresAcces(container) {
  const m = getSection('membres') || {};
  const jeux = [
    ['quiz','🎯 Quiz des ceintures & règles'],
    ['flashcards','📚 Flashcards vocabulaire japonais'],
    ['memory','🃏 Jeu de Memory']
  ];
  container.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:1.6rem;">

      <!-- MDP -->
      <div class="admin-card">
        <div class="admin-card__title">🔑 Mot de passe de l'Espace Membres</div>
        <p style="color:var(--ash);font-size:.85rem;margin:.5rem 0 1rem;">Partagez ce mot de passe avec tous les membres du club.</p>
        <div style="display:flex;gap:1rem;align-items:flex-end;">
          <div style="flex:1;"><label class="admin-label">Mot de passe</label>
            <input id="mpw-input" type="text" class="admin-input" value="${esc(m.password||'dojo2025')}"></div>
          <button class="btn btn--primary" id="saveMpwBtn" style="padding:.7rem 1.2rem;flex-shrink:0;">Enregistrer</button>
        </div>
      </div>

      <!-- Jeux actifs -->
      <div class="admin-card">
        <div class="admin-card__title">🎮 Jeux disponibles</div>
        <p style="color:var(--ash);font-size:.85rem;margin:.5rem 0 1rem;">Activez ou désactivez les jeux visibles par les membres.</p>
        <div style="display:flex;flex-direction:column;gap:.6rem;">
          ${jeux.map(([k,l]) => `
            <label style="display:flex;align-items:center;gap:.8rem;padding:.8rem 1rem;background:var(--char-2);border:1px solid var(--line);cursor:pointer;border-left:3px solid ${(m.jeux||{})[k]!==false?'var(--gold)':'var(--line)'};">
              <input type="checkbox" data-jeu="${k}" ${(m.jeux||{})[k]!==false?'checked':''} style="accent-color:var(--gold);width:16px;height:16px;">
              <span style="font-family:var(--eyebrow);font-size:.85rem;">${l}</span>
            </label>`).join('')}
        </div>
        <button class="btn btn--primary" id="saveJeuxBtn" style="margin-top:1rem;">Enregistrer</button>
      </div>

      <!-- Profils -->
      <div class="admin-card">
        <div class="admin-card__title">👤 Profils des membres</div>
        <p style="color:var(--ash);font-size:.85rem;margin:.5rem 0 1rem;">Membres ayant joué depuis ce navigateur.</p>
        <div id="membresProfiles"></div>
      </div>
    </div>`;

  document.getElementById('saveMpwBtn').addEventListener('click', () => {
    const m = getSection('membres');
    m.password = document.getElementById('mpw-input').value.trim() || 'dojo2025';
    saveSection('membres', m);
    showToast('Mot de passe membres modifié ✓');
  });

  document.getElementById('saveJeuxBtn').addEventListener('click', () => {
    const m = getSection('membres');
    if (!m.jeux) m.jeux = {};
    document.querySelectorAll('[data-jeu]').forEach(cb => {
      m.jeux[cb.dataset.jeu] = cb.checked;
      cb.closest('label').style.borderLeftColor = cb.checked ? 'var(--gold)' : 'var(--line)';
    });
    saveSection('membres', m);
    showToast('Jeux mis à jour ✓');
  });

  const profilesEl = document.getElementById('membresProfiles');
  const keys = Object.keys(localStorage).filter(k => k.startsWith('shindokai_progression_'));
  if (!keys.length) {
    profilesEl.innerHTML = '<p class="admin-empty">Aucun membre n\'a encore joué depuis ce navigateur.</p>';
  } else {
    profilesEl.innerHTML = keys.map(k => {
      try {
        const p = JSON.parse(localStorage.getItem(k));
        const prenom = k.replace('shindokai_progression_','');
        const nb = (p.badges||[]).length;
        const belt = nb >= 15 ? '⬛' : nb >= 14 ? '🟤' : nb >= 12 ? '🔵' : nb >= 9 ? '🟢' : nb >= 6 ? '🟠' : nb >= 3 ? '🟡' : '⬜';
        return `<div class="admin-item" style="margin-bottom:.4rem;">
          <div class="admin-item__info">
            <div class="admin-item__title">${belt} ${esc(prenom.charAt(0).toUpperCase()+prenom.slice(1))}</div>
            <div class="admin-item__date">${nb} badge${nb>1?'s':''} · ${esc(p.lastLogin||'?')}</div>
          </div>
          <button class="admin-btn admin-btn--del" data-key="${esc(k)}">✕ Effacer</button>
        </div>`;
      } catch { return ''; }
    }).join('');
    profilesEl.querySelectorAll('.admin-btn--del').forEach(btn =>
      btn.addEventListener('click', () => {
        if (!confirmDel('Effacer les données de ce membre ?')) return;
        localStorage.removeItem(btn.dataset.key);
        renderMembresAcces(container);
      }));
  }
}

/* ── Onglet Quiz ── */
function renderMembresQuiz(container) {
  const m = getSection('membres') || {};
  const quiz = m.quiz || [];
  const cats = [...new Set(quiz.map(q => q.categorie))];

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem;flex-wrap:wrap;gap:.8rem;">
      <div>
        <span style="font-family:var(--mono);font-size:.85rem;color:var(--ash);">${quiz.length} question${quiz.length>1?'s':''}</span>
        ${cats.map(c => `<span style="font-family:var(--eyebrow);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;padding:.2rem .6rem;background:rgba(201,162,39,.1);border:1px solid rgba(201,162,39,.2);color:var(--gold);margin-left:.5rem;">${esc(c)}</span>`).join('')}
      </div>
      <button class="btn btn--primary" id="addQuizBtn" style="padding:.6rem 1.1rem;font-size:.75rem;">+ Nouvelle question</button>
    </div>

    <!-- Filtre catégories -->
    <div style="display:flex;gap:.5rem;margin-bottom:1rem;flex-wrap:wrap;">
      <button class="quiz-filter is-active" data-cat="all" style="font-family:var(--eyebrow);font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;padding:.35rem .8rem;background:var(--crimson);border:1px solid var(--crimson);color:#fff;cursor:pointer;">Toutes</button>
      ${['Ceintures','Vocabulaire','Histoire','Règles'].map(c =>
        `<button class="quiz-filter" data-cat="${esc(c)}" style="font-family:var(--eyebrow);font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;padding:.35rem .8rem;background:none;border:1px solid var(--line);color:var(--ash);cursor:pointer;">${esc(c)}</button>`
      ).join('')}
    </div>

    <div id="quizAdminList" style="display:flex;flex-direction:column;gap:.4rem;"></div>`;

  renderAdminQuizList('all');

  document.getElementById('addQuizBtn').addEventListener('click', () => openQuizQuestionModal(null));

  /* Filtres */
  container.querySelectorAll('.quiz-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.quiz-filter').forEach(b => {
        b.style.background = 'none'; b.style.borderColor = 'var(--line)'; b.style.color = 'var(--ash)';
        b.classList.remove('is-active');
      });
      btn.style.background = 'var(--crimson)'; btn.style.borderColor = 'var(--crimson)'; btn.style.color = '#fff';
      btn.classList.add('is-active');
      renderAdminQuizList(btn.dataset.cat);
    });
  });
}

function renderAdminQuizList(filterCat = 'all') {
  const el = document.getElementById('quizAdminList');
  if (!el) return;
  const m = getSection('membres');
  const quiz = (m.quiz || []).map((q, i) => ({ ...q, _i: i }))
    .filter(q => filterCat === 'all' || q.categorie === filterCat);

  if (!quiz.length) {
    el.innerHTML = '<p class="admin-empty">Aucune question dans cette catégorie.</p>';
    return;
  }

  el.innerHTML = quiz.map(q => `
    <div class="admin-item" style="padding:.8rem 1rem;">
      <div class="admin-item__info">
        <div style="display:flex;gap:.5rem;align-items:center;margin-bottom:.25rem;">
          <span style="font-family:var(--mono);font-size:.68rem;color:var(--gold);background:rgba(201,162,39,.1);padding:.15rem .5rem;">${esc(q.categorie)}</span>
          <span style="font-family:var(--mono);font-size:.68rem;color:var(--ash-2);">${'★'.repeat(q.difficulte)}${'☆'.repeat(3-q.difficulte)}</span>
        </div>
        <div style="font-size:.88rem;color:var(--bone);margin-bottom:.3rem;">${esc(q.question)}</div>
        <div style="font-size:.75rem;color:var(--ash-2);">
          ${q.reponses.map((r,i) => `<span style="${i===q.correct?'color:var(--gold);font-weight:600;':''}">${i===q.correct?'✓ ':''}${esc(r)}</span>`).join(' · ')}
        </div>
      </div>
      <div class="admin-item__actions">
        <button class="admin-btn admin-btn--edit" data-qi="${q._i}">✏ Modifier</button>
        <button class="admin-btn admin-btn--del" data-qi="${q._i}">✕</button>
      </div>
    </div>`).join('');

  el.querySelectorAll('.admin-btn--edit').forEach(btn =>
    btn.addEventListener('click', () => openQuizQuestionModal(+btn.dataset.qi)));
  el.querySelectorAll('.admin-btn--del').forEach(btn =>
    btn.addEventListener('click', () => {
      if (!confirmDel('Supprimer cette question ?')) return;
      const m = getSection('membres');
      m.quiz.splice(+btn.dataset.qi, 1);
      saveSection('membres', m);
      showToast('Question supprimée');
      const active = document.querySelector('.quiz-filter.is-active');
      renderAdminQuizList(active?.dataset.cat || 'all');
      /* Mettre à jour le compteur */
      const countEl = document.querySelector('[style*="mono"][style*=".85rem"]');
      if (countEl) countEl.textContent = `${m.quiz.length} question${m.quiz.length>1?'s':''}`;
    }));
}

function openQuizQuestionModal(index) {
  const m = getSection('membres');
  const q = index !== null ? m.quiz[index] : { question:'', reponses:['','','',''], correct:0, categorie:'Vocabulaire', difficulte:1 };
  const modal = document.getElementById('adminModal');
  modal.innerHTML = `
    <div class="admin-modal__box" style="max-width:640px;">
      <div class="admin-modal__title">${index!==null?'Modifier':'Nouvelle'} question</div>
      <div>
        <label class="admin-modal-label">Question *</label>
        <input id="qq-q" class="admin-modal-input" value="${esc(q.question)}" placeholder="Tapez votre question...">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem;">
        ${q.reponses.map((r,i) => `
          <div style="position:relative;">
            <label class="admin-modal-label" style="display:flex;align-items:center;gap:.5rem;">
              <input type="radio" name="correct-answer" value="${i}" ${q.correct===i?'checked':''} style="accent-color:var(--gold);">
              Réponse ${i+1} ${q.correct===i?'<span style="color:var(--gold)">✓ correcte</span>':''}
            </label>
            <input id="qq-r${i}" class="admin-modal-input" value="${esc(r)}" placeholder="Réponse ${i+1}..."
              style="${q.correct===i?'border-color:rgba(201,162,39,.5);':''}">
          </div>`).join('')}
      </div>
      <p style="font-size:.78rem;color:var(--ash-2);margin-top:-.4rem;">☝ Cochez le bouton radio à côté de la bonne réponse.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem;">
        <div>
          <label class="admin-modal-label">Catégorie</label>
          <select id="qq-cat" class="admin-modal-input">
            ${['Ceintures','Vocabulaire','Histoire','Règles'].map(c => `<option${q.categorie===c?' selected':''}>${c}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="admin-modal-label">Difficulté</label>
          <select id="qq-diff" class="admin-modal-input">
            <option value="1" ${q.difficulte===1?'selected':''}>★☆☆ Facile</option>
            <option value="2" ${q.difficulte===2?'selected':''}>★★☆ Moyen</option>
            <option value="3" ${q.difficulte===3?'selected':''}>★★★ Difficile</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:.8rem;justify-content:flex-end;padding-top:.8rem;border-top:1px solid var(--line);">
        <button class="btn btn--ghost" id="qqCancel">Annuler</button>
        <button class="btn btn--primary" id="qqSave">Enregistrer</button>
      </div>
    </div>`;
  modal.classList.add('is-open');
  modal.addEventListener('click', e => { if(e.target===modal) closeModal(); });
  document.getElementById('qqCancel').addEventListener('click', closeModal);

  /* Highlight réponse sélectionnée */
  modal.querySelectorAll('input[name="correct-answer"]').forEach(radio => {
    radio.addEventListener('change', () => {
      modal.querySelectorAll('input[name="correct-answer"]').forEach((r,i) => {
        const inp = document.getElementById(`qq-r${i}`);
        if (inp) inp.style.borderColor = r.checked ? 'rgba(201,162,39,.5)' : '';
      });
    });
  });

  document.getElementById('qqSave').addEventListener('click', () => {
    const question = document.getElementById('qq-q').value.trim();
    if (!question) { showToast('La question est obligatoire', false); return; }
    const correctRadio = modal.querySelector('input[name="correct-answer"]:checked');
    const correct = correctRadio ? +correctRadio.value : 0;
    const m = getSection('membres');
    if (!m.quiz) m.quiz = [];
    const entry = {
      question,
      reponses: [0,1,2,3].map(i => document.getElementById(`qq-r${i}`).value.trim()),
      correct,
      categorie: document.getElementById('qq-cat').value,
      difficulte: +document.getElementById('qq-diff').value || 1
    };
    if (index !== null) m.quiz[index] = entry;
    else m.quiz.push(entry);
    saveSection('membres', m);
    closeModal();
    renderAdminQuizList(document.querySelector('.quiz-filter.is-active')?.dataset.cat || 'all');
    showToast(index!==null ? 'Question modifiée ✓' : 'Question ajoutée ✓');
  });
  document.getElementById('qq-q').focus();
}

/* ── Onglet Flashcards ── */
function renderMembresFlashcards(container) {
  const m = getSection('membres') || {};
  const vocab = m.vocabulaire || [];

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem;flex-wrap:wrap;gap:.8rem;">
      <span style="font-family:var(--mono);font-size:.85rem;color:var(--ash);">${vocab.length} carte${vocab.length>1?'s':''}</span>
      <button class="btn btn--primary" id="addVocabBtn" style="padding:.6rem 1.1rem;font-size:.75rem;">+ Nouvelle carte</button>
    </div>
    <p style="font-size:.82rem;color:var(--ash-2);margin-bottom:1.2rem;">
      💡 Ces cartes sont utilisées à la fois dans les <strong>Flashcards</strong> et dans le <strong>Memory</strong> (les paires du memory = mot japonais ↔ traduction).
    </p>
    <div id="vocabAdminList" style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;"></div>`;

  renderAdminVocabList();
  document.getElementById('addVocabBtn').addEventListener('click', () => openVocabModal(null));
}

function renderAdminVocabList() {
  const el = document.getElementById('vocabAdminList');
  if (!el) return;
  const m = getSection('membres');
  const vocab = m.vocabulaire || [];

  if (!vocab.length) { el.innerHTML = '<p class="admin-empty" style="grid-column:1/-1;">Aucune carte.</p>'; return; }

  el.innerHTML = vocab.map((v, i) => `
    <div style="background:var(--char);border:1px solid var(--line);padding:1rem 1.1rem;border-left:3px solid var(--gold);display:flex;flex-direction:column;gap:.4rem;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem;">
        <div>
          <div style="font-family:var(--display);font-size:1.1rem;text-transform:uppercase;color:var(--gold);">${esc(v.japonais)}</div>
          <div style="font-size:.85rem;color:var(--bone);margin-top:.2rem;">${esc(v.français)}</div>
          <div style="font-size:.75rem;color:var(--ash-2);margin-top:.3rem;line-height:1.4;">${esc((v.contexte||'').substring(0,80))}${(v.contexte||'').length>80?'…':''}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:.3rem;flex-shrink:0;">
          <button class="admin-btn admin-btn--edit" data-vi="${i}" style="font-size:.65rem;">✏</button>
          <button class="admin-btn admin-btn--del" data-vi="${i}" style="font-size:.65rem;">✕</button>
        </div>
      </div>
    </div>`).join('');

  el.querySelectorAll('.admin-btn--edit').forEach(btn =>
    btn.addEventListener('click', () => openVocabModal(+btn.dataset.vi)));
  el.querySelectorAll('.admin-btn--del').forEach(btn =>
    btn.addEventListener('click', () => {
      if (!confirmDel('Supprimer cette carte ?')) return;
      const m = getSection('membres');
      m.vocabulaire.splice(+btn.dataset.vi, 1);
      saveSection('membres', m);
      showToast('Carte supprimée');
      renderAdminVocabList();
    }));
}

function openVocabModal(index) {
  const m = getSection('membres');
  const v = index !== null ? m.vocabulaire[index] : { japonais:'', français:'', contexte:'' };
  const modal = document.getElementById('adminModal');
  modal.innerHTML = `
    <div class="admin-modal__box" style="max-width:520px;">
      <div class="admin-modal__title">${index!==null?'Modifier':'Nouvelle'} carte</div>
      <div>
        <label class="admin-modal-label">Mot japonais (ou terme technique) *</label>
        <input id="v-jp" class="admin-modal-input" value="${esc(v.japonais)}" placeholder="Ex: KUMITE" style="font-family:var(--display);font-size:1.1rem;text-transform:uppercase;">
      </div>
      <div>
        <label class="admin-modal-label">Traduction / Signification *</label>
        <input id="v-fr" class="admin-modal-input" value="${esc(v.français)}" placeholder="Ex: Combat avec partenaire">
      </div>
      <div>
        <label class="admin-modal-label">Contexte / Explication (verso de la carte)</label>
        <textarea id="v-ctx" class="admin-modal-input" rows="3" placeholder="Détail, usage, anecdote...">${esc(v.contexte||'')}</textarea>
      </div>
      <div style="display:flex;gap:.8rem;justify-content:flex-end;padding-top:.8rem;border-top:1px solid var(--line);">
        <button class="btn btn--ghost" id="vCancel">Annuler</button>
        <button class="btn btn--primary" id="vSave">Enregistrer</button>
      </div>
    </div>`;
  modal.classList.add('is-open');
  modal.addEventListener('click', e => { if(e.target===modal) closeModal(); });
  document.getElementById('vCancel').addEventListener('click', closeModal);
  document.getElementById('vSave').addEventListener('click', () => {
    const jp = document.getElementById('v-jp').value.trim().toUpperCase();
    const fr = document.getElementById('v-fr').value.trim();
    if (!jp || !fr) { showToast('Mot et traduction obligatoires', false); return; }
    const m = getSection('membres');
    if (!m.vocabulaire) m.vocabulaire = [];
    const entry = { japonais:jp, français:fr, contexte:document.getElementById('v-ctx').value.trim() };
    if (index !== null) m.vocabulaire[index] = entry;
    else m.vocabulaire.push(entry);
    saveSection('membres', m);
    closeModal();
    renderAdminVocabList();
    showToast(index!==null ? 'Carte modifiée ✓' : 'Carte ajoutée ✓');
  });
  document.getElementById('v-jp').focus();
}

/* ── Onglet Memory ── */
function renderMembresMemory(container) {
  const m = getSection('membres') || {};
  const vocab = m.vocabulaire || [];

  container.innerHTML = `
    <div class="admin-card" style="margin-bottom:1.4rem;">
      <div class="admin-card__title">🃏 Paires du Memory</div>
      <p style="color:var(--ash);font-size:.85rem;margin:.5rem 0 1rem;">
        Le Memory utilise automatiquement les cartes du vocabulaire (onglet Flashcards).<br>
        Chaque paire = <strong style="color:var(--gold);">mot japonais</strong> ↔ <strong style="color:var(--bone);">traduction française</strong>.<br>
        Le jeu sélectionne aléatoirement <strong>12 paires</strong> parmi les cartes disponibles.
      </p>
      <div style="display:flex;align-items:center;gap:1rem;padding:1rem;background:var(--char-2);border:1px solid var(--line);">
        <div style="font-family:var(--mono);font-size:1.8rem;color:var(--gold);">${vocab.length}</div>
        <div>
          <div style="font-size:.88rem;color:var(--bone);">cartes disponibles</div>
          <div style="font-size:.78rem;color:var(--ash-2);">${vocab.length >= 12 ? '✓ Suffisant pour jouer (min. 12 requis)' : '⚠ Ajoutez des cartes dans l\'onglet Flashcards (min. 12)'}</div>
        </div>
      </div>
    </div>

    <div class="admin-card">
      <div class="admin-card__title">⚙️ Paramètres du Memory</div>
      <div style="display:flex;flex-direction:column;gap:1rem;margin-top:.8rem;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div>
            <label class="admin-label">Nombre de paires</label>
            <select id="mem-pairs" class="admin-input">
              ${[8,10,12,16].map(n => `<option value="${n}" ${(m.memoryPairs||12)===n?'selected':''}>${n} paires (${n*2} cartes)</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="admin-label">Temps limite (secondes, 0 = sans limite)</label>
            <input id="mem-timer" type="number" class="admin-input" min="0" max="300" value="${m.memoryTimer||0}" placeholder="0">
          </div>
        </div>
        <button class="btn btn--primary" id="saveMemBtn" style="align-self:flex-start;">Enregistrer les paramètres</button>
      </div>
    </div>

    <div class="admin-card" style="margin-top:1.4rem;">
      <div class="admin-card__title">👀 Aperçu des paires</div>
      <p style="color:var(--ash);font-size:.82rem;margin:.5rem 0 1rem;">Les ${Math.min(vocab.length,12)} premières paires (ordre aléatoire en jeu) :</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.5rem;">
        ${vocab.slice(0, m.memoryPairs||12).map(v => `
          <div style="display:flex;gap:.5rem;padding:.5rem .8rem;background:var(--char-2);border:1px solid var(--line);align-items:center;">
            <span style="font-family:var(--eyebrow);font-size:.78rem;color:var(--gold);min-width:80px;">${esc(v.japonais)}</span>
            <span style="color:var(--ash-2);font-size:.7rem;">↔</span>
            <span style="font-size:.78rem;color:var(--ash);">${esc(v.français)}</span>
          </div>`).join('')}
      </div>
      ${vocab.length < 12 ? `<p style="color:var(--crimson-2);font-family:var(--mono);font-size:.78rem;margin-top:1rem;">⚠ Il manque ${12-vocab.length} carte(s). Ajoutez-en dans l'onglet Flashcards.</p>` : ''}
    </div>`;

  document.getElementById('saveMemBtn').addEventListener('click', () => {
    const m = getSection('membres');
    m.memoryPairs = +document.getElementById('mem-pairs').value || 12;
    m.memoryTimer = +document.getElementById('mem-timer').value || 0;
    saveSection('membres', m);
    showToast('Paramètres Memory enregistrés ✓');
  });
}

/* ── Onglet Ceintures ── */
function renderMembresCeintures(container) {
  const m = getSection('membres') || {};
  const ceintures = m.ceintures || [];

  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem;flex-wrap:wrap;gap:.8rem;">
      <span style="font-family:var(--mono);font-size:.85rem;color:var(--ash);">${ceintures.length} ceinture${ceintures.length>1?'s':''} · dans l'ordre de progression</span>
      <button class="btn btn--primary" id="addCeintureBtn" style="padding:.6rem 1.1rem;font-size:.75rem;">+ Nouvelle ceinture</button>
    </div>
    <p style="font-size:.82rem;color:var(--ash-2);margin-bottom:1.2rem;">
      💡 Les ceintures apparaissent dans le Quiz et sur les profils membres. Utilisées pour la progression virtuelle.
    </p>
    <div id="ceinturesAdminList" style="display:flex;flex-direction:column;gap:.5rem;"></div>`;

  renderAdminCeinturesList();
  document.getElementById('addCeintureBtn').addEventListener('click', () => openCeintureModal(null));
}

function renderAdminCeinturesList() {
  const el = document.getElementById('ceinturesAdminList');
  if (!el) return;
  const m = getSection('membres');
  const ceintures = m.ceintures || [];

  if (!ceintures.length) { el.innerHTML = '<p class="admin-empty">Aucune ceinture.</p>'; return; }

  el.innerHTML = ceintures.map((c, i) => `
    <div class="admin-item" style="border-left:4px solid ${esc(c.hex)};">
      <div style="width:42px;height:42px;border-radius:50%;background:${esc(c.hex)};border:2px solid var(--line);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">${esc(c.kanji||'')}</div>
      <div class="admin-item__info">
        <div class="admin-item__title">Rang ${c.rang} — ${esc(c.couleur)}</div>
        <div class="admin-item__date">${esc((c.description||'').substring(0,90))}</div>
      </div>
      <div class="admin-item__actions">
        ${i>0 ? `<button class="admin-btn admin-btn--edit" data-ci="${i}" data-dir="up" title="Monter">↑</button>` : ''}
        ${i<ceintures.length-1 ? `<button class="admin-btn admin-btn--edit" data-ci="${i}" data-dir="down" title="Descendre">↓</button>` : ''}
        <button class="admin-btn admin-btn--edit" data-ci="${i}">✏</button>
        <button class="admin-btn admin-btn--del" data-ci="${i}">✕</button>
      </div>
    </div>`).join('');

  el.querySelectorAll('.admin-btn--edit[data-dir]').forEach(btn =>
    btn.addEventListener('click', () => {
      const m = getSection('membres');
      const i = +btn.dataset.ci;
      const j = btn.dataset.dir==='up' ? i-1 : i+1;
      [m.ceintures[i], m.ceintures[j]] = [m.ceintures[j], m.ceintures[i]];
      m.ceintures.forEach((c,idx) => c.rang = idx+1);
      saveSection('membres', m);
      renderAdminCeinturesList();
    }));
  el.querySelectorAll('.admin-btn--edit:not([data-dir])').forEach(btn =>
    btn.addEventListener('click', () => openCeintureModal(+btn.dataset.ci)));
  el.querySelectorAll('.admin-btn--del').forEach(btn =>
    btn.addEventListener('click', () => {
      if (!confirmDel('Supprimer cette ceinture ?')) return;
      const m = getSection('membres');
      m.ceintures.splice(+btn.dataset.ci, 1);
      m.ceintures.forEach((c,i) => c.rang = i+1);
      saveSection('membres', m);
      showToast('Ceinture supprimée');
      renderAdminCeinturesList();
    }));
}

function openCeintureModal(index) {
  const m = getSection('membres');
  const c = index !== null ? m.ceintures[index] : { couleur:'', hex:'#ffffff', rang:(m.ceintures||[]).length+1, description:'', kanji:'' };
  const modal = document.getElementById('adminModal');
  modal.innerHTML = `
    <div class="admin-modal__box" style="max-width:480px;">
      <div class="admin-modal__title">${index!==null?'Modifier':'Nouvelle'} ceinture</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem;">
        <div>
          <label class="admin-modal-label">Couleur (nom) *</label>
          <input id="cb-couleur" class="admin-modal-input" value="${esc(c.couleur)}" placeholder="Ex: Verte">
        </div>
        <div>
          <label class="admin-modal-label">Couleur (hex)</label>
          <div style="display:flex;gap:.5rem;align-items:center;">
            <input id="cb-hex" class="admin-modal-input" value="${esc(c.hex)}" placeholder="#2d8a4e" style="flex:1;">
            <input type="color" id="cb-color-picker" value="${esc(c.hex)}" style="width:38px;height:38px;border:1px solid var(--line);background:none;cursor:pointer;padding:2px;">
          </div>
        </div>
        <div>
          <label class="admin-modal-label">Rang (ordre de passage)</label>
          <input id="cb-rang" class="admin-modal-input" type="number" min="1" value="${c.rang}">
        </div>
        <div>
          <label class="admin-modal-label">Kanji (optionnel)</label>
          <input id="cb-kanji" class="admin-modal-input" value="${esc(c.kanji||'')}" placeholder="Ex: 緑">
        </div>
      </div>
      <div>
        <label class="admin-modal-label">Description / Symbolique</label>
        <textarea id="cb-desc" class="admin-modal-input" rows="3" placeholder="Ce que représente cette ceinture...">${esc(c.description||'')}</textarea>
      </div>
      <div style="display:flex;gap:.8rem;justify-content:flex-end;padding-top:.8rem;border-top:1px solid var(--line);">
        <button class="btn btn--ghost" id="cbCancel">Annuler</button>
        <button class="btn btn--primary" id="cbSave">Enregistrer</button>
      </div>
    </div>`;
  modal.classList.add('is-open');
  modal.addEventListener('click', e => { if(e.target===modal) closeModal(); });
  document.getElementById('cbCancel').addEventListener('click', closeModal);

  /* Sync color picker ↔ input hex */
  const picker = document.getElementById('cb-color-picker');
  const hexInput = document.getElementById('cb-hex');
  picker.addEventListener('input', () => { hexInput.value = picker.value; });
  hexInput.addEventListener('input', () => { if(/^#[0-9a-f]{6}$/i.test(hexInput.value)) picker.value = hexInput.value; });

  document.getElementById('cbSave').addEventListener('click', () => {
    const couleur = document.getElementById('cb-couleur').value.trim();
    if (!couleur) { showToast('Le nom est obligatoire', false); return; }
    const m = getSection('membres');
    const entry = {
      couleur,
      hex: document.getElementById('cb-hex').value.trim() || '#ffffff',
      rang: +document.getElementById('cb-rang').value || (m.ceintures||[]).length+1,
      description: document.getElementById('cb-desc').value.trim(),
      kanji: document.getElementById('cb-kanji').value.trim()
    };
    if (index !== null) m.ceintures[index] = entry;
    else { if(!m.ceintures) m.ceintures=[]; m.ceintures.push(entry); }
    /* Re-trier par rang */
    m.ceintures.sort((a,b) => a.rang - b.rang);
    saveSection('membres', m);
    closeModal();
    renderAdminCeinturesList();
    showToast(index!==null ? 'Ceinture modifiée ✓' : 'Ceinture ajoutée ✓');
  });
  document.getElementById('cb-couleur').focus();
}

/* ============ INIT ============ */
document.addEventListener('DOMContentLoaded', () => {
  initData().then(() => {
  migrateData();
  initLogin();

  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => loadSection(item.dataset.section));
  });

  // Fermer modal
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Lien retour site
  const backLink = document.getElementById('backToSite');
  if (backLink) backLink.addEventListener('click', () => { window.location.href = 'index.html'; });
  }); // fin initData
});
