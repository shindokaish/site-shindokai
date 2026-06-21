/* ============================================================
   SHINDOKAI-KAN I-S-L — Données & localStorage
   ============================================================ */

const STORAGE_KEY = 'shindokai_data';

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
    {
      initials: "DA", photo: "",
      name: "David",
      grade: "5e Dan Shindokai · 5e Dan FFK",
      role: "Instructeur Fédéral",
      bio: "Diplômé Instructeur Fédéral FFK. Référence technique de l'association, garant de la transmission des valeurs et de l'enseignement du Shindokai.",
      dojo: ""
    },
    {
      initials: "MO", photo: "",
      name: "Morgan",
      grade: "3e Dan Shindokai · 2e Dan FFK",
      role: "Animateur Fédéral",
      bio: "Diplômé Animateur Fédéral FFK. Encadre les cours avec rigueur et pédagogie, alliant maîtrise technique et esprit combatif.",
      dojo: ""
    },
    {
      initials: "JU", photo: "",
      name: "Julien",
      grade: "2e Dan Shindokai · 2e Dan FFK",
      role: "Animateur Fédéral",
      bio: "Diplômé Animateur Fédéral FFK. Accompagne les pratiquants de tous niveaux dans leur progression et leur préparation aux passages de grade.",
      dojo: ""
    }
  ],
  courses: [
    { age: "4-6 ans",       name: "Mini Karaté", level: "Découverte · motricité, jeux",   days: "Mercredi",           time: "17h00 – 17h45", belt: "#f3efe7" },
    { age: "7-11 ans",      name: "Enfants",      level: "Technique · passage de grades",  days: "Mardi / Jeudi",      time: "17h45 – 18h45", belt: "#e0241b" },
    { age: "12-15 ans",     name: "Ados",         level: "Technique · kumite",             days: "Lundi / Vendredi",   time: "18h45 – 20h00", belt: "#c9a227" },
    { age: "16 ans et +",   name: "Adultes",      level: "Tous niveaux",                   days: "Lun. / Mer. / Ven.", time: "20h00 – 21h30", belt: "#16161a" },
    { age: "Sur sélection", name: "Compétition",  level: "Entraînement spécifique",        days: "Samedi",             time: "10h00 – 12h00", belt: "#9a98a0" }
  ],
  dojos: [
    {
      name: "Dojo Santes",
      logo: "logo_edit_597009898409420.jpg",
      address: "Salle Laurent PREVOST, Rue du Général Koenig, 59211 Santes",
      phone: "XX XX XX XX XX",
      horaires: "À renseigner",
      acces: "À renseigner",
      mapEmbed: "",
      mapLink: "https://maps.google.com/?q=Salle+Laurent+PREVOST+59211+Santes"
    },
    {
      name: "Dojo 2", logo: "", address: "À renseigner",
      phone: "", horaires: "À renseigner", acces: "",
      mapEmbed: "", mapLink: ""
    },
    {
      name: "Dojo 3", logo: "", address: "À renseigner",
      phone: "", horaires: "À renseigner", acces: "",
      mapEmbed: "", mapLink: ""
    }
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

  /* ============ ESPACE MEMBRES ============ */
  membres: {
    password: "dojo2025",
    jeux: { quiz: true, flashcards: true, memory: true },
    ceintures: [
      { couleur: "Blanche",  hex: "#f3efe7", rang: 1, description: "Le début du chemin. L'esprit est vide, prêt à apprendre.", kanji: "白" },
      { couleur: "Jaune",    hex: "#f5d020", rang: 2, description: "Les premiers rayons de soleil sur la neige. La connaissance commence à poindre.", kanji: "黄" },
      { couleur: "Orange",   hex: "#f0780a", rang: 3, description: "Le soleil se lève. La technique se consolide.", kanji: "橙" },
      { couleur: "Verte",    hex: "#2d8a4e", rang: 4, description: "La plante pousse. Le pratiquant s'épanouit.", kanji: "緑" },
      { couleur: "Bleue",    hex: "#1a5fa8", rang: 5, description: "Le ciel et l'eau. La technique devient fluide.", kanji: "青" },
      { couleur: "Marron",   hex: "#7b4f2e", rang: 6, description: "La terre nourricière. La maturité approche.", kanji: "茶" },
      { couleur: "Noire",    hex: "#1a1a1a", rang: 7, description: "Toutes les couleurs réunies. Le début de la vraie maîtrise.", kanji: "黒" }
    ],
    vocabulaire: [
      { japonais: "OSS",        français: "Respect / Salut",             contexte: "Salutation universelle dans les arts martiaux. Marque le respect envers le sensei et les partenaires." },
      { japonais: "DOJO",       français: "Lieu d'entraînement",         contexte: "Littéralement 'lieu de la voie'. L'endroit sacré où l'on s'entraîne." },
      { japonais: "SENSEI",     français: "Professeur / Instructeur",    contexte: "Celui qui est né avant — qui a de l'expérience à transmettre." },
      { japonais: "KARATE",     français: "Voie de la main vide",        contexte: "Art martial japonais. KARA = vide, TE = main." },
      { japonais: "SHINDOKAI",  français: "Voie de la vérité",           contexte: "Notre discipline. SHIN = vérité, DO = voie, KAI = association." },
      { japonais: "KUMITE",     français: "Combat / Assaut",             contexte: "Entraînement avec un partenaire. Échange de techniques." },
      { japonais: "KATA",       français: "Forme / Enchaînement",        contexte: "Séquence de techniques codifiées pratiquée seul." },
      { japonais: "OBI",        français: "Ceinture",                    contexte: "La ceinture qui tient le kimono. Symbole du grade." },
      { japonais: "KARATEGI",   français: "Tenue de karaté",             contexte: "La tenue blanche traditionnelle du pratiquant." },
      { japonais: "SEMPAI",     français: "Élève senior",                contexte: "Pratiquant plus expérimenté. À respecter et dont on peut apprendre." },
      { japonais: "KOHAI",      français: "Élève junior",                contexte: "Pratiquant moins expérimenté. À guider et encourager." },
      { japonais: "KAMAE",      français: "Garde / Position de combat",  contexte: "La posture de combat, prête à attaquer ou défendre." },
      { japonais: "TSUKI",      français: "Coup de poing",               contexte: "Technique de frappe avec le poing." },
      { japonais: "GERI",       français: "Coup de pied",                contexte: "Technique de frappe avec le pied." },
      { japonais: "UKE",        français: "Blocage / Parade",            contexte: "Technique défensive pour bloquer une attaque." },
      { japonais: "HAJIME",     français: "Commencez !",                 contexte: "Ordre du arbitre ou du sensei pour démarrer." },
      { japonais: "YAME",       français: "Stop / Arrêtez !",            contexte: "Ordre d'arrêter immédiatement le combat ou l'exercice." },
      { japonais: "IPPON",      français: "Point complet",               contexte: "Technique parfaitement exécutée valant un point plein." },
      { japonais: "WAZA",       français: "Technique",                   contexte: "Désigne toute technique de karaté." },
      { japonais: "DAN",        français: "Grade (ceinture noire)",      contexte: "Les degrés de la ceinture noire. 1er dan à 10e dan." },
      { japonais: "KYU",        français: "Grade (avant ceinture noire)", contexte: "Les grades des ceintures de couleur. On commence au plus haut kyu." },
      { japonais: "MOKUSO",     français: "Méditation",                  contexte: "Moment de recueillement en début et fin de cours, les yeux fermés." },
      { japonais: "REI",        français: "Salut",                       contexte: "Geste de respect : on s'incline pour saluer." },
      { japonais: "ZANSHIN",    français: "Esprit d'alerte",             contexte: "État de conscience et vigilance après une technique." }
    ],
    quiz: [
      { question: "Quelle est la première ceinture en Shindokai ?", reponses: ["Blanche", "Jaune", "Orange", "Verte"], correct: 0, categorie: "Ceintures", difficulte: 1 },
      { question: "Combien y a-t-il de ceintures de couleur avant la noire ?", reponses: ["4", "5", "6", "7"], correct: 2, categorie: "Ceintures", difficulte: 1 },
      { question: "Quelle ceinture vient après la verte ?", reponses: ["Marron", "Bleue", "Orange", "Noire"], correct: 1, categorie: "Ceintures", difficulte: 2 },
      { question: "Que symbolise la ceinture noire ?", reponses: ["La fin de l'apprentissage", "Le début de la vraie maîtrise", "Le grade le plus élevé", "La retraite du pratiquant"], correct: 1, categorie: "Ceintures", difficulte: 2 },
      { question: "Dans le Shindokai, les coups au visage sont-ils autorisés ?", reponses: ["Oui, tous", "Non, jamais", "Seulement les coups de pied", "Oui, avec protection"], correct: 1, categorie: "Règles", difficulte: 1 },
      { question: "Le Shindokai est créé par qui ?", reponses: ["Mas Oyama", "Bruce Lee", "Gilles Richard", "Jigoro Kano"], correct: 2, categorie: "Histoire", difficulte: 1 },
      { question: "En quelle année le Shindokai a-t-il été créé ?", reponses: ["1998", "2001", "2006", "2010"], correct: 2, categorie: "Histoire", difficulte: 2 },
      { question: "De quelle discipline le Shindokai tire-t-il ses racines ?", reponses: ["Judo", "Kyokushinkai", "Shotokan", "Taekwondo"], correct: 1, categorie: "Histoire", difficulte: 2 },
      { question: "Que signifie SHINDOKAI ?", reponses: ["Voie du guerrier", "Voie de la main vide", "Voie de la vérité", "Voie du combat"], correct: 2, categorie: "Vocabulaire", difficulte: 1 },
      { question: "Le Shindokai est officiellement reconnu comme :", reponses: ["Sport de contact", "Karaté-Jutsu", "Arts martiaux mixtes", "Sport de self-défense"], correct: 1, categorie: "Histoire", difficulte: 2 },
      { question: "Que sont autorisées dans le Shindokai (contrairement au Shotokan) ?", reponses: ["Les armes", "Les coups au visage uniquement", "Les saisies, projections et lutte au sol", "Les protections"], correct: 2, categorie: "Règles", difficulte: 1 },
      { question: "Que veut dire OSS ?", reponses: ["Bonne chance", "Respect et salutation", "Je suis prêt", "C'est terminé"], correct: 1, categorie: "Vocabulaire", difficulte: 1 },
      { question: "Que signifie SENSEI ?", reponses: ["Champion", "Ceinture noire", "Professeur / celui qui est né avant", "Élève avancé"], correct: 2, categorie: "Vocabulaire", difficulte: 1 },
      { question: "Que signifie KUMITE ?", reponses: ["Forme / enchaînement", "Combat avec partenaire", "Méditation", "Salutation"], correct: 1, categorie: "Vocabulaire", difficulte: 2 },
      { question: "Qu'est-ce qu'un KATA ?", reponses: ["Un coup de pied", "Une ceinture", "Un enchaînement de techniques pratiqué seul", "Un arbitre"], correct: 2, categorie: "Vocabulaire", difficulte: 2 },
      { question: "Que signifie HAJIME ?", reponses: ["Arrêtez !", "Commencez !", "Bravo !", "Saluez !"], correct: 1, categorie: "Vocabulaire", difficulte: 1 },
      { question: "YAME signifie :", reponses: ["Continuez", "Frappez", "Stop / Arrêtez", "Saluez"], correct: 2, categorie: "Vocabulaire", difficulte: 1 },
      { question: "Le ZANSHIN c'est :", reponses: ["Un coup de poing", "L'état de vigilance après une technique", "La tenue de karaté", "Un salut"], correct: 1, categorie: "Vocabulaire", difficulte: 3 },
      { question: "Que signifie MOKUSO ?", reponses: ["Combat", "Méditation / recueillement", "Technique de pied", "Grade"], correct: 1, categorie: "Vocabulaire", difficulte: 2 },
      { question: "Quelles sont les 3 valeurs fondamentales du Shindokai ?", reponses: ["Force, Vitesse, Puissance", "Respect, Honneur, Discipline", "Courage, Loyauté, Humilité", "Technique, Endurance, Volonté"], correct: 1, categorie: "Histoire", difficulte: 1 }
    ]
  },

  /* ============ FORMULAIRE D'INSCRIPTION ============ */
  inscription: {
    /* Titre et texte d'intro affichés en haut du formulaire */
    titre: "Demande d'inscription",
    intro: "Remplissez ce formulaire pour vous inscrire ou inscrire votre enfant au Shindokai-Kan I-S-L. Un responsable vous contactera sous 48h pour confirmer votre inscription et vous communiquer les documents à fournir (certificat médical, photo d'identité).",

    /* Envoi des inscriptions par email (Formspree) — laisser vide pour mailto */
    formspreeId: "",

    /* Champs du formulaire — vous pouvez activer/désactiver, rendre obligatoire,
       changer le label, ou ajouter des champs personnalisés depuis l'admin */
    fields: [
      /* ── Identité ── */
      { id:"nom",           label:"Nom",                    type:"text",     required:true,  enabled:true,  group:"Identité",         placeholder:"Nom de famille" },
      { id:"prenom",        label:"Prénom",                 type:"text",     required:true,  enabled:true,  group:"Identité",         placeholder:"Prénom" },
      { id:"dob",           label:"Date de naissance",      type:"date",     required:true,  enabled:true,  group:"Identité",         placeholder:"" },
      { id:"genre",         label:"Genre",                  type:"select",   required:false, enabled:true,  group:"Identité",         options:["Homme","Femme","Autre"] },
      /* ── Contact ── */
      { id:"email",         label:"Email",                  type:"email",    required:true,  enabled:true,  group:"Contact",          placeholder:"votre@email.fr" },
      { id:"phone",         label:"Téléphone",              type:"tel",      required:true,  enabled:true,  group:"Contact",          placeholder:"06 XX XX XX XX" },
      { id:"adresse",       label:"Adresse postale",        type:"textarea", required:false, enabled:true,  group:"Contact",          placeholder:"Rue, code postal, ville" },
      /* ── Pratique ── */
      { id:"dojo",          label:"Dojo souhaité",          type:"select-dojos",  required:true,  enabled:true,  group:"Pratique",    options:[] },
      { id:"cours",         label:"Cours souhaité",         type:"select-cours",  required:true,  enabled:true,  group:"Pratique",    options:[] },
      { id:"formule",       label:"Formule d'adhésion",     type:"select-tarifs", required:true,  enabled:true,  group:"Pratique",    options:[] },
      { id:"niveau",        label:"Niveau actuel",          type:"select",   required:false, enabled:true,  group:"Pratique",         options:["Débutant / Aucune ceinture","Ceinture blanche","Ceinture jaune","Ceinture orange","Ceinture verte","Ceinture bleue","Ceinture marron","Ceinture noire"] },
      { id:"experience",    label:"Expérience en arts martiaux", type:"textarea", required:false, enabled:false, group:"Pratique",   placeholder:"Précisez si vous avez pratiqué d'autres disciplines..." },
      /* ── Contact d'urgence ── */
      { id:"urg_nom",       label:"Contact urgence — Nom",  type:"text",     required:false, enabled:true,  group:"Urgence",          placeholder:"Nom Prénom" },
      { id:"urg_tel",       label:"Contact urgence — Tél.", type:"tel",      required:false, enabled:true,  group:"Urgence",          placeholder:"06 XX XX XX XX" },
      { id:"urg_lien",      label:"Lien avec le pratiquant",type:"text",     required:false, enabled:false, group:"Urgence",          placeholder:"Ex: Père, Mère, Conjoint..." },
      /* ── Santé ── */
      { id:"sante",         label:"Informations médicales", type:"textarea", required:false, enabled:false, group:"Santé",            placeholder:"Allergies, traitements, contre-indications..." },
      /* ── Autorisations ── */
      { id:"certificat",    label:"Je fournirai un certificat médical d'aptitude à la pratique du karaté contact", type:"checkbox", required:true,  enabled:true,  group:"Autorisations" },
      { id:"autorisation",  label:"Autorisation parentale accordée (obligatoire pour les mineurs)", type:"checkbox", required:false, enabled:true,  group:"Autorisations" },
      { id:"photo",         label:"J'autorise l'utilisation de photos/vidéos à des fins associatives", type:"checkbox", required:false, enabled:true,  group:"Autorisations" },
      { id:"rgpd",          label:"J'accepte que mes données soient traitées dans le cadre de mon inscription au club", type:"checkbox", required:true, enabled:true, group:"Autorisations" }
    ],

    /* Inscriptions reçues — stockées localement */
    submissions: []
  }
};

/* ============ API ============ */
function getData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { console.warn('Impossible de sauvegarder dans localStorage', e); }
}

function getSection(key) {
  return getData()[key];
}

function saveSection(key, value) {
  const data = getData();
  data[key] = value;
  saveData(data);
}

function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
