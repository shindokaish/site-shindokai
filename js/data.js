/* ============================================================
   SHINDOKAI-KAN I-S-L — Données (Supabase + fallback local)
   ============================================================ */

const SUPABASE_URL = 'https://jcfltkuobbjqicczpsjn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_15BDd64WYwMfW8VV9ZXDqg_Oa2ySvKc';

/* ============ DONNÉES PAR DÉFAUT ============ */
const DEFAULT_DATA = {
  club: {
    name: "Shindokai-Kan I-S-L",
    shortName: "SHINDOKAI NORD",
    email: "contact@shindokai-kan-isl.fr",
    phone: "XX XX XX XX XX",
    facebook: "#",
    instagram: "#",
    founded: 2006,
    formspreeId: "",
    heroTitle: ["Respect.", "Honneur.", "Discipline."],
    heroSub: "Le triathlon des arts martiaux — Karaté contact, boxe et soumission au sol. Officiellement reconnu comme Karaté-Jutsu au sein de la FFKDA.",
    aboutP1: "Le Shindokai est une discipline de karaté contact créée en 2006 par Gilles Richard, septième dan fédéral. Il puise ses racines dans le Kyokushinkai et se distingue par sa richesse technique, incorporant le karaté traditionnel, la boxe, ainsi que des éléments de soumission au sol.",
    aboutP2: "Cette approche holistique fait du Shindokai un véritable « triathlon des arts martiaux », offrant aux pratiquants une formation complète et diversifiée. Contrairement au Shotokan où les coups sont arrêtés, dans le Shindokai les coups sont portés (sauf au visage). Les saisies, projections, clés, étranglements et lutte au sol sont autorisés.",
    aboutP3: "L'éthique du Shindokai, cœur de sa philosophie, repose sur les valeurs fondamentales du karaté : respect, honneur et discipline. Dans un monde où le combat libre gagne en popularité, le Shindokai se distingue par son attachement à ces principes, offrant une alternative éducative et formative."
  },
  adminPassword: "shindo2025",
  stats: [
    { value: 19, suffix: "", label: "Années d'existence" },
    { value: 3, suffix: "", label: "Dojos actifs" },
    { value: 7, suffix: "e Dan", label: "Fondateur — Gilles Richard" },
    { value: 0, suffix: "+", label: "Licenciés" }
  ],
  coaches: [
    { initials: "DA", photo: "", name: "David", grade: "5e Dan Shindokai · 5e Dan FFK", role: "Instructeur Fédéral", bio: "Diplômé Instructeur Fédéral FFK. Référence technique de l'association, garant de la transmission des valeurs et de l'enseignement du Shindokai.", dojo: "" },
    { initials: "MO", photo: "", name: "Morgan", grade: "3e Dan Shindokai · 2e Dan FFK", role: "Animateur Fédéral", bio: "Diplômé Animateur Fédéral FFK. Encadre les cours avec rigueur et pédagogie, alliant maîtrise technique et esprit combatif.", dojo: "" },
    { initials: "JU", photo: "", name: "Julien", grade: "2e Dan Shindokai · 2e Dan FFK", role: "Animateur Fédéral", bio: "Diplômé Animateur Fédéral FFK. Accompagne les pratiquants de tous niveaux dans leur progression.", dojo: "" }
  ],
  courses: [
    { age: "4-6 ans",       name: "Mini Karaté",  level: "Découverte · motricité, jeux",   days: "Mercredi",           time: "17h00 – 17h45", belt: "#f3efe7" },
    { age: "7-11 ans",      name: "Enfants",       level: "Technique · passage de grades",  days: "Mardi / Jeudi",      time: "17h45 – 18h45", belt: "#e0241b" },
    { age: "12-15 ans",     name: "Ados",          level: "Technique · kumite",             days: "Lundi / Vendredi",   time: "18h45 – 20h00", belt: "#c9a227" },
    { age: "16 ans et +",   name: "Adultes",       level: "Tous niveaux",                   days: "Lun. / Mer. / Ven.", time: "20h00 – 21h30", belt: "#16161a" },
    { age: "Sur sélection", name: "Compétition",   level: "Entraînement spécifique",        days: "Samedi",             time: "10h00 – 12h00", belt: "#9a98a0" }
  ],
  dojos: [
    { name: "Dojo Santes", logo: "logo_edit_597009898409420.jpg", address: "Salle Laurent PREVOST, Rue du Général Koenig, 59211 Santes", phone: "XX XX XX XX XX", horaires: "À renseigner", acces: "À renseigner", mapEmbed: "", mapLink: "https://maps.google.com/?q=Salle+Laurent+PREVOST+59211+Santes" },
    { name: "Dojo 2", logo: "", address: "À renseigner", phone: "", horaires: "À renseigner", acces: "", mapEmbed: "", mapLink: "" },
    { name: "Dojo 3", logo: "", address: "À renseigner", phone: "", horaires: "À renseigner", acces: "", mapEmbed: "", mapLink: "" }
  ],
  actus: [
    { id: 1, type: "gold", tag: "Compétition", date: "Juin 2025", title: "Résultats du championnat régional", text: "Nos pratiquants ont brillé lors du championnat régional. Félicitations à tous les participants pour leur engagement et leur fair-play.", image: "", lien: "" },
    { id: 2, type: "actu", tag: "Stage",       date: "Mai 2025",  title: "Stage de printemps — inscriptions ouvertes", text: "Un stage exceptionnel animé par nos instructeurs fédéraux. Ouvert à tous les niveaux, dès la ceinture blanche. Places limitées.", image: "", lien: "" },
    { id: 3, type: "dark", tag: "Grades",      date: "Avril 2025", title: "Passage de grades — prochaine session", text: "La prochaine session de passage de grades aura lieu prochainement. Renseignez-vous auprès de votre coach.", image: "", lien: "" }
  ],
  galerie: [],
  tarifs: [
    { name: "Enfants",        price: "180€", period: "/an", featured: false, features: ["Licence FFKDA incluse", "2 cours / semaine", "Passages de grade", "Stage vacances offert"] },
    { name: "Ados / Adultes", price: "220€", period: "/an", featured: true,  features: ["Licence FFKDA incluse", "Cours illimités", "Accès stages self-défense", "Suivi compétition possible"] },
    { name: "Famille",        price: "380€", period: "/an", featured: false, features: ["2 licences incluses", "Cours illimités", "Tarif préférentiel 3e licence", "Événements famille"] }
  ],
  disciplineBadges: ["Karaté contact", "Boxe", "Soumission au sol", "Projections & clés", "Karaté-Jutsu FFKDA", "Dès 6 ans"],
  membres: {
    password: "dojo2025",
    jeux: { quiz: true, flashcards: true, memory: true },
    ceintures: [
      { couleur: "Blanche", hex: "#f3efe7", rang: 1, description: "Le début du chemin. L'esprit est vide, prêt à apprendre.", kanji: "白" },
      { couleur: "Jaune",   hex: "#f5d020", rang: 2, description: "Les premiers rayons de soleil sur la neige. La connaissance commence à poindre.", kanji: "黄" },
      { couleur: "Orange",  hex: "#f0780a", rang: 3, description: "Le soleil se lève. La technique se consolide.", kanji: "橙" },
      { couleur: "Verte",   hex: "#2d8a4e", rang: 4, description: "La plante pousse. Le pratiquant s'épanouit.", kanji: "緑" },
      { couleur: "Bleue",   hex: "#1a5fa8", rang: 5, description: "Le ciel et l'eau. La technique devient fluide.", kanji: "青" },
      { couleur: "Marron",  hex: "#7b4f2e", rang: 6, description: "La terre nourricière. La maturité approche.", kanji: "茶" },
      { couleur: "Noire",   hex: "#1a1a1a", rang: 7, description: "Toutes les couleurs réunies. Le début de la vraie maîtrise.", kanji: "黒" }
    ],
    vocabulaire: [
      { japonais: "OSS",       français: "Respect / Salut",            contexte: "Salutation universelle dans les arts martiaux." },
      { japonais: "DOJO",      français: "Lieu d'entraînement",        contexte: "Littéralement 'lieu de la voie'." },
      { japonais: "SENSEI",    français: "Professeur / Instructeur",   contexte: "Celui qui est né avant — qui a de l'expérience à transmettre." },
      { japonais: "KARATE",    français: "Voie de la main vide",       contexte: "Art martial japonais. KARA = vide, TE = main." },
      { japonais: "SHINDOKAI", français: "Voie de la vérité",          contexte: "Notre discipline. SHIN = vérité, DO = voie, KAI = association." },
      { japonais: "KUMITE",    français: "Combat / Assaut",            contexte: "Entraînement avec un partenaire." },
      { japonais: "KATA",      français: "Forme / Enchaînement",       contexte: "Séquence de techniques codifiées pratiquée seul." },
      { japonais: "OBI",       français: "Ceinture",                   contexte: "La ceinture qui tient le kimono. Symbole du grade." },
      { japonais: "KARATEGI",  français: "Tenue de karaté",            contexte: "La tenue blanche traditionnelle du pratiquant." },
      { japonais: "TSUKI",     français: "Coup de poing",              contexte: "Technique de frappe avec le poing." },
      { japonais: "GERI",      français: "Coup de pied",               contexte: "Technique de frappe avec le pied." },
      { japonais: "UKE",       français: "Blocage / Parade",           contexte: "Technique défensive pour bloquer une attaque." },
      { japonais: "HAJIME",    français: "Commencez !",                contexte: "Ordre du arbitre ou du sensei pour démarrer." },
      { japonais: "YAME",      français: "Stop / Arrêtez !",           contexte: "Ordre d'arrêter immédiatement." },
      { japonais: "IPPON",     français: "Point complet",              contexte: "Technique parfaitement exécutée valant un point plein." },
      { japonais: "DAN",       français: "Grade (ceinture noire)",     contexte: "Les degrés de la ceinture noire. 1er dan à 10e dan." },
      { japonais: "KYU",       français: "Grade (avant ceinture noire)", contexte: "Les grades des ceintures de couleur." },
      { japonais: "MOKUSO",    français: "Méditation",                 contexte: "Moment de recueillement en début et fin de cours." },
      { japonais: "REI",       français: "Salut",                      contexte: "Geste de respect : on s'incline pour saluer." },
      { japonais: "ZANSHIN",   français: "Esprit d'alerte",            contexte: "État de conscience et vigilance après une technique." },
      { japonais: "JODAN",     français: "Niveau haut",                contexte: "Zone d'attaque ou de défense haute." },
      { japonais: "CHUDAN",    français: "Niveau moyen",               contexte: "Zone d'attaque ou de défense moyenne." },
      { japonais: "GEDAN",     français: "Niveau bas",                 contexte: "Zone d'attaque ou de défense basse." },
      { japonais: "KIAI",      français: "Cri du combattant",          contexte: "Expiration puissante lors d'une technique." }
    ],
    quiz: [
      { question: "Quelle est la première ceinture en Shindokai ?", reponses: ["Blanche", "Jaune", "Orange", "Verte"], correct: 0, categorie: "Ceintures", difficulte: 1 },
      { question: "Combien y a-t-il de ceintures de couleur avant la noire ?", reponses: ["4", "5", "6", "7"], correct: 2, categorie: "Ceintures", difficulte: 1 },
      { question: "Que signifie SHINDOKAI ?", reponses: ["Voie du guerrier", "Voie de la main vide", "Voie de la vérité", "Voie du combat"], correct: 2, categorie: "Vocabulaire", difficulte: 1 },
      { question: "Qui a créé le Shindokai ?", reponses: ["Mas Oyama", "Bruce Lee", "Gilles Richard", "Jigoro Kano"], correct: 2, categorie: "Histoire", difficulte: 1 },
      { question: "En quelle année le Shindokai a-t-il été créé ?", reponses: ["1998", "2001", "2006", "2010"], correct: 2, categorie: "Histoire", difficulte: 2 },
      { question: "Que signifie OSS ?", reponses: ["Bonne chance", "Respect et salutation", "Je suis prêt", "C'est terminé"], correct: 1, categorie: "Vocabulaire", difficulte: 1 },
      { question: "Que signifie SENSEI ?", reponses: ["Champion", "Ceinture noire", "Professeur", "Élève avancé"], correct: 2, categorie: "Vocabulaire", difficulte: 1 },
      { question: "Que signifie KUMITE ?", reponses: ["Forme codifiée", "Combat avec partenaire", "Méditation", "Salutation"], correct: 1, categorie: "Vocabulaire", difficulte: 1 },
      { question: "Que signifie HAJIME ?", reponses: ["Arrêtez !", "Commencez !", "Bravo !", "Saluez !"], correct: 1, categorie: "Vocabulaire", difficulte: 1 },
      { question: "YAME signifie :", reponses: ["Continuez", "Frappez", "Stop / Arrêtez", "Saluez"], correct: 2, categorie: "Vocabulaire", difficulte: 1 },
      { question: "Quelles sont les 3 valeurs fondamentales du Shindokai ?", reponses: ["Force, Vitesse, Puissance", "Respect, Honneur, Discipline", "Courage, Loyauté, Humilité", "Technique, Endurance, Volonté"], correct: 1, categorie: "Histoire", difficulte: 1 },
      { question: "Dans le Shindokai, les coups au visage sont-ils autorisés ?", reponses: ["Oui, tous", "Non, jamais", "Seulement les coups de pied", "Oui, avec protection"], correct: 1, categorie: "Règles", difficulte: 1 },
      { question: "De quelle discipline le Shindokai tire-t-il ses racines ?", reponses: ["Judo", "Kyokushinkai", "Shotokan", "Taekwondo"], correct: 1, categorie: "Histoire", difficulte: 2 },
      { question: "Que signifie ZANSHIN ?", reponses: ["Un coup de poing", "L'état de vigilance après une technique", "La tenue de karaté", "Un salut"], correct: 1, categorie: "Vocabulaire", difficulte: 3 },
      { question: "Que signifie MOKUSO ?", reponses: ["Combat", "Méditation", "Technique de pied", "Grade"], correct: 1, categorie: "Vocabulaire", difficulte: 2 },
      { question: "Que signifie JODAN ?", reponses: ["Niveau bas", "Niveau moyen", "Niveau haut", "Niveau arrière"], correct: 2, categorie: "Vocabulaire", difficulte: 2 },
      { question: "Que signifie TSUKI ?", reponses: ["Coup de pied", "Blocage", "Coup de poing", "Coup de coude"], correct: 2, categorie: "Vocabulaire", difficulte: 2 },
      { question: "Que signifie GERI ?", reponses: ["Coup de poing", "Coup de pied", "Blocage", "Salut"], correct: 1, categorie: "Vocabulaire", difficulte: 2 },
      { question: "Quelle ceinture vient après la bleue ?", reponses: ["Verte", "Noire", "Marron", "Rouge"], correct: 2, categorie: "Ceintures", difficulte: 2 },
      { question: "Que sont autorisées dans le Shindokai contrairement au Shotokan ?", reponses: ["Les armes", "Les coups au visage", "Les saisies, projections et lutte au sol", "Les protections"], correct: 2, categorie: "Règles", difficulte: 1 }
    ]
  },
  discipline: {
    heroEyebrow: 'La discipline',
    heroTitle: ['Voie de', 'la vérité.'],
    histoireTitre: 'Le Shindokai,\nné en 2006.',
    piliers: [
      { title: 'Karaté contact', text: "Héritage direct du Kyokushinkai — frappes au corps portées, kata techniques, travail des distances et du placement. Les coups sont réels (sauf au visage), forgeant un karaté authentiquement combatif." },
      { title: 'Boxe', text: "Techniques de poing issues de la boxe anglaise et française : jab, direct, crochet, uppercut. Travail de la mobilité, des esquives et du jeu de jambes pour une complémentarité optimale avec le karaté." },
      { title: 'Soumission au sol', text: "Saisies, projections, clés articulaires, étranglements et lutte au sol. Inspiré du judo et du jiu-jitsu brésilien, ce troisième pilier forme des combattants complets et adaptables à toutes les situations." }
    ],
    valeurs: [
      { icon: '🙏', title: 'Respect', text: "Respect de soi, de l'adversaire, des coachs et du dojo. Cette valeur fondamentale s'apprend sur le tatami et s'applique dans toutes les sphères de la vie. Bow in, bow out — chaque séance commence et se termine par un salut." },
      { icon: '⚔️', title: 'Honneur', text: "Combattre avec honnêteté et intégrité, reconnaître les qualités de l'adversaire, accepter la défaite avec dignité et la victoire avec humilité. L'honneur est la boussole du combattant Shindokai." },
      { icon: '🥋', title: 'Discipline', text: "Assiduité aux entraînements, rigueur dans la technique, persévérance face à la difficulté. La discipline forge le caractère bien au-delà des cours, créant des individus solides et résilients." }
    ],
    ctaTitre: 'Rejoignez la discipline.',
    ctaSub: "Premier cours offert, sans engagement. Venez vivre l'expérience Shindokai dans l'un de nos trois dojos."
  },
  settings: {
    web3formsKey: '109f2859-b8c5-49fa-b6e9-4fd2fee3c5ab'
  },
  inscription: {
    titre: "Demande d'inscription",
    intro: "Remplissez ce formulaire pour vous inscrire ou inscrire votre enfant au Shindokai-Kan I-S-L. Un responsable vous contactera sous 48h pour confirmer votre inscription.",
    formspreeId: "",
    fields: [
      { id:"nom",        label:"Nom",               type:"text",     required:true,  enabled:true,  group:"Identité",      placeholder:"Nom de famille" },
      { id:"prenom",     label:"Prénom",             type:"text",     required:true,  enabled:true,  group:"Identité",      placeholder:"Prénom" },
      { id:"dob",        label:"Date de naissance",  type:"date",     required:true,  enabled:true,  group:"Identité",      placeholder:"" },
      { id:"genre",      label:"Genre",              type:"select",   required:false, enabled:true,  group:"Identité",      options:["Homme","Femme","Autre"] },
      { id:"email",      label:"Email",              type:"email",    required:true,  enabled:true,  group:"Contact",       placeholder:"votre@email.fr" },
      { id:"phone",      label:"Téléphone",          type:"tel",      required:true,  enabled:true,  group:"Contact",       placeholder:"06 XX XX XX XX" },
      { id:"adresse",    label:"Adresse postale",    type:"textarea", required:false, enabled:true,  group:"Contact",       placeholder:"Rue, code postal, ville" },
      { id:"dojo",       label:"Dojo souhaité",      type:"select-dojos",  required:true, enabled:true, group:"Pratique",  options:[] },
      { id:"cours",      label:"Cours souhaité",     type:"select-cours",  required:true, enabled:true, group:"Pratique",  options:[] },
      { id:"formule",    label:"Formule d'adhésion", type:"select-tarifs", required:true, enabled:true, group:"Pratique",  options:[] },
      { id:"niveau",     label:"Niveau actuel",      type:"select",   required:false, enabled:true,  group:"Pratique",     options:["Débutant / Aucune ceinture","Ceinture blanche","Ceinture jaune","Ceinture orange","Ceinture verte","Ceinture bleue","Ceinture marron","Ceinture noire"] },
      { id:"urg_nom",    label:"Contact urgence — Nom",  type:"text", required:false, enabled:true,  group:"Urgence",      placeholder:"Nom Prénom" },
      { id:"urg_tel",    label:"Contact urgence — Tél.", type:"tel",  required:false, enabled:true,  group:"Urgence",      placeholder:"06 XX XX XX XX" },
      { id:"certificat", label:"Je fournirai un certificat médical d'aptitude à la pratique du karaté contact", type:"checkbox", required:true, enabled:true, group:"Autorisations" },
      { id:"autorisation", label:"Autorisation parentale accordée (obligatoire pour les mineurs)", type:"checkbox", required:false, enabled:true, group:"Autorisations" },
      { id:"photo",      label:"J'autorise l'utilisation de photos/vidéos à des fins associatives", type:"checkbox", required:false, enabled:true, group:"Autorisations" },
      { id:"rgpd",       label:"J'accepte que mes données soient traitées dans le cadre de mon inscription", type:"checkbox", required:true, enabled:true, group:"Autorisations" }
    ],
    submissions: []
  }
};

