/* ============================================================
   SHINDOKAI-KAN — Admin Bar (édition inline directe)
   ============================================================ */

function initAdminBar(pageKey) {
  try { if (!sessionStorage.getItem('shindokai_admin')) return; } catch(e) { return; }
  _abInjectBar();
  _abInjectStyles();
  setTimeout(() => _abActivate(pageKey), 100);
}

/* ── Barre flottante ── */
function _abInjectBar() {
  const bar = document.createElement('div');
  bar.id = 'adminBar';
  bar.innerHTML = `
    <span class="ab-badge">⚙ Admin</span>
    <span class="ab-hint" id="abHint">Cliquez sur un texte pour le modifier directement</span>
    <div class="ab-actions">
      <button class="ab-btn ab-save" id="abSave" disabled>💾 Enregistrer</button>
      <button class="ab-btn ab-quit" id="abQuit">✕ Quitter</button>
    </div>`;
  document.body.prepend(bar);
  document.body.style.paddingTop = '46px';
  document.getElementById('abSave').onclick = _abSave;
  document.getElementById('abQuit').onclick = () => {
    sessionStorage.removeItem('shindokai_admin');
    location.reload();
  };
}

/* ── CSS ── */
function _abInjectStyles() {
  const s = document.createElement('style');
  s.textContent = `
    #adminBar {
      position: fixed; top: 0; left: 0; right: 0; height: 46px; z-index: 9999;
      background: #1a0d0d; border-bottom: 2px solid #e0241b;
      display: flex; align-items: center; gap: 1rem; padding: 0 1.2rem;
      font-family: 'JetBrains Mono', monospace; font-size: .75rem;
    }
    .ab-badge {
      background: #e0241b; color: #fff; padding: .25rem .7rem;
      font-size: .68rem; letter-spacing: .08em; flex-shrink: 0;
    }
    .ab-hint { color: #888; font-size: .68rem; flex: 1; }
    .ab-actions { display: flex; gap: .5rem; margin-left: auto; }
    .ab-btn {
      padding: .3rem .8rem; border: 1px solid #444; background: none;
      color: #ccc; cursor: pointer; font-family: inherit; font-size: .7rem;
      transition: all .2s;
    }
    .ab-save { border-color: #e0241b; color: #e0241b; }
    .ab-save:disabled { opacity: .35; cursor: not-allowed; }
    .ab-save:not(:disabled):hover { background: #e0241b; color: #fff; }
    .ab-quit:hover { border-color: #888; color: #fff; }

    [data-editable] {
      cursor: text; border-radius: 2px;
      transition: outline .15s, background .15s;
    }
    [data-editable]:hover {
      outline: 1px dashed rgba(224,36,27,.6);
      background: rgba(224,36,27,.06);
    }
    [data-editable]:focus {
      outline: 2px solid #e0241b !important;
      background: rgba(224,36,27,.1);
    }
    [data-editable][data-dirty] {
      outline: 2px solid #c9a227;
      background: rgba(201,162,39,.07);
    }
    [data-editable][data-dirty]:focus {
      outline: 2px solid #c9a227 !important;
    }
  `;
  document.head.appendChild(s);
}

/* ── Rendre un élément éditable ── */
function _abMake(el, editKey) {
  if (!el) return;
  el.dataset.editable = editKey;
  el.contentEditable = true;
  el.spellcheck = false;
  el.addEventListener('input', () => {
    el.dataset.dirty = '1';
    document.getElementById('abSave').disabled = false;
    document.getElementById('abHint').textContent = '● Modifications non sauvegardées — cliquez Enregistrer';
  });
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); el.blur(); }
  });
}

/* ── Activation par page ── */
function _abActivate(pageKey) {
  ({
    encadrement: _abEncadrement,
    dojos:       _abDojos,
    actus:       _abActus,
    index:       _abIndex,
    contact:     _abContact,
    inscription: _abInscription,
    discipline:  _abDiscipline,
  }[pageKey] || function(){})();
}

/* ── ENCADREMENT ── */
function _abEncadrement() {
  document.querySelectorAll('.coach-grid .coach-card').forEach((card, i) => {
    _abMake(card.querySelector('.coach-card__name'),  `coaches|${i}|name`);
    _abMake(card.querySelector('.coach-card__grade'), `coaches|${i}|grade`);
    _abMake(card.querySelector('.coach-card__role'),  `coaches|${i}|role`);
    _abMake(card.querySelector('.coach-card__bio'),   `coaches|${i}|bio`);
    _abMake(card.querySelector('.coach-card__dojo'),  `coaches|${i}|dojo`);
  });
  document.querySelectorAll('#gradesDojos .coach-card').forEach((card, i) => {
    _abMake(card.querySelector('.coach-card__name'),  `ceintures_noires|${i}|name`);
    _abMake(card.querySelector('.coach-card__grade'), `ceintures_noires|${i}|grade`);
    _abMake(card.querySelector('.coach-card__role'),  `ceintures_noires|${i}|dojo`);
  });
}

