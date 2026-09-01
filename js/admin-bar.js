/* ============================================================
   SHINDOKAI-KAN — Admin Bar v3 (édition inline complète)
   ============================================================ */

/* ── Point d'entrée ── */
function initAdminBar(pageKey) {
  try { if (!sessionStorage.getItem('shindokai_admin')) return; } catch(e) { return; }
  window._abPage = pageKey;
  _abInjectStyles();
  _abInjectBar();
  setTimeout(() => {
    _abMakeAllEditable(pageKey);
    _abStructured(pageKey);
    _abAddDeleteControls(pageKey);
  }, 150);
}

/* ══════════════════════════════════════════════════════════════
   BARRE FLOTTANTE
══════════════════════════════════════════════════════════════ */
function _abInjectBar() {
  const bar = document.createElement('div');
  bar.id = 'adminBar';
  bar.innerHTML = `
    <span class="ab-badge">⚙ Admin</span>
    <span class="ab-hint" id="abHint">Survoler = éditable · Cliquer = modifier · Or = non sauvegardé</span>
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

function _abMarkDirty() {
  document.getElementById('abSave').disabled = false;
  document.getElementById('abHint').innerHTML = '<span style="color:#c9a227">● Modifications non sauvegardées</span> — cliquez Enregistrer';
}

/* ══════════════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════════════ */
function _abInjectStyles() {
  const s = document.createElement('style');
  s.textContent = `
    #adminBar {
      position: fixed; top: 0; left: 0; right: 0; height: 46px; z-index: 99999;
      background: #140808; border-bottom: 2px solid #e0241b;
      display: flex; align-items: center; gap: 1rem; padding: 0 1.2rem;
      font-family: 'JetBrains Mono', monospace; font-size: .75rem; box-shadow: 0 2px 20px rgba(0,0,0,.5);
    }
    .ab-badge { background:#e0241b;color:#fff;padding:.2rem .7rem;font-size:.65rem;letter-spacing:.08em;flex-shrink:0; }
    .ab-hint  { color:#666;font-size:.65rem;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
    .ab-actions { display:flex;gap:.4rem;margin-left:auto;flex-shrink:0; }
    .ab-btn { padding:.28rem .75rem;border:1px solid #444;background:none;color:#aaa;cursor:pointer;font-family:inherit;font-size:.68rem;transition:all .15s;white-space:nowrap; }
    .ab-save { border-color:#e0241b;color:#e0241b; }
    .ab-save:disabled { opacity:.3;cursor:not-allowed; }
    .ab-save:not(:disabled):hover { background:#e0241b;color:#fff; }
    .ab-quit:hover { border-color:#666;color:#fff; }

    /* Textes éditables */
    [data-ab]:hover  { outline:1px dashed rgba(224,36,27,.55) !important;background:rgba(224,36,27,.05) !important;cursor:text; }
    [data-ab]:focus  { outline:2px solid #e0241b !important;background:rgba(224,36,27,.09) !important; }
    [data-ab][data-dirty] { outline:2px solid #c9a227 !important;background:rgba(201,162,39,.08) !important; }
    [data-ab][data-dirty]:focus { outline:2px solid #c9a227 !important; }
    [data-ab] { border-radius:2px;transition:outline .12s,background .12s; }

    /* Bouton supprimer (×) sur cartes */
    .ab-del-btn {
      position:absolute;top:6px;right:6px;width:22px;height:22px;
      background:rgba(224,36,27,.85);color:#fff;border:none;cursor:pointer;
      font-size:.75rem;line-height:22px;text-align:center;border-radius:50%;
      opacity:0;transition:opacity .15s;z-index:10;
    }
    .ab-deletable { position:relative; }
    .ab-deletable:hover .ab-del-btn { opacity:1; }

    /* Bouton ajouter (+) */
    .ab-add-btn {
      display:flex;align-items:center;gap:.5rem;
      margin:1rem 0;padding:.6rem 1.2rem;
      border:1px dashed rgba(224,36,27,.5);background:rgba(224,36,27,.06);
      color:#e0241b;cursor:pointer;font-family:'JetBrains Mono',monospace;
      font-size:.75rem;letter-spacing:.05em;transition:all .2s;width:100%;
    }
    .ab-add-btn:hover { background:rgba(224,36,27,.12);border-color:#e0241b; }

    /* Modale d'ajout */
    #abModal {
      position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:100000;
      display:flex;align-items:center;justify-content:center;padding:1rem;
    }
    #abModal.ab-hidden { display:none; }
    .ab-modal-box {
      background:#1a1a1f;border:1px solid #e0241b;padding:2rem;
      width:100%;max-width:480px;max-height:80vh;overflow-y:auto;
      display:flex;flex-direction:column;gap:1.2rem;
    }
    .ab-modal-title { font-family:'Oswald',sans-serif;font-size:1.2rem;text-transform:uppercase;color:#e0241b;letter-spacing:.06em; }
    .ab-field { display:flex;flex-direction:column;gap:.35rem; }
    .ab-label { font-family:'JetBrains Mono',monospace;font-size:.65rem;letter-spacing:.09em;text-transform:uppercase;color:#888; }
    .ab-input {
      background:#111;border:1px solid #333;color:#f3efe7;
      padding:.65rem .85rem;font-family:inherit;font-size:.9rem;
      transition:border-color .15s;
    }
    .ab-input:focus { border-color:#e0241b;outline:none; }
    .ab-textarea { min-height:90px;resize:vertical; }
    .ab-modal-btns { display:flex;gap:.6rem;justify-content:flex-end; }
    .ab-modal-cancel { padding:.55rem 1.1rem;border:1px solid #444;background:none;color:#888;cursor:pointer;font-family:inherit;font-size:.78rem; }
    .ab-modal-cancel:hover { border-color:#888;color:#fff; }
    .ab-modal-ok { padding:.55rem 1.4rem;background:#e0241b;border:none;color:#fff;cursor:pointer;font-family:inherit;font-size:.78rem;transition:background .15s; }
    .ab-modal-ok:hover { background:#c01f17; }

    /* Image preview */
    .ab-img-preview { max-width:100%;max-height:140px;object-fit:contain;border:1px solid #333;margin-top:.4rem;display:none; }
    .ab-img-preview.visible { display:block; }
  `;
  document.head.appendChild(s);

  /* Modale HTML */
  const modal = document.createElement('div');
  modal.id = 'abModal';
  modal.className = 'ab-hidden';
  modal.innerHTML = `<div class="ab-modal-box" id="abModalBox"></div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) _abCloseModal(); });
}

/* ══════════════════════════════════════════════════════════════
   RENDRE UN ÉLÉMENT ÉDITABLE (texte libre → text_overrides)
══════════════════════════════════════════════════════════════ */
function _abMake(el, key) {
  if (!el || el.dataset.ab) return;
  el.dataset.ab  = key;
  el.contentEditable = true;
  el.spellcheck  = false;
  el.addEventListener('input', () => { el.dataset.dirty='1'; _abMarkDirty(); });
  el.addEventListener('keydown', e => { if (e.key==='Enter'&&!e.shiftKey){e.preventDefault();el.blur();} });
}

/* ── Rendre éditable via text_overrides (éléments génériques) ── */
function _abMakeText(el, pageKey) {
  if (!el || !el.textContent.trim()) return;
  if (el.querySelector('img,iframe,canvas,svg,input,button,select')) return;
  if (!el.id) {
    const tag = el.tagName.toLowerCase();
    const cls = (el.className||'').replace(/\s+/g,'_').slice(0,20);
    el.id = `_ab_${pageKey}_${tag}_${cls}_${Math.random().toString(36).slice(2,7)}`;
  }
  _abMake(el, `text_overrides|${pageKey}|${el.id}`);
}

/* ── Parcourir tout <main> et rendre le texte éditable ── */
function _abMakeAllEditable(pageKey) {
  const main = document.querySelector('main');
  if (!main) return;

  const SEL = [
    'h1','h2','h3','h4',
    '.hero-mini__title .line span',
    '.hero-mini__eyebrow',
    '.eyebrow-text',
    '.section__title',
    '.section__lede',
    '.cta-band__title',
    '.cta-band__sub',
    'p[id]',
    '[id^="ch-"],[id^="ct-"],[id^="ins-"],[id^="disc-"]',
    '.diplome-card__title',
    '.diplome-card__text',
    '.diplome-card__badge',
    '.tarif-card__name',
    '.tarif-card__price',
    '.footer-col__desc',
  ].join(',');

  main.querySelectorAll(SEL).forEach(el => _abMakeText(el, pageKey));

  // Paragraphes sans ID dans les sections
  main.querySelectorAll('section p:not([data-ab])').forEach(el => {
    if (el.closest('.actu-card,.coach-card,.bureau-card,.dojo-block')) return;
    _abMakeText(el, pageKey);
  });

  // Spans inline dans les stats/chiffres
  main.querySelectorAll('.stat-card__label, .stat-card__suffix').forEach(el => _abMakeText(el, pageKey));
}

/* ══════════════════════════════════════════════════════════════
   DONNÉES STRUCTURÉES (arrays Supabase)
══════════════════════════════════════════════════════════════ */
function _abStructured(pageKey) {
  if (pageKey === 'encadrement') _abEncadrement();
  if (pageKey === 'dojos')       _abDojos();
  if (pageKey === 'actus')       _abActus();
}

function _abField(el, key) { _abMake(el, key); }

function _abEncadrement() {
  document.querySelectorAll('.coach-grid .coach-card').forEach((card, i) => {
    _abField(card.querySelector('.coach-card__name'),  `coaches|${i}|name`);
    _abField(card.querySelector('.coach-card__grade'), `coaches|${i}|grade`);
    _abField(card.querySelector('.coach-card__role'),  `coaches|${i}|role`);
    _abField(card.querySelector('.coach-card__bio'),   `coaches|${i}|bio`);
    _abField(card.querySelector('.coach-card__dojo'),  `coaches|${i}|dojo`);
  });
  document.querySelectorAll('#gradesDojos .coach-card').forEach((card, i) => {
    _abField(card.querySelector('.coach-card__name'),  `ceintures_noires|${i}|name`);
    _abField(card.querySelector('.coach-card__grade'), `ceintures_noires|${i}|grade`);
    _abField(card.querySelector('.coach-card__role'),  `ceintures_noires|${i}|dojo`);
  });
}

function _abDojos() {
  document.querySelectorAll('.dojo-block').forEach((block, i) => {
    _abField(block.querySelector('.dojo-block__name'), `dojos|${i}|name`);
    _abField(block.querySelector('.dojo-block__sub'),  `dojos|${i}|address`);
    const roles = ['president','tresorier','secretaire'];
    block.querySelectorAll('.bureau-card').forEach((bc, ri) => {
      const r = roles[ri]; if (!r) return;
      _abField(bc.querySelector('.bureau-card__name'), `dojos|${i}|${r}`);
      bc.querySelectorAll('.bureau-contact a').forEach(a => {
        if (a.href.startsWith('tel:'))    _abField(a, `dojos|${i}|${r}Phone`);
        if (a.href.startsWith('mailto:')) _abField(a, `dojos|${i}|${r}Email`);
      });
    });
    block.querySelectorAll('.dojo-item').forEach(item => {
      const label = item.querySelector('.dojo-item__label');
      const val   = item.querySelector('.dojo-item__value');
      if (!label || !val) return;
      const t = label.textContent.trim().toLowerCase();
      if (t === 'téléphone')         _abField(val, `dojos|${i}|phone`);
      else if (t === 'accès')        _abField(val, `dojos|${i}|acces`);
      else if (t.includes('instruc'))_abField(val, `dojos|${i}|instructeur`);
    });
  });
}

function _abActus() {
  document.querySelectorAll('.actu-card').forEach((card, i) => {
    _abField(card.querySelector('.actu-card__title'), `actus|${i}|title`);
    _abField(card.querySelector('.actu-card__text'),  `actus|${i}|text`);
    _abField(card.querySelector('.actu-card__tag'),   `actus|${i}|tag`);
    _abField(card.querySelector('.actu-card__date'),  `actus|${i}|date`);
  });
}

/* ══════════════════════════════════════════════════════════════
   AJOUTER / SUPPRIMER
══════════════════════════════════════════════════════════════ */
function _abAddDeleteControls(pageKey) {
  if (pageKey === 'encadrement') {
    _abDeleteCards('.coach-grid .coach-card', 'coaches');
    _abDeleteCards('#gradesDojos .coach-card', 'ceintures_noires');
    _abAddButton(document.getElementById('coachGrid'), '+ Ajouter un coach', () => _abAddForm('coach'));
    _abAddButton(document.getElementById('gradesDojos'), '+ Ajouter une ceinture noire / marron', () => _abAddForm('cn'));
  }
  if (pageKey === 'actus') {
    _abDeleteCards('.actu-card', 'actus');
    const grid = document.querySelector('.actus-grid') || document.querySelector('#actusGrid') || document.querySelector('section .wrap');
    _abAddButton(grid, '+ Ajouter une actualité', () => _abAddForm('actu'));
  }
}

function _abDeleteCards(selector, section) {
  document.querySelectorAll(selector).forEach((card, i) => {
    card.classList.add('ab-deletable');
    const btn = document.createElement('button');
    btn.className = 'ab-del-btn';
    btn.title = 'Supprimer';
    btn.textContent = '×';
    btn.onclick = e => {
      e.stopPropagation();
      if (!confirm('Supprimer cet élément ?')) return;
      const arr = JSON.parse(JSON.stringify(getSection(section) || []));
      arr.splice(i, 1);
      saveSection(section, arr);
      setTimeout(() => location.reload(), 900);
    };
    card.appendChild(btn);
  });
}

function _abAddButton(container, label, onClick) {
  if (!container) return;
  const btn = document.createElement('button');
  btn.className = 'ab-add-btn';
  btn.textContent = label;
  btn.onclick = onClick;
  container.after ? container.after(btn) : container.parentNode && container.parentNode.appendChild(btn);
}

/* ══════════════════════════════════════════════════════════════
   MODALE D'AJOUT
══════════════════════════════════════════════════════════════ */
const _abForms = {
  coach: {
    title: 'Ajouter un coach',
    section: 'coaches',
    fields: [
      { key:'name',   label:'Nom',          type:'text',     placeholder:'Prénom Nom' },
      { key:'grade',  label:'Grade',         type:'text',     placeholder:'3e Dan Shindokai' },
      { key:'role',   label:'Rôle',          type:'text',     placeholder:'Animateur Fédéral' },
      { key:'dojo',   label:'Dojo',          type:'text',     placeholder:'Dojo de Santes' },
      { key:'bio',    label:'Bio',           type:'textarea', placeholder:'Quelques mots…' },
      { key:'photo',  label:'Photo (URL)',   type:'text',     placeholder:'img/coach-prenom.png', preview:true },
      { key:'initials',label:'Initiales',   type:'text',     placeholder:'AB' },
    ]
  },
  cn: {
    title: 'Ajouter une ceinture noire / marron',
    section: 'ceintures_noires',
    fields: [
      { key:'name',   label:'Nom',          type:'text',     placeholder:'Prénom Nom' },
      { key:'grade',  label:'Grade / Ceinture', type:'text', placeholder:'1er Dan · Ceinture Noire' },
      { key:'dojo',   label:'Dojo',          type:'text',     placeholder:'Dojo de Santes' },
      { key:'photo',  label:'Photo (URL)',   type:'text',     placeholder:'img/cn-prenom.png', preview:true },
      { key:'initials',label:'Initiales',   type:'text',     placeholder:'AB' },
    ]
  },
  actu: {
    title: 'Ajouter une actualité',
    section: 'actus',
    fields: [
      { key:'title',  label:'Titre',         type:'text',     placeholder:'Titre de l\'actualité' },
      { key:'tag',    label:'Tag',           type:'text',     placeholder:'Compétition / Stage / Grades…' },
      { key:'date',   label:'Date',          type:'text',     placeholder:'Juin 2025' },
      { key:'text',   label:'Texte',         type:'textarea', placeholder:'Description…' },
      { key:'image',  label:'Image (URL)',   type:'text',     placeholder:'img/actu.jpg', preview:true },
      { key:'lien',   label:'Lien (optionnel)', type:'text',  placeholder:'https://…' },
      { key:'type',   label:'Style card',    type:'select',   options:['actu','gold','dark'] },
    ]
  }
};

function _abAddForm(type) {
  const cfg = _abForms[type];
  if (!cfg) return;

  const fieldsHTML = cfg.fields.map(f => {
    const id = `abf_${f.key}`;
    let input;
    if (f.type === 'textarea') {
      input = `<textarea id="${id}" class="ab-input ab-textarea" placeholder="${f.placeholder||''}"></textarea>`;
    } else if (f.type === 'select') {
      input = `<select id="${id}" class="ab-input">${(f.options||[]).map(o=>`<option value="${o}">${o}</option>`).join('')}</select>`;
    } else {
      input = `<input id="${id}" class="ab-input" type="text" placeholder="${f.placeholder||''}">`;
    }
    const preview = f.preview ? `<img id="${id}_prev" class="ab-img-preview">` : '';
    return `<div class="ab-field"><label class="ab-label" for="${id}">${f.label}</label>${input}${preview}</div>`;
  }).join('');

  document.getElementById('abModalBox').innerHTML = `
    <div class="ab-modal-title">${cfg.title}</div>
    ${fieldsHTML}
    <div class="ab-modal-btns">
      <button class="ab-modal-cancel" onclick="_abCloseModal()">Annuler</button>
      <button class="ab-modal-ok" onclick="_abSubmitAdd('${type}')">Ajouter</button>
    </div>`;

  // Preview image
  cfg.fields.filter(f => f.preview).forEach(f => {
    const inp = document.getElementById(`abf_${f.key}`);
    const prev = document.getElementById(`abf_${f.key}_prev`);
    if (inp && prev) {
      inp.addEventListener('input', () => {
        prev.src = inp.value;
        prev.className = 'ab-img-preview' + (inp.value ? ' visible' : '');
      });
    }
  });

  document.getElementById('abModal').classList.remove('ab-hidden');
}

function _abCloseModal() {
  document.getElementById('abModal').classList.add('ab-hidden');
}

function _abSubmitAdd(type) {
  const cfg = _abForms[type];
  if (!cfg) return;
  const item = {};
  cfg.fields.forEach(f => {
    const el = document.getElementById(`abf_${f.key}`);
    if (el) item[f.key] = el.value.trim();
  });
  // Champ id auto pour actus
  if (type === 'actu') item.id = Date.now();

  const arr = JSON.parse(JSON.stringify(getSection(cfg.section) || []));
  arr.push(item);
  saveSection(cfg.section, arr);
  _abCloseModal();
  setTimeout(() => location.reload(), 1000);
}

/* ══════════════════════════════════════════════════════════════
   SAUVEGARDE
══════════════════════════════════════════════════════════════ */
function _abSave() {
  const btn = document.getElementById('abSave');
  btn.disabled = true;
  btn.textContent = '⏳ Sauvegarde…';

  const dirty = Array.from(document.querySelectorAll('[data-ab][data-dirty]'));
  if (!dirty.length) { location.reload(); return; }

  // ── Accumuler les mises à jour par section ──
  const sectionUpdates = {};     // section → copy of array/object
  const textOverrides  = {};     // 'pageKey|elId' → value

  dirty.forEach(el => {
    const key   = el.dataset.ab;          // "section|sub|field"
    const parts = key.split('|');
    const sec   = parts[0];
    const sub   = parts[1];
    const field = parts[2];
    const val   = el.textContent.trim();

    /* ── text_overrides (texte générique) ── */
    if (sec === 'text_overrides') {
      // sub = pageKey, field = elementId
      textOverrides[`${sub}|${field}`] = val;
      return;
    }

    /* ── club (objet plat) ── */
    if (sec === 'club') {
      if (!sectionUpdates.club) sectionUpdates.club = JSON.parse(JSON.stringify(getData().club || {}));
      if (sub === 'heroTitle') {
        if (!Array.isArray(sectionUpdates.club.heroTitle)) sectionUpdates.club.heroTitle = ['',''];
        sectionUpdates.club.heroTitle[parseInt(field,10)] = val;
      } else {
        sectionUpdates.club[sub] = val;
      }
      return;
    }

    /* ── Tableaux (coaches, actus, dojos, ceintures_noires…) ── */
    const idx = parseInt(sub, 10);
    if (isNaN(idx) || !field) return;
    if (!sectionUpdates[sec]) {
      sectionUpdates[sec] = JSON.parse(JSON.stringify(getSection(sec) || []));
    }
    while (sectionUpdates[sec].length <= idx) sectionUpdates[sec].push({});
    sectionUpdates[sec][idx][field] = val;
  });

  /* ── Sauvegarder les sections structurées ── */
  Object.entries(sectionUpdates).forEach(([sec, data]) => saveSection(sec, data));

  /* ── Sauvegarder les overrides texte ── */
  if (Object.keys(textOverrides).length) {
    const existing = getSection('text_overrides') || {};
    const merged   = Object.assign({}, existing, textOverrides);
    saveSection('text_overrides', merged);
  }

  setTimeout(() => {
    btn.textContent = '✓ Sauvegardé !';
    setTimeout(() => location.reload(), 600);
  }, 1400);
}

/* applyTextOverrides est défini dans render.js (chargé avant) */