/* ============ CACHE LOCAL ============ */
let _cache = JSON.parse(JSON.stringify(DEFAULT_DATA));
let _initialized = false;
let _sb = null;

/* ============ CLIENT SUPABASE ============ */
function getSB() {
  if (!_sb && typeof supabase !== 'undefined') {
    _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return _sb;
}

/* ============ INIT — charge toutes les données depuis Supabase ============ */
async function initData() {
  if (_initialized) return _cache;

  const sb = getSB();
  if (!sb) {
    console.warn('Supabase non disponible — données locales utilisées');
    _initialized = true;
    return _cache;
  }

  try {
    const { data: rows, error } = await sb
      .from('data_store')
      .select('key, value');

    if (error) throw error;

    if (rows && rows.length > 0) {
      /* Fusionner les données Supabase dans le cache */
      const supabaseKeys = new Set();
      rows.forEach(row => {
        _cache[row.key] = row.value;
        supabaseKeys.add(row.key);
      });
      /* Pousser vers Supabase les clés DEFAULT_DATA manquantes (nouvelles clés) */
      const allDefaultKeys = Object.keys(DEFAULT_DATA);
      const missingKeys = allDefaultKeys.filter(k => !supabaseKeys.has(k));
      if (missingKeys.length > 0) {
        const missing = missingKeys.map(k => ({ key: k, value: DEFAULT_DATA[k] }));
        sb.from('data_store').upsert(missing, { onConflict: 'key' }).then(({ error: e }) => {
          if (e) console.warn('Erreur push clés manquantes:', e.message);
          else console.info('Nouvelles clés poussées vers Supabase:', missingKeys.join(', '));
        });
      }
    } else {
      /* Première fois : on pousse toutes les données par défaut vers Supabase */
      await _pushAllDefaults(sb);
    }
  } catch (e) {
    console.error('Erreur Supabase initData :', e.message || e);
    /* Fallback : on reste sur DEFAULT_DATA déjà dans _cache */
  }

  _initialized = true;
  return _cache;
}

/* Pousse toutes les sections par défaut vers Supabase (premier démarrage) */
async function _pushAllDefaults(sb) {
  const keys = ['club','adminPassword','stats','coaches','courses','dojos',
                 'actus','galerie','tarifs','disciplineBadges','discipline','membres','inscription','settings'];
  const rows = keys.map(k => ({ key: k, value: DEFAULT_DATA[k] }));
  await sb.from('data_store').upsert(rows, { onConflict: 'key' });
}

/* ============ API SYNCHRONE (utilise le cache) ============ */
function getData()         { return _cache; }
function getSection(key)   { return _cache[key]; }

/* ============ SAUVEGARDE (cache + Supabase en arrière-plan) ============ */
function saveSection(key, value) {
  _cache[key] = value;
  /* Sauvegarde localStorage en secours */
  try { localStorage.setItem('shindokai_' + key, JSON.stringify(value)); } catch(e) {}
  /* Sauvegarde Supabase */
  const sb = getSB();
  if (sb) {
    sb.from('data_store')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
      .then(({ error }) => { if (error) console.warn('Erreur save Supabase:', error.message); });
  }
}

function saveData(data) {
  _cache = data;
  const keys = Object.keys(data);
  keys.forEach(k => saveSection(k, data[k]));
}

function resetData() {
  _cache = JSON.parse(JSON.stringify(DEFAULT_DATA));
  const sb = getSB();
  if (sb) _pushAllDefaults(sb);
  return _cache;
}