/* ── DOJOS ── */
function _abDojos() {
  document.querySelectorAll('.dojo-block').forEach((block, i) => {
    _abMake(block.querySelector('.dojo-block__name'), `dojos|${i}|name`);
    _abMake(block.querySelector('.dojo-block__sub'),  `dojos|${i}|address`);

    const roles = ['president', 'tresorier', 'secretaire'];
    block.querySelectorAll('.bureau-card').forEach((bc, ri) => {
      const role = roles[ri]; if (!role) return;
      _abMake(bc.querySelector('.bureau-card__name'), `dojos|${i}|${role}`);
      bc.querySelectorAll('.bureau-contact a').forEach(a => {
        if (a.href.startsWith('tel:'))    _abMake(a, `dojos|${i}|${role}Phone`);
        if (a.href.startsWith('mailto:')) _abMake(a, `dojos|${i}|${role}Email`);
      });
    });

    block.querySelectorAll('.dojo-item').forEach(item => {
      const label = item.querySelector('.dojo-item__label');
      const val   = item.querySelector('.dojo-item__value');
      if (!label || !val) return;
      const t = label.textContent.trim().toLowerCase();
      if (t === 'téléphone')          _abMake(val, `dojos|${i}|phone`);
      else if (t === 'accès')         _abMake(val, `dojos|${i}|acces`);
      else if (t.includes('instruc')) _abMake(val, `dojos|${i}|instructeur`);
    });
  });
}

/* ── ACTUS ── */
function _abActus() {
  document.querySelectorAll('.actu-card').forEach((card, i) => {
    _abMake(card.querySelector('.actu-card__title'), `actus|${i}|title`);
    _abMake(card.querySelector('.actu-card__text'),  `actus|${i}|text`);
    _abMake(card.querySelector('.actu-card__tag'),   `actus|${i}|tag`);
    _abMake(card.querySelector('.actu-card__date'),  `actus|${i}|date`);
  });
}

/* ── INDEX ── */
function _abIndex() {
  ['ch-hero-l1','ch-hero-l2'].forEach((id, idx) => {
    const el = document.getElementById(id);
    const span = el && el.querySelector('span');
    if (span) _abMake(span, `club|heroTitle|${idx}`);
  });
  [
    ['ch-hero-eyebrow','heroEyebrow'], ['ch-s1-eyebrow','s1Eyebrow'],
    ['ch-s1-titre','s1Titre'],         ['ch-s1-lede','s1Lede'],
    ['ch-cta-titre','ctaTitre'],       ['ch-cta-sub','ctaSub'],
    ['aboutP1','aboutP1'],             ['aboutP2','aboutP2'],
    ['aboutP3','aboutP3'],
  ].forEach(([id, field]) => _abMake(document.getElementById(id), `club|${field}|`));
}

/* ── CONTACT / INSCRIPTION / DISCIPLINE ── */
function _abContact()    { document.querySelectorAll('[id^="ct-"]').forEach(el => _abMake(el, `contact|${el.id}|`)); }
function _abInscription(){ document.querySelectorAll('[id^="ins-"]').forEach(el => _abMake(el, `inscription|${el.id}|`)); }
function _abDiscipline() { document.querySelectorAll('[id^="disc-"]').forEach(el => _abMake(el, `discipline|${el.id}|`)); }

/* ── SAUVEGARDE ── */
function _abSave() {
  const btn = document.getElementById('abSave');
  btn.disabled = true;
  btn.textContent = '⏳ Sauvegarde…';

  const dirty = document.querySelectorAll('[data-editable][data-dirty]');
  if (!dirty.length) { location.reload(); return; }

  // Grouper les modifications par section
  const updates = {};
  dirty.forEach(el => {
    const parts = el.dataset.editable.split('|');
    const section = parts[0];
    const key2    = parts[1]; // index ou nom champ
    const field   = parts[2]; // nom champ ou vide
    const value   = el.textContent.trim();

    if (!updates[section]) {
      const cur = getSection(section);
      updates[section] = cur ? JSON.parse(JSON.stringify(cur)) : {};
    }

    if (section === 'club') {
      // key2 = 'heroTitle' → tableau, field = '0' ou '1'
      if (key2 === 'heroTitle') {
        if (!Array.isArray(updates[section].heroTitle)) updates[section].heroTitle = ['',''];
        updates[section].heroTitle[parseInt(field,10)] = value;
      } else {
        updates[section][key2] = value;
      }
    } else {
      // tableau : key2 = index numérique, field = nom du champ
      const idx = parseInt(key2, 10);
      if (isNaN(idx) || !field) return;
      if (!Array.isArray(updates[section])) updates[section] = [];
      while (updates[section].length <= idx) updates[section].push({});
      updates[section][idx][field] = value;
    }
  });

  Object.entries(updates).forEach(([section, data]) => saveSection(section, data));

  setTimeout(() => {
    btn.textContent = '✓ Sauvegardé !';
    setTimeout(() => location.reload(), 600);
  }, 1400);
}
