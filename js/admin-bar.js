/* ============================================================
   SHINDOKAI-KAN — Admin Bar v4
   Barre d'outils complète · édition inline · images · blocs
   ============================================================ */

const _AB_SB_URL = 'https://jcfltkuobbjqicczpsjn.supabase.co';
const _AB_SB_KEY = 'sb_publishable_15BDd64WYwMfW8VV9ZXDqg_Oa2ySvKc';
const _AB_BUCKET = 'site-images';

/* ══════════════════════════════════════════════════════════════
   POINT D'ENTRÉE
══════════════════════════════════════════════════════════════ */
function initAdminBar(pageKey) {
  try { if (!sessionStorage.getItem('shindokai_admin')) return; } catch(e) { return; }
  window._abPage = pageKey;
  window._abUndoStack = [];
  _abInjectCSS();
  _abInjectDOM();
  setTimeout(() => {
    _abMakeAllEditable(pageKey);
    _abStructured(pageKey);
    _abAddDeleteControls(pageKey);
    _abInjectSectionInserts(pageKey);
    _abActivateImages(pageKey);
  }, 150);
}

/* ══════════════════════════════════════════════════════════════
   BARRE D'OUTILS
══════════════════════════════════════════════════════════════ */
function _abInjectDOM() {
  /* ── Barre principale ── */
  const bar = document.createElement('div');
  bar.id = 'adminBar';
  const pageLabel = (window._abPage || '').charAt(0).toUpperCase() + (window._abPage||'').slice(1);
  bar.innerHTML = `
    <div class="ab-left">
      <span class="ab-logo">⚙</span>
      <span class="ab-page-label">${pageLabel}</span>
    </div>
    <div class="ab-center" id="abHint">Survole un élément pour l'éditer · Clic image pour la changer</div>
    <div class="ab-right">
      <button class="ab-tool" id="abSave" disabled title="Enregistrer les modifications">
        <span class="ab-tool-icon">💾</span><span class="ab-tool-label">Enregistrer</span>
      </button>
      <button class="ab-tool" id="abUndo" disabled title="Annuler la dernière action">
        <span class="ab-tool-icon">↩</span><span class="ab-tool-label">Annuler</span>
      </button>
      <div class="ab-sep"></div>
      <button class="ab-tool" id="abBtnBloc" title="Insérer un bloc de texte">
        <span class="ab-tool-icon">＋</span><span class="ab-tool-label">Bloc</span>
      </button>
      <button class="ab-tool" id="abBtnImage" title="Gérer les images de la page">
        <span class="ab-tool-icon">🖼</span><span class="ab-tool-label">Images</span>
      </button>
      <div class="ab-sep"></div>
      <button class="ab-tool" id="abBtnSettings" title="Réglages du site">
        <span class="ab-tool-icon">⚙</span><span class="ab-tool-label">Réglages</span>
      </button>
      <div class="ab-sep"></div>
      <button class="ab-tool ab-quit-btn" id="abQuit" title="Quitter le mode admin">
        <span class="ab-tool-icon">✕</span><span class="ab-tool-label">Quitter</span>
      </button>
    </div>`;
  document.body.prepend(bar);
  document.body.style.paddingTop = '52px';

  /* ── Panneau latéral (réglages / images) ── */
  const panel = document.createElement('div');
  panel.id = 'abPanel';
  panel.className = 'ab-panel ab-panel-closed';
  panel.innerHTML = `
    <div class="ab-panel-header">
      <span class="ab-panel-title" id="abPanelTitle">Réglages</span>
      <button class="ab-panel-close" onclick="_abClosePanel()">✕</button>
    </div>
    <div class="ab-panel-body" id="abPanelBody"></div>`;
  document.body.appendChild(panel);

  /* ── Modale ── */
  const modal = document.createElement('div');
  modal.id = 'abModal';
  modal.className = 'ab-hidden';
  modal.innerHTML = `<div class="ab-modal-box" id="abModalBox"></div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) _abCloseModal(); });

  /* ── Overlay image ── */
  const imgOverlay = document.createElement('div');
  imgOverlay.id = 'abImgOverlay';
  imgOverlay.className = 'ab-hidden';
  document.body.appendChild(imgOverlay);

  /* ── Wiring boutons ── */
  document.getElementById('abSave').onclick   = _abSave;
  document.getElementById('abUndo').onclick   = _abUndo;
  document.getElementById('abQuit').onclick   = () => { sessionStorage.removeItem('shindokai_admin'); location.reload(); };
  document.getElementById('abBtnSettings').onclick = _abOpenSettings;
  document.getElementById('abBtnImage').onclick    = _abOpenImageList;
  document.getElementById('abBtnBloc').onclick     = () => _abOpenBlockForm(window._abPage, -99);
}

function _abSetHint(msg, type) {
  const el = document.getElementById('abHint');
  if (!el) return;
  el.innerHTML = msg;
  el.className = 'ab-center' + (type ? ` ab-hint-${type}` : '');
}
function _abMarkDirty() {
  document.getElementById('abSave').disabled = false;
  _abSetHint('<span style="color:#c9a227">● Modifications non sauvegardées</span> — cliquez Enregistrer', 'warn');
}

/* ══════════════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════════════ */
function _abInjectCSS() {
  const s = document.createElement('style');
  s.textContent = `
  /* ── Barre ── */
  #adminBar {
    position:fixed;top:0;left:0;right:0;height:52px;z-index:99999;
    background:#0f0607;border-bottom:2px solid #e0241b;
    display:flex;align-items:center;gap:.5rem;padding:0 1rem;
    font-family:'JetBrains Mono',monospace;font-size:.72rem;
    box-shadow:0 3px 24px rgba(0,0,0,.6);
  }
  .ab-left  { display:flex;align-items:center;gap:.6rem;flex-shrink:0; }
  .ab-center{ flex:1;text-align:center;color:#666;font-size:.65rem;min-width:0;overflow:hidden;white-space:nowrap; }
  .ab-right { display:flex;align-items:center;gap:.2rem;flex-shrink:0; }
  .ab-logo  { background:#e0241b;color:#fff;padding:.2rem .55rem;font-weight:700;letter-spacing:.06em;font-size:.7rem; }
  .ab-page-label { color:#888;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase; }
  .ab-sep   { width:1px;height:20px;background:#2a2a2a;margin:0 .3rem; }

  .ab-tool  {
    display:flex;flex-direction:column;align-items:center;gap:.12rem;
    padding:.3rem .5rem;min-width:44px;border:none;background:none;
    color:#999;cursor:pointer;border-radius:3px;transition:all .15s;
  }
  .ab-tool:hover { background:rgba(224,36,27,.12);color:#e0241b; }
  .ab-tool:disabled { opacity:.3;cursor:not-allowed;pointer-events:none; }
  .ab-tool-icon  { font-size:.9rem;line-height:1; }
  .ab-tool-label { font-size:.52rem;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap; }
  #abSave   { color:#e0241b; }
  #abSave:not(:disabled):hover { background:rgba(224,36,27,.2); }
  .ab-quit-btn:hover { background:rgba(255,255,255,.07) !important;color:#fff !important; }

  /* ── Panneau latéral ── */
  #abPanel {
    position:fixed;top:52px;right:0;bottom:0;width:380px;z-index:99998;
    background:#111114;border-left:1px solid #222;
    display:flex;flex-direction:column;transform:translateX(100%);
    transition:transform .28s cubic-bezier(.4,0,.2,1);
    box-shadow:-8px 0 40px rgba(0,0,0,.5);
  }
  #abPanel.ab-panel-open { transform:translateX(0); }
  .ab-panel-header {
    display:flex;align-items:center;justify-content:space-between;
    padding:.9rem 1.2rem;border-bottom:1px solid #222;flex-shrink:0;
  }
  .ab-panel-title { font-family:'Oswald',sans-serif;font-size:1rem;text-transform:uppercase;color:#e0241b;letter-spacing:.08em; }
  .ab-panel-close { background:none;border:none;color:#666;cursor:pointer;font-size:1rem;padding:.2rem; }
  .ab-panel-close:hover { color:#fff; }
  .ab-panel-body { flex:1;overflow-y:auto;padding:1.2rem; }

  /* ── Éléments de formulaire dans panneau ── */
  .ab-group { margin-bottom:1.4rem; }
  .ab-group-title { font-family:'Oswald',sans-serif;font-size:.78rem;text-transform:uppercase;letter-spacing:.1em;color:#e0241b;margin-bottom:.8rem;padding-bottom:.4rem;border-bottom:1px solid #1e1e1e; }
  .ab-row   { display:flex;flex-direction:column;gap:.3rem;margin-bottom:.8rem; }
  .ab-lbl   { font-family:'JetBrains Mono',monospace;font-size:.6rem;letter-spacing:.09em;text-transform:uppercase;color:#666; }
  .ab-inp   { background:#0a0a0d;border:1px solid #2a2a2a;color:#f3efe7;padding:.55rem .75rem;font-family:inherit;font-size:.82rem;transition:border-color .15s;width:100%;box-sizing:border-box; }
  .ab-inp:focus { border-color:#e0241b;outline:none; }
  .ab-ta    { min-height:80px;resize:vertical; }
  .ab-sel   { background:#0a0a0d;border:1px solid #2a2a2a;color:#f3efe7;padding:.5rem .75rem;font-family:inherit;font-size:.82rem;width:100%;box-sizing:border-box; }
  .ab-panel-save {
    margin:1rem 0 0;padding:.7rem;width:100%;
    background:#e0241b;border:none;color:#fff;cursor:pointer;
    font-family:'JetBrains Mono',monospace;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;
    transition:background .15s;
  }
  .ab-panel-save:hover { background:#c01f17; }

  /* ── Modale ── */
  #abModal { position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:100000;display:flex;align-items:center;justify-content:center;padding:1rem; }
  #abModal.ab-hidden { display:none; }
  .ab-modal-box { background:#14141a;border:1px solid rgba(224,36,27,.6);padding:1.8rem;width:100%;max-width:500px;max-height:82vh;overflow-y:auto;display:flex;flex-direction:column;gap:1rem;box-shadow:0 20px 80px rgba(0,0,0,.7); }
  .ab-modal-title { font-family:'Oswald',sans-serif;font-size:1.1rem;text-transform:uppercase;color:#e0241b;letter-spacing:.08em;border-bottom:1px solid #222;padding-bottom:.7rem; }
  .ab-field { display:flex;flex-direction:column;gap:.32rem; }
  .ab-label { font-family:'JetBrains Mono',monospace;font-size:.6rem;letter-spacing:.09em;text-transform:uppercase;color:#666; }
  .ab-input { background:#0a0a0d;border:1px solid #2a2a2a;color:#f3efe7;padding:.6rem .8rem;font-family:inherit;font-size:.88rem;transition:border-color .15s;width:100%;box-sizing:border-box; }
  .ab-input:focus { border-color:#e0241b;outline:none; }
  .ab-textarea { min-height:90px;resize:vertical; }
  .ab-select-input { background:#0a0a0d;border:1px solid #2a2a2a;color:#f3efe7;padding:.55rem .8rem;font-family:inherit;font-size:.88rem;width:100%;box-sizing:border-box; }
  .ab-modal-btns { display:flex;gap:.6rem;justify-content:flex-end;margin-top:.4rem; }
  .ab-modal-cancel { padding:.5rem 1rem;border:1px solid #333;background:none;color:#888;cursor:pointer;font-family:inherit;font-size:.75rem;transition:all .15s; }
  .ab-modal-cancel:hover { border-color:#666;color:#fff; }
  .ab-modal-ok { padding:.5rem 1.3rem;background:#e0241b;border:none;color:#fff;cursor:pointer;font-family:inherit;font-size:.75rem;transition:background .15s; }
  .ab-modal-ok:hover { background:#c01f17; }
  .ab-img-preview { max-width:100%;max-height:130px;object-fit:contain;border:1px solid #222;margin-top:.4rem;display:none; }
  .ab-img-preview.visible { display:block; }

  /* ── Overlay image ── */
  #abImgOverlay { position:fixed;z-index:100001;background:#0f0607;border:1px solid #e0241b;padding:1.2rem;width:320px;box-shadow:0 12px 48px rgba(0,0,0,.8); }
  #abImgOverlay.ab-hidden { display:none; }
  .ab-io-title { font-family:'Oswald',sans-serif;font-size:.9rem;text-transform:uppercase;color:#e0241b;letter-spacing:.06em;margin-bottom:.9rem; }
  .ab-io-tabs  { display:flex;gap:0;margin-bottom:.9rem; }
  .ab-io-tab   { flex:1;padding:.4rem;border:1px solid #333;background:none;color:#888;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:.68rem;text-align:center;transition:all .15s; }
  .ab-io-tab.active,.ab-io-tab:hover { background:rgba(224,36,27,.15);border-color:#e0241b;color:#e0241b; }
  .ab-io-pane  { display:none; }
  .ab-io-pane.active { display:block; }
  .ab-io-preview { max-width:100%;max-height:100px;object-fit:contain;margin:.6rem 0;border:1px solid #222; }
  .ab-io-close { position:absolute;top:.4rem;right:.5rem;background:none;border:none;color:#666;cursor:pointer;font-size:1rem; }
  .ab-io-close:hover { color:#fff; }
  .ab-io-drop  { border:1px dashed rgba(224,36,27,.4);padding:1rem;text-align:center;color:#666;font-size:.7rem;cursor:pointer;margin-bottom:.6rem;transition:all .2s; }
  .ab-io-drop:hover,.ab-io-drop.drag-over { border-color:#e0241b;background:rgba(224,36,27,.06);color:#e0241b; }
  .ab-io-btn   { width:100%;padding:.55rem;background:#e0241b;border:none;color:#fff;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:.72rem;transition:background .15s;margin-top:.5rem; }
  .ab-io-btn:hover { background:#c01f17; }
  .ab-io-status { font-size:.65rem;color:#c9a227;margin-top:.4rem;min-height:1rem; }

  /* ── Éléments éditables ── */
  [data-ab]:hover  { outline:1px dashed rgba(224,36,27,.6)!important;background:rgba(224,36,27,.06)!important;cursor:text; }
  [data-ab]:focus  { outline:2px solid #e0241b!important;background:rgba(224,36,27,.1)!important; }
  [data-ab][data-dirty] { outline:2px solid #c9a227!important;background:rgba(201,162,39,.08)!important; }
  [data-ab][data-dirty]:focus { outline:2px solid #c9a227!important; }
  [data-ab] { border-radius:2px;transition:outline .12s,background .12s; }

  /* ── Champs vides : placeholder visible pour pouvoir cliquer ── */
  [data-ab]:empty {
    display:block;
    min-height:1.4em;
    min-width:80px;
    position:relative;
  }
  [data-ab]:empty::before {
    content: attr(data-placeholder);
    color:rgba(224,36,27,.35);
    font-style:italic;
    font-size:.8em;
    pointer-events:none;
  }
  [data-ab]:empty:hover::before { color:rgba(224,36,27,.6); }
  [data-ab]:focus:empty::before { display:none; }

  /* ── Boutons image ── */
  .ab-img-wrap { position:relative;display:inline-block; }
  .ab-img-edit-btn {
    position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
    background:rgba(0,0,0,.55);opacity:0;transition:opacity .2s;cursor:pointer;
    font-family:'JetBrains Mono',monospace;font-size:.65rem;color:#fff;letter-spacing:.06em;
    border:2px solid transparent;
  }
  .ab-img-wrap:hover .ab-img-edit-btn { opacity:1;border-color:rgba(224,36,27,.6); }
  .ab-img-edit-btn span { background:rgba(224,36,27,.85);padding:.3rem .65rem; }

  /* ── Suppression et ajout ── */
  .ab-del-btn { position:absolute;top:6px;right:6px;width:22px;height:22px;background:rgba(224,36,27,.9);color:#fff;border:none;cursor:pointer;font-size:.75rem;line-height:22px;text-align:center;border-radius:50%;opacity:0;transition:opacity .15s;z-index:10; }
  .ab-deletable { position:relative; }
  .ab-deletable:hover .ab-del-btn { opacity:1; }
  .ab-add-btn { display:flex;align-items:center;gap:.5rem;margin:1rem 0;padding:.55rem 1.1rem;border:1px dashed rgba(224,36,27,.45);background:rgba(224,36,27,.05);color:#e0241b;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:.72rem;letter-spacing:.05em;transition:all .2s;width:100%; }
  .ab-add-btn:hover { background:rgba(224,36,27,.12);border-color:#e0241b; }

  /* ── Zones d'insertion de blocs ── */
  .ab-insert-zone { display:flex;align-items:center;gap:.6rem;padding:.2rem 0;opacity:0;transition:opacity .2s;pointer-events:none; }
  .ab-insert-zone:hover,main:hover .ab-insert-zone { opacity:1;pointer-events:auto; }
  .ab-insert-line { flex:1;height:1px;background:rgba(224,36,27,.25); }
  .ab-insert-btn  { display:flex;align-items:center;gap:.35rem;padding:.25rem .7rem;border:1px dashed rgba(224,36,27,.55);background:rgba(10,10,12,.95);color:rgba(224,36,27,.85);cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:.63rem;letter-spacing:.06em;white-space:nowrap;transition:all .2s;border-radius:2px; }
  .ab-insert-btn:hover { background:rgba(224,36,27,.15);border-color:#e0241b;color:#e0241b; }

  /* ── Blocs custom ── */
  .custom-block { margin:0; }
  .custom-block--callout { border-left:3px solid var(--crimson-2);padding:1.4rem 1.8rem;background:var(--char);margin:2rem 0; }
  .custom-block--callout .cb-content { color:var(--ash);font-size:.95rem;line-height:1.7; }
  .custom-block__del { float:right;margin-left:1rem;padding:.22rem .55rem;border:1px solid rgba(224,36,27,.4);background:none;color:#e0241b;cursor:pointer;font-size:.62rem;font-family:'JetBrains Mono',monospace;transition:all .15s; }
  .custom-block__del:hover { background:#e0241b;color:#fff; }

  /* ── Liste d'images ── */
  .ab-img-list { display:flex;flex-wrap:wrap;gap:.5rem; }
  .ab-img-thumb { position:relative;cursor:pointer; }
  .ab-img-thumb img { width:80px;height:60px;object-fit:cover;border:1px solid #222;transition:border-color .15s; }
  .ab-img-thumb:hover img { border-color:#e0241b; }
  .ab-img-thumb-lbl { font-size:.55rem;color:#666;text-align:center;margin-top:.2rem;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
  `;
  document.head.appendChild(s);
}

/* ══════════════════════════════════════════════════════════════
   PANNEAU RÉGLAGES DU CLUB
══════════════════════════════════════════════════════════════ */
function _abOpenSettings() {
  const club = getData().club || {};
  document.getElementById('abPanelTitle').textContent = 'Réglages du site';
  document.getElementById('abPanelBody').innerHTML = `
    <div class="ab-group">
      <div class="ab-group-title">Identité du club</div>
      <div class="ab-row"><label class="ab-lbl">Nom complet</label><input class="ab-inp" id="cfg-name" value="${_abEsc(club.name||'')}"></div>
      <div class="ab-row"><label class="ab-lbl">Nom court (nav)</label><input class="ab-inp" id="cfg-shortName" value="${_abEsc(club.shortName||'')}"></div>
      <div class="ab-row"><label class="ab-lbl">Année de fondation</label><input class="ab-inp" id="cfg-founded" value="${_abEsc(String(club.founded||''))}"></div>
    </div>
    <div class="ab-group">
      <div class="ab-group-title">Contact</div>
      <div class="ab-row"><label class="ab-lbl">Email</label><input class="ab-inp" id="cfg-email" value="${_abEsc(club.email||'')}"></div>
      <div class="ab-row"><label class="ab-lbl">Téléphone</label><input class="ab-inp" id="cfg-phone" value="${_abEsc(club.phone||'')}"></div>
    </div>
    <div class="ab-group">
      <div class="ab-group-title">Réseaux sociaux</div>
      <div class="ab-row"><label class="ab-lbl">Facebook (URL)</label><input class="ab-inp" id="cfg-facebook" value="${_abEsc(club.facebook||'')}"></div>
      <div class="ab-row"><label class="ab-lbl">Instagram (URL)</label><input class="ab-inp" id="cfg-instagram" value="${_abEsc(club.instagram||'')}"></div>
    </div>
    <div class="ab-group">
      <div class="ab-group-title">Page d'accueil</div>
      <div class="ab-row"><label class="ab-lbl">Titre hero (ligne 1)</label><input class="ab-inp" id="cfg-h0" value="${_abEsc((club.heroTitle&&club.heroTitle[0])||'')}"></div>
      <div class="ab-row"><label class="ab-lbl">Titre hero (ligne 2)</label><input class="ab-inp" id="cfg-h1" value="${_abEsc((club.heroTitle&&club.heroTitle[1])||'')}"></div>
      <div class="ab-row"><label class="ab-lbl">Sous-titre hero</label><textarea class="ab-inp ab-ta" id="cfg-heroSub">${_abEsc(club.heroSub||'')}</textarea></div>
    </div>
    <div class="ab-group">
      <div class="ab-group-title">Sécurité</div>
      <div class="ab-row"><label class="ab-lbl">Mot de passe admin</label><input class="ab-inp" id="cfg-pwd" type="password" placeholder="Nouveau mot de passe…"></div>
    </div>
    <button class="ab-panel-save" onclick="_abSaveSettings()">💾 Enregistrer les réglages</button>`;
  _abOpenPanel();
}

function _abSaveSettings() {
  const club = JSON.parse(JSON.stringify(getData().club || {}));
  club.name      = document.getElementById('cfg-name').value.trim();
  club.shortName = document.getElementById('cfg-shortName').value.trim();
  club.founded   = parseInt(document.getElementById('cfg-founded').value) || club.founded;
  club.email     = document.getElementById('cfg-email').value.trim();
  club.phone     = document.getElementById('cfg-phone').value.trim();
  club.facebook  = document.getElementById('cfg-facebook').value.trim();
  club.instagram = document.getElementById('cfg-instagram').value.trim();
  club.heroTitle = [
    document.getElementById('cfg-h0').value.trim(),
    document.getElementById('cfg-h1').value.trim()
  ];
  club.heroSub   = document.getElementById('cfg-heroSub').value.trim();
  const pwd      = document.getElementById('cfg-pwd').value.trim();
  if (pwd) saveSection('adminPassword', pwd);
  saveSection('club', club);
  const btn = document.querySelector('.ab-panel-save');
  btn.textContent = '✓ Sauvegardé !';
  setTimeout(() => location.reload(), 1000);
}

function _abOpenPanel()  { document.getElementById('abPanel').classList.replace('ab-panel-closed','ab-panel-open')||document.getElementById('abPanel').classList.add('ab-panel-open'); }
function _abClosePanel() { const p=document.getElementById('abPanel');p.classList.remove('ab-panel-open');p.classList.add('ab-panel-closed'); }

/* ══════════════════════════════════════════════════════════════
   PANNEAU LISTE DES IMAGES DE LA PAGE
══════════════════════════════════════════════════════════════ */
function _abOpenImageList() {
  const imgs = Array.from(document.querySelectorAll('main img[data-ab-img]'));
  document.getElementById('abPanelTitle').textContent = 'Images de la page';
  if (!imgs.length) {
    document.getElementById('abPanelBody').innerHTML = '<p style="color:#666;font-size:.8rem;">Aucune image détectée sur cette page.</p>';
    _abOpenPanel(); return;
  }
  const html = '<div class="ab-img-list">' + imgs.map((img,i) => `
    <div class="ab-img-thumb" onclick="_abOpenImgOverlay('${img.dataset.abImg}',${i})">
      <img src="${img.src}" alt="">
      <div class="ab-img-thumb-lbl">${img.dataset.abImg.split('|').pop()}</div>
    </div>`).join('') + '</div>';
  document.getElementById('abPanelBody').innerHTML = html;
  _abOpenPanel();
}

/* ══════════════════════════════════════════════════════════════
   ÉDITION D'IMAGES (overlay au clic)
══════════════════════════════════════════════════════════════ */
function _abActivateImages(pageKey) {
  const main = document.querySelector('main');
  if (!main) return;

  // Coaches
  main.querySelectorAll('.coach-grid .coach-card').forEach((card, i) => {
    const img = card.querySelector('.coach-card__photo img,.coach-card__photo .initials');
    if (img && img.tagName === 'IMG') _abWrapImg(img, `coaches|${i}|photo`);
  });
  main.querySelectorAll('#gradesDojos .coach-card').forEach((card, i) => {
    const img = card.querySelector('.coach-card__photo img');
    if (img) _abWrapImg(img, `ceintures_noires|${i}|photo`);
  });
  // Actus
  main.querySelectorAll('.actu-card__img').forEach((img, i) => {
    if (img.tagName === 'IMG') _abWrapImg(img, `actus|${i}|image`);
  });
  // Logos dojos
  main.querySelectorAll('.dojo-block__logo').forEach((img, i) => {
    _abWrapImg(img, `dojos|${i}|logo`);
  });
  // Logo hero (si présent)
  const heroLogo = main.querySelector('.hero-mini__logo-bg, .hero__logo');
  if (heroLogo && heroLogo.tagName === 'IMG') _abWrapImg(heroLogo, `club|logo|`);
}

function _abWrapImg(img, key) {
  const wrap = document.createElement('div');
  wrap.className = 'ab-img-wrap';
  wrap.style.cssText = img.style.cssText || '';
  img.dataset.abImg = key;
  img.parentNode.insertBefore(wrap, img);
  wrap.appendChild(img);
  const btn = document.createElement('div');
  btn.className = 'ab-img-edit-btn';
  btn.innerHTML = '<span>🖼 Changer</span>';
  btn.onclick = (e) => { e.stopPropagation(); _abOpenImgOverlay(key); };
  wrap.appendChild(btn);
}

function _abOpenImgOverlay(key, _unused) {
  // Trouver l'image actuelle
  const imgEl  = document.querySelector(`[data-ab-img="${key}"]`);
  const curSrc = imgEl ? imgEl.src : '';
  const overlay = document.getElementById('abImgOverlay');
  overlay.innerHTML = `
    <button class="ab-io-close" onclick="_abCloseImgOverlay()">✕</button>
    <div class="ab-io-title">Changer l'image</div>
    <div class="ab-io-tabs">
      <button class="ab-io-tab active" id="tabUrl" onclick="_abIoTab('url')">🔗 URL</button>
      <button class="ab-io-tab" id="tabUpload" onclick="_abIoTab('upload')">📁 Fichier</button>
    </div>
    <div class="ab-io-pane active" id="paneUrl">
      <div style="color:#666;font-size:.65rem;margin-bottom:.5rem;">URL actuelle :</div>
      <input class="ab-inp" id="abImgUrl" value="${curSrc}" placeholder="https://… ou img/photo.png">
      ${curSrc ? `<img class="ab-io-preview" id="abImgPrev" src="${curSrc}">` : ''}
      <button class="ab-io-btn" onclick="_abApplyImgUrl('${key}')">✓ Appliquer</button>
    </div>
    <div class="ab-io-pane" id="paneUpload">
      <div class="ab-io-drop" id="abIoDrop" onclick="document.getElementById('abIoFile').click()">
        Cliquer ou glisser-déposer une image ici<br>
        <span style="color:#555;font-size:.6rem;">JPG · PNG · WebP · max 2 Mo</span>
      </div>
      <input type="file" id="abIoFile" accept="image/*" style="display:none" onchange="_abOnFileSelect(event,'${key}')">
      <img class="ab-io-preview" id="abIoUploadPrev" style="display:none">
      <div class="ab-io-status" id="abIoStatus"></div>
    </div>`;

  // URL preview live
  const urlInput = overlay.querySelector('#abImgUrl');
  if (urlInput) urlInput.addEventListener('input', () => {
    let p = overlay.querySelector('#abImgPrev');
    if (!p) { p = document.createElement('img'); p.className='ab-io-preview';p.id='abImgPrev';urlInput.after(p); }
    p.src = urlInput.value;
    p.style.display = urlInput.value ? 'block' : 'none';
  });

  // Drag & drop
  const drop = overlay.querySelector('#abIoDrop');
  if (drop) {
    drop.addEventListener('dragover', e=>{e.preventDefault();drop.classList.add('drag-over');});
    drop.addEventListener('dragleave',()=>drop.classList.remove('drag-over'));
    drop.addEventListener('drop', e=>{e.preventDefault();drop.classList.remove('drag-over');const f=e.dataTransfer.files[0];if(f)_abHandleImageFile(f,key);});
  }

  // Position overlay près de l'image
  if (imgEl) {
    const rect = imgEl.getBoundingClientRect();
    overlay.style.top  = Math.min(rect.bottom + 8, window.innerHeight - 340) + 'px';
    overlay.style.left = Math.min(rect.left, window.innerWidth - 340) + 'px';
  } else {
    overlay.style.top = '80px'; overlay.style.left = '20px';
  }
  overlay.classList.remove('ab-hidden');
}

function _abCloseImgOverlay() { document.getElementById('abImgOverlay').classList.add('ab-hidden'); }

function _abIoTab(tab) {
  document.querySelectorAll('.ab-io-tab,.ab-io-pane').forEach(el => el.classList.remove('active'));
  document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
  document.getElementById('pane' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
}

function _abApplyImgUrl(key) {
  const url = (document.getElementById('abImgUrl').value||'').trim();
  if (!url) return;
  _abSaveImageKey(key, url);
}

function _abOnFileSelect(e, key) {
  const file = e.target.files[0];
  if (file) _abHandleImageFile(file, key);
}

function _abHandleImageFile(file, key) {
  if (file.size > 2 * 1024 * 1024) {
    document.getElementById('abIoStatus').textContent = '⚠ Fichier trop volumineux (max 2 Mo). Compressez l\'image ou utilisez une URL.';
    return;
  }
  document.getElementById('abIoStatus').textContent = '⏳ Lecture du fichier…';
  const reader = new FileReader();
  reader.onload = e => {
    const dataUrl = e.target.result;
    const prev = document.getElementById('abIoUploadPrev');
    if (prev) { prev.src = dataUrl; prev.style.display = 'block'; }
    document.getElementById('abIoStatus').textContent = '⏳ Envoi vers Supabase Storage…';
    _abUploadToStorage(file, dataUrl, key);
  };
  reader.readAsDataURL(file);
}

async function _abUploadToStorage(file, fallbackDataUrl, key) {
  const status = document.getElementById('abIoStatus');
  try {
    const fname = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
    const res = await fetch(`${_AB_SB_URL}/storage/v1/object/${_AB_BUCKET}/${fname}`, {
      method:'POST',
      headers:{ 'Authorization':`Bearer ${_AB_SB_KEY}`, 'Content-Type':file.type, 'x-upsert':'true' },
      body: file
    });
    if (res.ok) {
      const publicUrl = `${_AB_SB_URL}/storage/v1/object/public/${_AB_BUCKET}/${fname}`;
      status.textContent = '✓ Image uploadée !';
      _abSaveImageKey(key, publicUrl);
    } else {
      // Fallback : utiliser data URL (petite image)
      if (fallbackDataUrl.length < 400000) {
        status.textContent = '✓ Image enregistrée en local.';
        _abSaveImageKey(key, fallbackDataUrl);
      } else {
        status.textContent = '⚠ Upload échoué. Activez le bucket Supabase ou utilisez une URL.';
      }
    }
  } catch(err) {
    if (fallbackDataUrl && fallbackDataUrl.length < 400000) {
      status.textContent = '✓ Image enregistrée (hors-ligne).';
      _abSaveImageKey(key, fallbackDataUrl);
    } else {
      status.textContent = '⚠ Erreur réseau. Utilisez une URL à la place.';
    }
  }
}

function _abSaveImageKey(key, url) {
  const parts   = key.split('|');
  const section = parts[0];
  const sub     = parts[1];
  const field   = parts[2];

  // Mettre à jour l'image dans le DOM immédiatement
  const imgEl = document.querySelector(`[data-ab-img="${key}"]`);
  if (imgEl) { imgEl.src = url; imgEl.style.display='block'; }

  if (section === 'club') {
    const club = JSON.parse(JSON.stringify(getData().club||{}));
    club[sub] = url;
    saveSection('club', club);
  } else {
    const arr = JSON.parse(JSON.stringify(getSection(section)||[]));
    const idx = parseInt(sub,10);
    if (!isNaN(idx) && field) {
      while (arr.length<=idx) arr.push({});
      arr[idx][field] = url;
      saveSection(section, arr);
    }
  }
  setTimeout(() => {
    document.getElementById('abIoStatus') && (document.getElementById('abIoStatus').textContent = '✓ Sauvegardé !');
    _abCloseImgOverlay();
    setTimeout(() => location.reload(), 700);
  }, 500);
}

/* ══════════════════════════════════════════════════════════════
   TEXTE ÉDITABLE INLINE
══════════════════════════════════════════════════════════════ */
/* Placeholders pour chaque champ structuré */
const _abPlaceholders = {
  'name':'Cliquer pour ajouter un nom','grade':'Cliquer pour ajouter un grade',
  'role':'Cliquer pour ajouter un rôle','bio':'Cliquer pour ajouter une bio',
  'dojo':'Cliquer pour indiquer le dojo','title':'Cliquer pour ajouter un titre',
  'text':'Cliquer pour ajouter un texte','tag':'Tag','date':'Date',
  'address':'Adresse','phone':'Téléphone','president':'Président',
  'tresorier':'Trésorier','secretaire':'Secrétaire',
};

function _abMake(el, key) {
  if (!el || el.dataset.ab) return;
  el.dataset.ab = key;
  el.contentEditable = true;
  el.spellcheck = false;
  // Placeholder selon le champ
  const field = key.split('|')[2] || key.split('|')[1] || '';
  el.dataset.placeholder = _abPlaceholders[field] || 'Cliquer pour éditer…';
  el.addEventListener('input', () => { el.dataset.dirty='1'; _abMarkDirty(); });
  el.addEventListener('keydown', e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();el.blur();} });
}

function _abMakeText(el, pageKey) {
  if (!el || !el.textContent.trim()) return;
  if (el.querySelector('img,iframe,canvas,svg,input,button,select')) return;
  if (!el.id) {
    el.id = `_ab_${pageKey}_${el.tagName.toLowerCase()}_${Math.random().toString(36).slice(2,7)}`;
  }
  _abMake(el, `text_overrides|${pageKey}|${el.id}`);
}

function _abMakeAllEditable(pageKey) {
  const main = document.querySelector('main');
  if (!main) return;
  const SEL = [
    'h1','h2','h3','h4',
    '.hero-mini__title .line span','.hero-mini__eyebrow',
    '.eyebrow-text','.section__title','.section__lede',
    '.cta-band__title','.cta-band__sub',
    'p[id]','[id^="ch-"],[id^="ct-"],[id^="ins-"],[id^="disc-"]',
    '.diplome-card__title','.diplome-card__text','.diplome-card__badge',
    '.tarif-card__name','.tarif-card__price',
    '.stat-card__label','.stat-card__suffix',
    '.discipline-intro','.hero__tagline',
  ].join(',');
  main.querySelectorAll(SEL).forEach(el => _abMakeText(el, pageKey));
  main.querySelectorAll('section p:not([data-ab])').forEach(el => {
    if (el.closest('.actu-card,.coach-card,.bureau-card,.dojo-block,.custom-block')) return;
    _abMakeText(el, pageKey);
  });
}

/* ══════════════════════════════════════════════════════════════
   DONNÉES STRUCTURÉES (arrays)
══════════════════════════════════════════════════════════════ */
function _abStructured(pageKey) {
  if (pageKey==='encadrement') _abEncadrement();
  if (pageKey==='dojos')       _abDojos();
  if (pageKey==='actus')       _abActus();
}
function _abEncadrement() {
  document.querySelectorAll('.coach-grid .coach-card').forEach((card,i) => {
    _abMake(card.querySelector('.coach-card__name'),  `coaches|${i}|name`);
    _abMake(card.querySelector('.coach-card__grade'), `coaches|${i}|grade`);
    _abMake(card.querySelector('.coach-card__role'),  `coaches|${i}|role`);
    _abMake(card.querySelector('.coach-card__bio'),   `coaches|${i}|bio`);
    _abMake(card.querySelector('.coach-card__dojo'),  `coaches|${i}|dojo`);
  });
  document.querySelectorAll('#gradesDojos .coach-card').forEach((card,i) => {
    _abMake(card.querySelector('.coach-card__name'),  `ceintures_noires|${i}|name`);
    _abMake(card.querySelector('.coach-card__grade'), `ceintures_noires|${i}|grade`);
    _abMake(card.querySelector('.coach-card__role'),  `ceintures_noires|${i}|dojo`);
  });
}
function _abDojos() {
  document.querySelectorAll('.dojo-block').forEach((block,i) => {
    _abMake(block.querySelector('.dojo-block__name'), `dojos|${i}|name`);
    _abMake(block.querySelector('.dojo-block__sub'),  `dojos|${i}|address`);
    const roles=['president','tresorier','secretaire'];
    block.querySelectorAll('.bureau-card').forEach((bc,ri) => {
      const r=roles[ri];if(!r)return;
      _abMake(bc.querySelector('.bureau-card__name'),`dojos|${i}|${r}`);
      bc.querySelectorAll('.bureau-contact a').forEach(a=>{
        if(a.href.startsWith('tel:'))    _abMake(a,`dojos|${i}|${r}Phone`);
        if(a.href.startsWith('mailto:')) _abMake(a,`dojos|${i}|${r}Email`);
      });
    });
    block.querySelectorAll('.dojo-item').forEach(item=>{
      const label=item.querySelector('.dojo-item__label');
      const val=item.querySelector('.dojo-item__value');
      if(!label||!val)return;
      const t=label.textContent.trim().toLowerCase();
      if(t==='téléphone')          _abMake(val,`dojos|${i}|phone`);
      else if(t==='accès')         _abMake(val,`dojos|${i}|acces`);
      else if(t.includes('instruc'))_abMake(val,`dojos|${i}|instructeur`);
    });
  });
}
function _abActus() {
  document.querySelectorAll('.actu-card').forEach((card,i) => {
    _abMake(card.querySelector('.actu-card__title'),`actus|${i}|title`);
    _abMake(card.querySelector('.actu-card__text'), `actus|${i}|text`);
    _abMake(card.querySelector('.actu-card__tag'),  `actus|${i}|tag`);
    _abMake(card.querySelector('.actu-card__date'), `actus|${i}|date`);
  });
}

/* ══════════════════════════════════════════════════════════════
   AJOUTER / SUPPRIMER DES ÉLÉMENTS
══════════════════════════════════════════════════════════════ */
function _abAddDeleteControls(pageKey) {
  if (pageKey==='encadrement') {
    _abDeleteCards('.coach-grid .coach-card','coaches');
    _abDeleteCards('#gradesDojos .coach-card','ceintures_noires');
    _abAddButton(document.getElementById('coachGrid'),   '+ Ajouter un coach',                 ()=>_abAddForm('coach'));
    _abAddButton(document.getElementById('gradesDojos'), '+ Ajouter une ceinture noire/marron', ()=>_abAddForm('cn'));
  }
  if (pageKey==='actus') {
    _abDeleteCards('.actu-card','actus');
    const grid = document.querySelector('.actus-grid,.actus-list,#actusGrid') || document.querySelector('.section .wrap');
    _abAddButton(grid, '+ Ajouter une actualité', ()=>_abAddForm('actu'));
  }
}
function _abDeleteCards(sel, section) {
  document.querySelectorAll(sel).forEach((card,i) => {
    card.classList.add('ab-deletable');
    const btn = document.createElement('button');
    btn.className = 'ab-del-btn'; btn.title='Supprimer'; btn.textContent='×';
    btn.onclick = e => {
      e.stopPropagation();
      if (!confirm('Supprimer cet élément ?')) return;
      const arr = JSON.parse(JSON.stringify(getSection(section)||[]));
      arr.splice(i,1); saveSection(section,arr);
      setTimeout(()=>location.reload(),900);
    };
    card.appendChild(btn);
  });
}
function _abAddButton(container, label, onClick) {
  if (!container) return;
  const btn = document.createElement('button');
  btn.className='ab-add-btn'; btn.textContent=label; btn.onclick=onClick;
  if (container.nextSibling) container.parentNode.insertBefore(btn, container.nextSibling);
  else container.parentNode && container.parentNode.appendChild(btn);
}

/* ══════════════════════════════════════════════════════════════
   FORMULAIRES D'AJOUT (coaches, CN, actus)
══════════════════════════════════════════════════════════════ */
const _abForms = {
  coach:{ title:'Ajouter un coach', section:'coaches', fields:[
    {key:'name',label:'Nom',type:'text',ph:'Prénom Nom'},
    {key:'grade',label:'Grade',type:'text',ph:'3e Dan Shindokai'},
    {key:'role',label:'Rôle',type:'text',ph:'Animateur Fédéral'},
    {key:'dojo',label:'Dojo',type:'text',ph:'Dojo de Santes'},
    {key:'bio',label:'Bio',type:'textarea',ph:'Quelques mots…'},
    {key:'photo',label:'Photo (URL ou img/...)',type:'text',ph:'img/coach-prenom.png',preview:true},
    {key:'initials',label:'Initiales (si pas de photo)',type:'text',ph:'AB'},
  ]},
  cn:{ title:'Ajouter une ceinture noire / marron', section:'ceintures_noires', fields:[
    {key:'name',label:'Nom',type:'text',ph:'Prénom Nom'},
    {key:'grade',label:'Grade / Ceinture',type:'text',ph:'1er Dan · Ceinture Noire'},
    {key:'dojo',label:'Dojo',type:'text',ph:'Dojo de Santes'},
    {key:'photo',label:'Photo (URL)',type:'text',ph:'img/cn-prenom.png',preview:true},
    {key:'initials',label:'Initiales',type:'text',ph:'AB'},
  ]},
  actu:{ title:'Ajouter une actualité', section:'actus', fields:[
    {key:'title',label:'Titre',type:'text',ph:'Titre de l\'actualité'},
    {key:'tag',label:'Tag',type:'text',ph:'Compétition / Stage / Grades…'},
    {key:'date',label:'Date',type:'text',ph:'Juin 2025'},
    {key:'text',label:'Texte',type:'textarea',ph:'Description…'},
    {key:'image',label:'Image (URL)',type:'text',ph:'img/actu.jpg',preview:true},
    {key:'lien',label:'Lien (optionnel)',type:'text',ph:'https://…'},
    {key:'type',label:'Style de carte',type:'select',options:['actu','gold','dark']},
  ]},
};
function _abAddForm(type) {
  const cfg=_abForms[type];if(!cfg)return;
  const fieldsHTML=cfg.fields.map(f=>{
    const id=`abf_${f.key}`;
    let inp;
    if(f.type==='textarea') inp=`<textarea id="${id}" class="ab-input ab-textarea" placeholder="${f.ph||''}"></textarea>`;
    else if(f.type==='select') inp=`<select id="${id}" class="ab-select-input">${(f.options||[]).map(o=>`<option value="${o}">${o}</option>`).join('')}</select>`;
    else inp=`<input id="${id}" class="ab-input" type="text" placeholder="${f.ph||''}">`;
    const prev=f.preview?`<img id="${id}_prev" class="ab-img-preview">`:'' ;
    return `<div class="ab-field"><label class="ab-label" for="${id}">${f.label}</label>${inp}${prev}</div>`;
  }).join('');
  document.getElementById('abModalBox').innerHTML=`
    <div class="ab-modal-title">${cfg.title}</div>${fieldsHTML}
    <div class="ab-modal-btns">
      <button class="ab-modal-cancel" onclick="_abCloseModal()">Annuler</button>
      <button class="ab-modal-ok" onclick="_abSubmitAdd('${type}')">Ajouter</button>
    </div>`;
  cfg.fields.filter(f=>f.preview).forEach(f=>{
    const inp=document.getElementById(`abf_${f.key}`);
    const prev=document.getElementById(`abf_${f.key}_prev`);
    if(inp&&prev)inp.addEventListener('input',()=>{prev.src=inp.value;prev.className='ab-img-preview'+(inp.value?' visible':'');});
  });
  document.getElementById('abModal').classList.remove('ab-hidden');
}
function _abCloseModal(){ document.getElementById('abModal').classList.add('ab-hidden'); }
function _abSubmitAdd(type){
  const cfg=_abForms[type];if(!cfg)return;
  const item={};
  cfg.fields.forEach(f=>{const el=document.getElementById(`abf_${f.key}`);if(el)item[f.key]=el.value.trim();});
  if(type==='actu')item.id=Date.now();
  const arr=JSON.parse(JSON.stringify(getSection(cfg.section)||[]));
  arr.push(item);saveSection(cfg.section,arr);
  _abCloseModal();setTimeout(()=>location.reload(),1000);
}

/* ══════════════════════════════════════════════════════════════
   BLOCS DE TEXTE INSÉRABLES
══════════════════════════════════════════════════════════════ */
function _abInjectSectionInserts(pageKey) {
  const main=document.querySelector('main');if(!main)return;
  const sections=Array.from(main.children).filter(el=>el.tagName==='SECTION'||el.tagName==='DIV');
  if(sections[0])sections[0].before(_abInsertZone(pageKey,-1));
  sections.forEach((sec,i)=>sec.after(_abInsertZone(pageKey,i)));
}
function _abInsertZone(pageKey,afterIdx){
  const z=document.createElement('div');
  z.className='ab-insert-zone';
  z.innerHTML=`<span class="ab-insert-line"></span><button class="ab-insert-btn">＋ Insérer un bloc ici</button><span class="ab-insert-line"></span>`;
  z.querySelector('.ab-insert-btn').onclick=()=>_abOpenBlockForm(pageKey,afterIdx);
  return z;
}
function _abOpenBlockForm(pageKey,afterIdx){
  document.getElementById('abModalBox').innerHTML=`
    <div class="ab-modal-title">Insérer un bloc de texte</div>
    <div class="ab-field"><label class="ab-label">Type de bloc</label>
      <select id="abBlockType" class="ab-select-input">
        <option value="text">Paragraphe(s)</option>
        <option value="title-text">Titre + texte</option>
        <option value="callout">Encadré mis en valeur</option>
        <option value="title-only">Titre seul</option>
      </select></div>
    <div class="ab-field" id="abBlockTitleField"><label class="ab-label">Titre</label>
      <input id="abBlockTitle" class="ab-input" type="text" placeholder="Titre du bloc"></div>
    <div class="ab-field"><label class="ab-label">Texte (entrée = nouveau paragraphe)</label>
      <textarea id="abBlockContent" class="ab-input ab-textarea" placeholder="Votre texte ici…"></textarea></div>
    <div class="ab-field"><label class="ab-label">Eyebrow (optionnel)</label>
      <input id="abBlockEyebrow" class="ab-input" type="text" placeholder="ex : Informations pratiques"></div>
    <div class="ab-modal-btns">
      <button class="ab-modal-cancel" onclick="_abCloseModal()">Annuler</button>
      <button class="ab-modal-ok" onclick="_abSubmitBlock('${pageKey}',${afterIdx})">Insérer</button>
    </div>`;
  const typeEl=document.getElementById('abBlockType');
  const titleFld=document.getElementById('abBlockTitleField');
  typeEl.onchange=()=>{titleFld.style.display=typeEl.value==='text'?'none':'';};
  typeEl.dispatchEvent(new Event('change'));
  document.getElementById('abModal').classList.remove('ab-hidden');
}
function _abSubmitBlock(pageKey,afterIdx){
  const type=(document.getElementById('abBlockType').value);
  const title=(document.getElementById('abBlockTitle').value||'').trim();
  const content=(document.getElementById('abBlockContent').value||'').trim();
  const eyebrow=(document.getElementById('abBlockEyebrow').value||'').trim();
  if(!content&&!title){alert('Ajoutez au moins un titre ou un texte.');return;}
  const block={id:Date.now().toString(36),page:pageKey,after:afterIdx,type,title,content,eyebrow,order:Date.now()};
  const blocks=JSON.parse(JSON.stringify(getSection('custom_blocks')||[]));
  blocks.push(block);saveSection('custom_blocks',blocks);
  _abCloseModal();setTimeout(()=>location.reload(),1000);
}

/* Rendu et suppression des blocs (appelé depuis render.js) */
function renderCustomBlocks(pageKey){
  const blocks=(typeof getSection==='function')?(getSection('custom_blocks')||[]):[];
  const forPage=blocks.filter(b=>b.page===pageKey).sort((a,b)=>b.after-a.after||b.order-a.order);
  const main=document.querySelector('main');if(!main||!forPage.length)return;
  const sections=Array.from(main.children).filter(el=>el.tagName==='SECTION'||(el.tagName==='DIV'&&!el.classList.contains('ab-insert-zone')));
  forPage.forEach(block=>{
    const el=_abBuildBlock(block);
    const ref=sections[block.after];
    if(ref)ref.after(el);else if(sections[0])sections[0].before(el);else main.appendChild(el);
  });
}
function _abBuildBlock(block){
  const isAdmin=(function(){try{return!!sessionStorage.getItem('shindokai_admin');}catch(e){return false;}})();
  const delBtn=isAdmin?`<button class="custom-block__del" onclick="_abDeleteBlock('${block.id}')">✕ Supprimer</button>`:'';
  const eyebrow=block.eyebrow?`<span class="eyebrow-text" style="margin-bottom:1rem;display:inline-flex;">${_abEsc(block.eyebrow)}</span>`:'';
  const paras=(block.content||'').split('\n').filter(l=>l.trim()).map(l=>`<p style="color:var(--ash);margin-bottom:.8rem;line-height:1.7;">${_abEsc(l)}</p>`).join('');
  let inner='';
  if(block.type==='callout'){
    inner=`<div class="wrap"><div class="custom-block--callout">${delBtn}${eyebrow}${block.title?`<h3 style="font-family:var(--display);font-size:1.4rem;text-transform:uppercase;color:var(--bone);margin-bottom:.8rem;">${_abEsc(block.title)}</h3>`:''}<div class="cb-content">${paras}</div></div></div>`;
  }else if(block.type==='title-only'){
    inner=`<div class="wrap"><div style="max-width:760px;margin:0 auto;text-align:center;">${delBtn}${eyebrow}<h2 class="section__title">${_abEsc(block.title)}</h2></div></div>`;
  }else{
    inner=`<div class="wrap"><div style="max-width:760px;margin:0 auto;">${delBtn}${eyebrow}${block.title?`<h2 class="section__title" style="margin-bottom:1.4rem;">${_abEsc(block.title)}</h2>`:''} ${paras}</div></div>`;
  }
  const sec=document.createElement('section');
  sec.className='section custom-block';sec.dataset.cbId=block.id;sec.innerHTML=inner;
  return sec;
}
function _abDeleteBlock(id){
  if(!confirm('Supprimer ce bloc ?'))return;
  saveSection('custom_blocks',(getSection('custom_blocks')||[]).filter(b=>b.id!==id));
  setTimeout(()=>location.reload(),900);
}

/* ══════════════════════════════════════════════════════════════
   ANNULER (UNDO)
══════════════════════════════════════════════════════════════ */
function _abPushUndo(section, data) {
  window._abUndoStack = window._abUndoStack || [];
  window._abUndoStack.push({ section, data: JSON.parse(JSON.stringify(data)) });
  document.getElementById('abUndo').disabled = false;
}
function _abUndo() {
  const stack = window._abUndoStack || [];
  if (!stack.length) return;
  const { section, data } = stack.pop();
  saveSection(section, data);
  if (!stack.length) document.getElementById('abUndo').disabled = true;
  setTimeout(() => location.reload(), 900);
}

/* ══════════════════════════════════════════════════════════════
   SAUVEGARDE
══════════════════════════════════════════════════════════════ */
function _abSave() {
  const btn=document.getElementById('abSave');
  btn.disabled=true;
  const saveIcon=btn.querySelector('.ab-tool-icon');
  if(saveIcon)saveIcon.textContent='⏳';

  const dirty=Array.from(document.querySelectorAll('[data-ab][data-dirty]'));
  if(!dirty.length){location.reload();return;}

  const sectionUpdates={};
  const textOverrides={};

  dirty.forEach(el=>{
    const parts=el.dataset.ab.split('|');
    const sec=parts[0],sub=parts[1],field=parts[2];
    const val=el.textContent.trim();
    if(sec==='text_overrides'){textOverrides[`${sub}|${field}`]=val;return;}
    if(sec==='club'){
      if(!sectionUpdates.club)sectionUpdates.club=JSON.parse(JSON.stringify(getData().club||{}));
      if(sub==='heroTitle'){if(!Array.isArray(sectionUpdates.club.heroTitle))sectionUpdates.club.heroTitle=['',''];sectionUpdates.club.heroTitle[parseInt(field,10)]=val;}
      else sectionUpdates.club[sub]=val;
      return;
    }
    const idx=parseInt(sub,10);if(isNaN(idx)||!field)return;
    if(!sectionUpdates[sec]){
      _abPushUndo(sec,getSection(sec)||[]);
      sectionUpdates[sec]=JSON.parse(JSON.stringify(getSection(sec)||[]));
    }
    while(sectionUpdates[sec].length<=idx)sectionUpdates[sec].push({});
    sectionUpdates[sec][idx][field]=val;
  });

  Object.entries(sectionUpdates).forEach(([sec,data])=>saveSection(sec,data));
  if(Object.keys(textOverrides).length){
    const merged=Object.assign({},getSection('text_overrides')||{},textOverrides);
    saveSection('text_overrides',merged);
  }

  setTimeout(()=>{
    if(saveIcon)saveIcon.textContent='✓';
    setTimeout(()=>location.reload(),600);
  },1400);
}

/* ══════════════════════════════════════════════════════════════
   HELPER ESCAPE
══════════════════════════════════════════════════════════════ */
function _abEsc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
