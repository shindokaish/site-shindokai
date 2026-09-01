/* ============================================================
   SHINDOKAI ADMIN BAR — barre flottante d'édition en direct
   ============================================================ */
'use strict';

function initAdminBar(pageKey) {
  try { if (!sessionStorage.getItem('shindokai_admin')) return; } catch(e) { return; }

  /* ── Styles ── */
  const style = document.createElement('style');
  style.textContent = `
  #sab{position:fixed;top:0;left:0;right:0;z-index:99999;height:46px;
    background:linear-gradient(90deg,#0d0d10,#1a0a09);
    border-bottom:2px solid #e0241b;
    display:flex;align-items:center;justify-content:space-between;
    padding:0 1.2rem;gap:.8rem;font-family:'Inter',sans-serif;font-size:.78rem;}
  #sab .sab-left{display:flex;align-items:center;gap:.8rem;}
  #sab .sab-badge{background:#e0241b;color:#fff;font-weight:700;font-size:.62rem;
    letter-spacing:.12em;text-transform:uppercase;padding:.25rem .55rem;}
  #sab .sab-page{color:#888;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;}
  #sab .sab-right{display:flex;align-items:center;gap:.5rem;}
  #sab button{cursor:pointer;border:none;font-family:'Inter',sans-serif;
    font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;transition:all .2s;}
  #sab .sab-edit{background:rgba(224,36,27,.15);color:#e0241b;
    border:1px solid rgba(224,36,27,.4)!important;padding:.38rem .9rem;}
  #sab .sab-edit:hover{background:rgba(224,36,27,.3);}
  #sab .sab-exit{background:none;color:#555;border:1px solid #2a2a2f!important;padding:.38rem .9rem;}
  #sab .sab-exit:hover{color:#aaa;border-color:#555!important;}
  #sab .sab-save{background:#e0241b;color:#fff;padding:.38rem 1.1rem;display:none;}
  #sab .sab-save:hover{background:#c01f17;}
  #sab .sab-save.visible{display:block;}

  #sad{position:fixed;top:46px;right:0;bottom:0;width:420px;z-index:99998;
    background:#111115;border-left:1px solid #2a2a2f;
    display:flex;flex-direction:column;transform:translateX(100%);
    transition:transform .3s cubic-bezier(.4,0,.2,1);overflow:hidden;}
  #sad.open{transform:translateX(0);}
  #sad .sad-header{padding:1.1rem 1.4rem;border-bottom:1px solid #1e1e22;
    display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
  #sad .sad-title{font-family:'Oswald',sans-serif;font-size:1rem;text-transform:uppercase;
    letter-spacing:.06em;color:#f3efe7;}
  #sad .sad-close{background:none;border:none!important;color:#555;font-size:1.4rem;
    cursor:pointer;line-height:1;padding:0;}
  #sad .sad-close:hover{color:#aaa;}
  #sad .sad-body{flex:1;overflow-y:auto;padding:1.2rem 1.4rem;}
  #sad .sad-footer{padding:1rem 1.4rem;border-top:1px solid #1e1e22;flex-shrink:0;
    display:flex;gap:.6rem;}

  .sab-section{margin-bottom:1.6rem;}
  .sab-section-title{font-family:'Oswald',sans-serif;font-size:.7rem;letter-spacing:.12em;
    text-transform:uppercase;color:#e0241b;margin-bottom:.8rem;padding-bottom:.5rem;
    border-bottom:1px solid #1e1e22;}
  .sab-field{display:flex;flex-direction:column;gap:.3rem;margin-bottom:.9rem;}
  .sab-label{font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;color:#555;}
  .sab-input,.sab-textarea,.sab-select{
    background:#1a1a1e;border:1px solid #2a2a2f;color:#c8c4bc;
    padding:.55rem .7rem;font-family:'Inter',sans-serif;font-size:.82rem;width:100%;
    transition:border-color .2s;resize:vertical;}
  .sab-input:focus,.sab-textarea:focus,.sab-select:focus{border-color:#e0241b;outline:none;}
  .sab-textarea{min-height:70px;}
  .sab-card{background:#1a1a1e;border:1px solid #222226;padding:.9rem;margin-bottom:.6rem;position:relative;}
  .sab-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.7rem;}
  .sab-card-name{font-size:.82rem;color:#f3efe7;font-weight:600;}
  .sab-card-actions{display:flex;gap:.4rem;}
  .sab-btn{cursor:pointer;border:none!important;font-family:'Inter',sans-serif;
    font-size:.65rem;letter-spacing:.06em;text-transform:uppercase;padding:.3rem .6rem;transition:all .2s;}
  .sab-btn-del{background:rgba(224,36,27,.15);color:#e0241b;}
  .sab-btn-del:hover{background:rgba(224,36,27,.3);}
  .sab-btn-add{background:rgba(201,162,39,.12);color:#c9a227;border:1px solid rgba(201,162,39,.3)!important;
    width:100%;padding:.55rem;margin-top:.4rem;font-size:.7rem;}
  .sab-btn-add:hover{background:rgba(201,162,39,.25);}
  .sab-btn-primary{background:#e0241b;color:#fff;padding:.6rem 1.4rem;}
  .sab-btn-primary:hover{background:#c01f17;}
  .sab-btn-ghost{background:none;color:#555;border:1px solid #2a2a2f!important;padding:.6rem 1.4rem;}
  .sab-btn-ghost:hover{color:#aaa;}
  .sab-photo-wrap{display:flex;gap:.6rem;align-items:flex-end;}
  .sab-photo-wrap .sab-input{flex:1;}
  .sab-photo-preview{width:48px;height:48px;object-fit:cover;border:1px solid #2a2a2f;flex-shrink:0;display:none;}
  .sab-ok{font-size:.72rem;color:#4caf50;padding:.3rem 0;display:none;}
  body.sab-push{padding-top:46px;}
  `;
  document.head.appendChild(style);
  document.body.classList.add('sab-push');

  /* ── Barre ── */
  const bar = document.createElement('div');
  bar.id = 'sab';
  const pageLabels = {
    index:'Accueil', encadrement:"L'Encadrement", dojos:'Les Dojos',
    discipline:'La Discipline', actus:'Actualités', contact:'Contact', inscription:'Inscription'
  };
  bar.innerHTML = `
    <div class="sab-left">
      <span class="sab-badge">⚙ Admin</span>
      <span class="sab-page">${pageLabels[pageKey] || pageKey}</span>
    </div>
    <div class="sab-right">
      <button class="sab-save" id="sabSave">💾 Enregistrer</button>
      <button class="sab-edit" id="sabEdit">✏ Éditer la page</button>
      <button class="sab-exit" id="sabExit">Quitter</button>
    </div>`;
  document.body.prepend(bar);

  /* ── Tiroir ── */
  const drawer = document.createElement('div');
  drawer.id = 'sad';
  drawer.innerHTML = `
    <div class="sad-header">
      <span class="sad-title" id="sadTitle">Édition</span>
      <button class="sad-close" id="sadClose">×</button>
    </div>
    <div class="sad-body" id="sadBody"></div>
    <div class="sad-footer">
      <button class="sab-btn sab-btn-primary" id="sadSave">💾 Enregistrer</button>
      <button class="sab-btn sab-btn-ghost" id="sadCancel">Annuler</button>
      <span class="sab-ok" id="sadOk">✓ Enregistré !</span>
    </div>`;
  document.body.appendChild(drawer);

  /* ── Helpers ── */
  function field(label, type, value, key) {
    const id = 'sab_' + key.replace(/[^a-z0-9]/gi, '_');
    const tag = type === 'textarea' ? `<textarea class="sab-textarea" id="${id}">${esc2(value||'')}</textarea>`
      : `<input class="sab-input" type="${type}" id="${id}" value="${esc2(value||'')}">`;
    return `<div class="sab-field"><label class="sab-label">${label}</label>${tag}</div>`;
  }
  function esc2(s) { return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
  function val(key) {
    const el = document.getElementById('sab_' + key.replace(/[^a-z0-9]/gi, '_'));
    return el ? el.value : '';
  }

  /* ── Builders par page ── */
  const builders = {

    /* ===== ACCUEIL ===== */
    index() {
      const tx = getSection('textes') || {};
      const club = getSection('club') || {};
      const acc = tx.accueil || {};
      return {
        title: 'Édition — Accueil',
        html: `
          <div class="sab-section"><div class="sab-section-title">Le Club</div>
            ${field('Nom du club','text', club.nom,'club_nom')}
            ${field('Sous-titre','text', club.tagline,'club_tagline')}
            ${field('Description courte','textarea', club.description,'club_description')}
          </div>
          <div class="sab-section"><div class="sab-section-title">Hero (bannière)</div>
            ${field('Eyebrow (petite étiquette)','text', acc.heroEyebrow,'acc_heroEyebrow')}
            ${field('Titre ligne 1','text', (acc.heroTitre||[''])[0],'acc_heroL1')}
            ${field('Titre ligne 2','text', (acc.heroTitre||['',''])[1],'acc_heroL2')}
          </div>
          <div class="sab-section"><div class="sab-section-title">Section "Qui sommes-nous"</div>
            ${field('Eyebrow','text', acc.s1Eyebrow,'acc_s1ey')}
            ${field('Titre','textarea', acc.s1Titre,'acc_s1ti')}
            ${field('Texte intro','textarea', acc.s1Lede,'acc_s1le')}
          </div>`,
        save() {
          const club2 = { ...getSection('club'), nom: val('club_nom'), tagline: val('club_tagline'), description: val('club_description') };
          saveSection('club', club2);
          const tx2 = getSection('textes') || {};
          tx2.accueil = { ...acc, heroEyebrow: val('acc_heroEyebrow'), heroTitre:[val('acc_heroL1'),val('acc_heroL2')], s1Eyebrow:val('acc_s1ey'), s1Titre:val('acc_s1ti'), s1Lede:val('acc_s1le') };
          saveSection('textes', tx2);
        }
      };
    },

    /* ===== ENCADREMENT ===== */
    encadrement() {
      let coaches = (getSection('coaches') || []).map((c,i) => ({...c, _i:i}));
      let ceintures = (getSection('ceintures_noires') || []).map((c,i) => ({...c, _i:i}));

      function coachCard(c, prefix) {
        const p = prefix + c._i + '_';
        return `<div class="sab-card" id="cc_${prefix}${c._i}">
          <div class="sab-card-header">
            <span class="sab-card-name">${esc2(c.name||'Nouveau')}</span>
            <div class="sab-card-actions">
              <button class="sab-btn sab-btn-del" data-del="${prefix}" data-i="${c._i}">Supprimer</button>
            </div>
          </div>
          ${field('Nom','text',c.name,p+'name')}
          ${field('Grade','text',c.grade,p+'grade')}
          ${field('Rôle','text',c.role,p+'role')}
          ${field('Dojo','text',c.dojo,p+'dojo')}
          ${field('Biographie','textarea',c.bio,p+'bio')}
          ${field('Photo (chemin: img/...)','text',c.photo,p+'photo')}
        </div>`;
      }

      return {
        title: "Édition — Encadrement",
        html: `
          <div class="sab-section"><div class="sab-section-title">Coachs & encadrement</div>
            <div id="coachCards">${coaches.map(c => coachCard(c,'co')).join('')}</div>
            <button class="sab-btn sab-btn-add" id="addCoach">+ Ajouter un coach</button>
          </div>
          <div class="sab-section"><div class="sab-section-title">Ceintures noires & marrons</div>
            <div id="cnCards">${ceintures.map(c => coachCard(c,'cn')).join('')}</div>
            <button class="sab-btn sab-btn-add" id="addCN">+ Ajouter une personne</button>
          </div>`,
        afterRender() {
          // Supprimer coach
          document.getElementById('sadBody').addEventListener('click', e => {
            const del = e.target.closest('[data-del]');
            if (!del) return;
            const prefix = del.dataset.del, i = +del.dataset.i;
            if (prefix === 'co') { coaches = coaches.filter(c => c._i !== i); rebuildCards('coachCards', coaches, 'co', coachCard); }
            else { ceintures = ceintures.filter(c => c._i !== i); rebuildCards('cnCards', ceintures, 'cn', coachCard); }
          });
          // Ajouter coach
          document.getElementById('addCoach').addEventListener('click', () => {
            const ni = coaches.length ? coaches[coaches.length-1]._i + 1 : 0;
            coaches.push({name:'',grade:'',role:'',dojo:'',bio:'',photo:'',initials:'',_i:ni});
            rebuildCards('coachCards', coaches, 'co', coachCard);
          });
          document.getElementById('addCN').addEventListener('click', () => {
            const ni = ceintures.length ? ceintures[ceintures.length-1]._i + 1 : 0;
            ceintures.push({name:'',grade:'',dojo:'',photo:'',initials:'',_i:ni});
            rebuildCards('cnCards', ceintures, 'cn', coachCard);
          });
        },
        save() {
          const saved = coaches.map(c => {
            const p = 'co' + c._i + '_';
            return { name:val(p+'name'), grade:val(p+'grade'), role:val(p+'role'), dojo:val(p+'dojo'), bio:val(p+'bio'), photo:val(p+'photo'), initials:(val(p+'name')||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() };
          });
          saveSection('coaches', saved);
          const savedCN = ceintures.map(c => {
            const p = 'cn' + c._i + '_';
            return { name:val(p+'name'), grade:val(p+'grade'), dojo:val(p+'dojo'), photo:val(p+'photo'), initials:(val(p+'name')||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() };
          });
          saveSection('ceintures_noires', savedCN);
        }
      };
    },

    /* ===== DOJOS ===== */
    dojos() {
      let dojos = (getSection('dojos') || []).map((d,i) => ({...d,_i:i}));
      function dojoCard(d) {
        const p = 'dj' + d._i + '_';
        const n = esc2(d.name||'Dojo');
        return `<div class="sab-card" id="dc_${d._i}">
          <div class="sab-card-header">
            <span class="sab-card-name">${n}</span>
            <div class="sab-card-actions">
              <button class="sab-btn sab-btn-del" data-del="dj" data-i="${d._i}">Supprimer</button>
            </div>
          </div>
          <div class="sab-section-title" style="font-size:.6rem;margin:.4rem 0 .6rem;">Informations</div>
          ${field('Nom','text',d.name,p+'name')}
          ${field('Adresse','text',d.address,p+'address')}
          ${field('Téléphone','text',d.phone,p+'phone')}
          ${field('Accès','text',d.acces,p+'acces')}
          ${field('Instructeur référent','text',d.instructeur,p+'instructeur')}
          ${field('Lien Maps (URL)','text',d.mapLink,p+'mapLink')}
          ${field('Embed Maps (iframe src)','textarea',d.mapEmbed,p+'mapEmbed')}
          <div class="sab-section-title" style="font-size:.6rem;margin:.8rem 0 .6rem;">Le Bureau</div>
          ${field('Président','text',d.president,p+'president')}
          ${field('Tél Président','text',d.presidentPhone,p+'presidentPhone')}
          ${field('Email Président','text',d.presidentEmail,p+'presidentEmail')}
          ${field('Trésorier','text',d.tresorier,p+'tresorier')}
          ${field('Tél Trésorier','text',d.tresorierPhone,p+'tresorierPhone')}
          ${field('Email Trésorier','text',d.tresorierEmail,p+'tresorierEmail')}
          ${field('Secrétaire','text',d.secretaire,p+'secretaire')}
          ${field('Tél Secrétaire','text',d.secretairePhone,p+'secretairePhone')}
          ${field('Email Secrétaire','text',d.secretaireEmail,p+'secretaireEmail')}
        </div>`;
      }
      return {
        title: 'Édition — Les Dojos',
        html: `<div id="dojoCards">${dojos.map(d=>dojoCard(d)).join('')}</div>
               <button class="sab-btn sab-btn-add" id="addDojo">+ Ajouter un dojo</button>`,
        afterRender() {
          document.getElementById('sadBody').addEventListener('click', e => {
            const del = e.target.closest('[data-del="dj"]');
            if (!del) return;
            dojos = dojos.filter(d => d._i !== +del.dataset.i);
            rebuildCards('dojoCards', dojos, 'dj', dojoCard);
          });
          document.getElementById('addDojo').addEventListener('click', () => {
            const ni = dojos.length ? dojos[dojos.length-1]._i+1 : 0;
            dojos.push({name:'',address:'',phone:'',acces:'',instructeur:'',mapLink:'',mapEmbed:'',president:'',presidentPhone:'',presidentEmail:'',tresorier:'',tresorierPhone:'',tresorierEmail:'',secretaire:'',secretairePhone:'',secretaireEmail:'',_i:ni});
            rebuildCards('dojoCards', dojos, 'dj', dojoCard);
          });
        },
        save() {
          const saved = dojos.map(d => {
            const p = 'dj'+d._i+'_';
            return { name:val(p+'name'), address:val(p+'address'), phone:val(p+'phone'), acces:val(p+'acces'), instructeur:val(p+'instructeur'), mapLink:val(p+'mapLink'), mapEmbed:val(p+'mapEmbed'), president:val(p+'president'), presidentPhone:val(p+'presidentPhone'), presidentEmail:val(p+'presidentEmail'), tresorier:val(p+'tresorier'), tresorierPhone:val(p+'tresorierPhone'), tresorierEmail:val(p+'tresorierEmail'), secretaire:val(p+'secretaire'), secretairePhone:val(p+'secretairePhone'), secretaireEmail:val(p+'secretaireEmail') };
          });
          saveSection('dojos', saved);
        }
      };
    },

    /* ===== ACTUALITÉS ===== */
    actus() {
      let actus = (getSection('actus') || []).map((a,i) => ({...a,_i:i}));
      function actusCard(a) {
        const p = 'ac'+a._i+'_';
        return `<div class="sab-card">
          <div class="sab-card-header">
            <span class="sab-card-name">${esc2(a.title||'Actualité')}</span>
            <div class="sab-card-actions">
              <button class="sab-btn sab-btn-del" data-del="ac" data-i="${a._i}">Supprimer</button>
            </div>
          </div>
          ${field('Titre','text',a.title,p+'title')}
          ${field('Tag (ex: Compétition, Stage…)','text',a.tag,p+'tag')}
          ${field('Date','text',a.date,p+'date')}
          ${field('Texte','textarea',a.text,p+'text')}
          ${field('Lien (URL)','text',a.lien,p+'lien')}
          ${field('Image (chemin: img/...)','text',a.image,p+'image')}
        </div>`;
      }
      return {
        title: 'Édition — Actualités',
        html: `<div id="actusCards">${actus.map(a=>actusCard(a)).join('')}</div>
               <button class="sab-btn sab-btn-add" id="addActu">+ Ajouter une actualité</button>`,
        afterRender() {
          document.getElementById('sadBody').addEventListener('click', e => {
            const del = e.target.closest('[data-del="ac"]');
            if (!del) return;
            actus = actus.filter(a => a._i !== +del.dataset.i);
            rebuildCards('actusCards', actus, 'ac', actusCard);
          });
          document.getElementById('addActu').addEventListener('click', () => {
            const ni = actus.length ? actus[actus.length-1]._i+1 : 0;
            actus.push({title:'',tag:'',date:'',text:'',lien:'',image:'',type:'actu',id:Date.now(),_i:ni});
            rebuildCards('actusCards', actus, 'ac', actusCard);
          });
        },
        save() {
          const saved = actus.map(a => {
            const p='ac'+a._i+'_';
            return { ...a, title:val(p+'title'), tag:val(p+'tag'), date:val(p+'date'), text:val(p+'text'), lien:val(p+'lien'), image:val(p+'image') };
          });
          saveSection('actus', saved);
        }
      };
    },

    /* ===== CONTACT ===== */
    contact() {
      const club = getSection('club') || {};
      return {
        title: 'Édition — Contact',
        html: `<div class="sab-section"><div class="sab-section-title">Coordonnées</div>
          ${field('Email de contact','text',club.email,'cl_email')}
          ${field('Téléphone','text',club.phone,'cl_phone')}
          ${field('Adresse du siège','textarea',club.adresse,'cl_adresse')}
        </div>`,
        save() {
          saveSection('club', { ...getSection('club'), email:val('cl_email'), phone:val('cl_phone'), adresse:val('cl_adresse') });
        }
      };
    },

    /* ===== INSCRIPTION ===== */
    inscription() {
      const ins = getSection('inscription') || {};
      return {
        title: 'Édition — Inscription',
        html: `<div class="sab-section"><div class="sab-section-title">Tarifs & infos</div>
          ${field('Titre section','text',ins.titre,'ins_titre')}
          ${field('Texte intro','textarea',ins.intro,'ins_intro')}
        </div>`,
        save() {
          saveSection('inscription', { ...getSection('inscription'), titre:val('ins_titre'), intro:val('ins_intro') });
        }
      };
    }
  };

  /* ── Rebuild helper ── */
  function rebuildCards(containerId, arr, prefix, cardFn) {
    const c = document.getElementById(containerId);
    if (c) c.innerHTML = arr.map(item => cardFn(item)).join('');
  }

  /* ── Ouvrir le tiroir ── */
  function openDrawer() {
    const builder = builders[pageKey];
    if (!builder) {
      alert('Pas d\'éditeur configuré pour cette page.');
      return;
    }
    const config = builder();
    document.getElementById('sadTitle').textContent = config.title;
    document.getElementById('sadBody').innerHTML = config.html;
    document.getElementById('sadOk').style.display = 'none';
    if (config.afterRender) config.afterRender();
    drawer.classList.add('open');

    // Bouton save du tiroir
    document.getElementById('sadSave').onclick = () => {
      config.save();
      const ok = document.getElementById('sadOk');
      ok.style.display = 'block';
      setTimeout(() => { ok.style.display = 'none'; }, 2500);
      // Recharger la page après 1.5s pour voir les changements
      setTimeout(() => window.location.reload(), 1500);
    };
  }

  document.getElementById('sabEdit').addEventListener('click', openDrawer);
  document.getElementById('sadClose').addEventListener('click', () => drawer.classList.remove('open'));
  document.getElementById('sadCancel').addEventListener('click', () => drawer.classList.remove('open'));
  document.getElementById('sabExit').addEventListener('click', () => {
    try { sessionStorage.removeItem('shindokai_admin'); } catch(e) {}
    window.location.reload();
  });
}
