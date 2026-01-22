// here section data
export type HeroCta = {
  label: string;
  href: string;
};

export type HeroContent = {
  eyebrow: string;
  headline: {
    main: string;
    accent: string;
  };
  description: string;
  cta: {
    primary: HeroCta;
    secondary: HeroCta;
  };
};

export type AboutHeroData = {
  en: HeroContent;
  es: HeroContent;
  el: HeroContent;
};

export const aboutHeroData: AboutHeroData = {
  en: {
    eyebrow: "Close the gap between effort and results",
    headline: {
      main: "It’s Not Just About Eating Right.",
      accent: "It’s About Finally Seeing the Results You’ve Earned.",
    },
    description:
      "There’s a frustrating space between training hard and seeing it in the mirror. I’ve been there. Today, I help lifters and athletes cut through noise with evidence-based nutrition that fits real life—so your work finally shows.",
    cta: {
      primary: {
        label: "Book Your Physique Audit",
        href: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1c7I1zbXzjIZ5QsrgCUxMGp61DBGVpSdZxmT1aj7IsKrDlD4j6no5lNGJuiMKoyfOf9_N-PrKI",
      },
      secondary: {
        label: "Download the Starter Kit",
        href: "/freebies/meal-prep-starter-kit",
      },
    },
  },

  es: {
    eyebrow: "Cierra la brecha entre esfuerzo y resultados",
    headline: {
      main: "No Se Trata Solo de Comer Bien.",
      accent: "Se Trata de Ver, por Fin, los Resultados que Te Has Ganado.",
    },
    description:
      "Hay un espacio frustrante entre entrenar duro y verlo en el espejo. Lo sé porque lo viví. Hoy ayudo a levantadores y deportistas a filtrar el ruido con nutrición basada en evidencia y pensada para la vida real, para que tu esfuerzo se note.",
    cta: {
      primary: {
        label: "Reserva Tu Physique Audit",
        href: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1c7I1zbXzjIZ5QsrgCUxMGp61DBGVpSdZxmT1aj7IsKrDlD4j6no5lNGJuiMKoyfOf9_N-PrKI",
      },
      secondary: {
        label: "Descarga el Starter Kit",
        href: "/freebies/meal-prep-starter-kit",
      },
    },
  },

  el: {
    eyebrow: "Κλείσε το κενό ανάμεσα στην προσπάθεια και στο αποτέλεσμα",
    headline: {
      main: "Δεν Είναι Απλώς Να Τρως «Σωστά».",
      accent: "Είναι Να Δεις Επιτέλους Τα Αποτελέσματα Που Έχεις Κερδίσει.",
    },
    description:
      "Υπάρχει ένα εκνευριστικό κενό ανάμεσα στο «προσπαθώ πολύ» και στο «το βλέπω στον καθρέφτη». Το ξέρω, γιατί το έζησα. Σήμερα βοηθάω lifters και αθλητές να ξεχωρίσουν την ουσία από τον θόρυβο με evidence-based διατροφή που ταιριάζει στην πραγματική ζωή—ώστε η προσπάθειά σου να φαίνεται.",
    cta: {
      primary: {
        label: "Κλείσε Physique Audit",
        href: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1c7I1zbXzjIZ5QsrgCUxMGp61DBGVpSdZxmT1aj7IsKrDlD4j6no5lNGJuiMKoyfOf9_N-PrKI",
      },
      secondary: {
        label: "Κατέβασε το Starter Kit",
        href: "/freebies/meal-prep-starter-kit",
      },
    },
  },
};

// achievements section
export type AchievementIcon = "users" | "calendar" | "target" | "bookOpen";

export type AchievementItem = {
  icon: AchievementIcon;
  value: string; // e.g. "500+"
  label: string; // e.g. "Athletes Coached"
};

export type AchievementsContent = {
  title: string;
  subtitle?: string;
  items: AchievementItem[];
};

export type AboutAchievementsData = {
  en: AchievementsContent;
  es: AchievementsContent;
  el: AchievementsContent;
};

export const aboutAchievementsData: AboutAchievementsData = {
  en: {
    title: "Proof You Can Measure",
    subtitle:
      "Experience, outcomes, and a method built on evidence—not trends or hype.",
    items: [
      {
        icon: "calendar",
        value: "10+",
        label: "Years Experience",
      },
      {
        icon: "users",
        value: "500+",
        label: "Clients Supported",
      },
      {
        icon: "target",
        value: "1:1",
        label: "High-Touch Coaching",
      },
      {
        icon: "bookOpen",
        value: "MSc",
        label: "Evidence-Based Training",
      },
    ],
  },

  es: {
    title: "Pruebas Que Se Pueden Medir",
    subtitle:
      "Experiencia, resultados y un método basado en evidencia—no en modas.",
    items: [
      {
        icon: "calendar",
        value: "10+",
        label: "Años de Experiencia",
      },
      {
        icon: "users",
        value: "500+",
        label: "Clientes Acompañados",
      },
      {
        icon: "target",
        value: "1:1",
        label: "Coaching Cercano",
      },
      {
        icon: "bookOpen",
        value: "MSc",
        label: "Formación Basada en Ciencia",
      },
    ],
  },

  el: {
    title: "Αποδείξεις Μετρήσιμες",
    subtitle:
      "Εμπειρία, αποτέλεσμα και μέθοδος βασισμένη στην επιστήμη—όχι στις μόδες.",
    items: [
      {
        icon: "calendar",
        value: "10+",
        label: "Χρόνια Εμπειρίας",
      },
      {
        icon: "users",
        value: "500+",
        label: "Πελάτες που Υποστηρίχθηκαν",
      },
      {
        icon: "target",
        value: "1:1",
        label: "Υψηλή Υποστήριξη",
      },
      {
        icon: "bookOpen",
        value: "MSc",
        label: "Evidence-Based Εξειδίκευση",
      },
    ],
  },
};

// story section
export type AboutStoryContent = {
  title: string;
  subtitle?: string;
  paragraphs: string[];
};

export type AboutStoryData = {
  en: AboutStoryContent;
  es: AboutStoryContent;
  el: AboutStoryContent;
};

export const aboutStoryData: AboutStoryData = {
  en: {
    title: "My Story",
    subtitle: "From frustration to a foundation built on evidence",
    paragraphs: [
      "There’s a frustrating gap between working hard and actually seeing the results in the mirror. I know, because I’ve been there.",
      "My own journey didn’t start with a perfect plan. It started with a hard look in the mirror as an overweight young adult, knowing I deserved to be stronger and healthier.",
      "At 20 years old, I made a decision: things had to change. I walked into a gym and, session by session, started to build a new foundation.",
      "As my passion for training grew, a new one was ignited: the science of nutrition. It wasn’t just about losing weight anymore; it was about performance, health, and unlocking human potential.",
    ],
  },

  es: {
    title: "Mi Historia",
    subtitle: "De la frustración a una base construida con evidencia",
    paragraphs: [
      "Existe una brecha frustrante entre esforzarte y ver realmente los resultados en el espejo. Lo sé porque lo viví.",
      "Mi camino no empezó con un plan perfecto. Empezó con una mirada honesta al espejo siendo un joven adulto con sobrepeso, sabiendo que merecía ser más fuerte y más saludable.",
      "A los 20 años tomé una decisión: las cosas tenían que cambiar. Entré en un gimnasio y, sesión tras sesión, empecé a construir una nueva base.",
      "A medida que crecía mi pasión por el entrenamiento, se encendió otra: la ciencia de la nutrición. Ya no era solo perder peso; era rendimiento, salud y desbloquear el potencial humano.",
    ],
  },

  el: {
    title: "Η Ιστορία Μου",
    subtitle: "Από την απογοήτευση σε μια βάση χτισμένη στην επιστήμη",
    paragraphs: [
      "Υπάρχει ένα εκνευριστικό κενό ανάμεσα στο να δουλεύεις σκληρά και στο να βλέπεις πραγματικά το αποτέλεσμα στον καθρέφτη. Το ξέρω, γιατί το έζησα.",
      "Η δική μου πορεία δεν ξεκίνησε με ένα τέλειο πλάνο. Ξεκίνησε με μια ειλικρινή ματιά στον καθρέφτη ως υπέρβαρος νεαρός ενήλικας, γνωρίζοντας ότι άξιζα να είμαι πιο δυνατός και πιο υγιής.",
      "Στα 20 μου πήρα μια απόφαση: τα πράγματα έπρεπε να αλλάξουν. Μπήκα σε ένα γυμναστήριο και, προπόνηση με προπόνηση, άρχισα να χτίζω μια νέα βάση.",
      "Καθώς μεγάλωνε το πάθος μου για την προπόνηση, άναψε κι ένα νέο: η επιστήμη της διατροφής. Δεν ήταν πια μόνο η απώλεια βάρους—ήταν απόδοση, υγεία και το ξεκλείδωμα του ανθρώπινου δυναμικού.",
    ],
  },
};
// =======================
// Areas of Expertise
// =======================

export type ExpertiseIconKey = "bolt" | "target" | "heart" | "calendar";

export type ExpertiseItem = {
  icon: ExpertiseIconKey;
  title: string;
  description: string;
};

export type AboutExpertiseContent = {
  title: string;
  subtitle: string;
  items: ExpertiseItem[];
};

export type AboutExpertiseData = {
  en: AboutExpertiseContent;
  es: AboutExpertiseContent;
  el: AboutExpertiseContent;
};

export const aboutExpertiseData: AboutExpertiseData = {
  en: {
    title: "Areas of Expertise",
    subtitle:
      "Specialized knowledge and experience across key areas of sports nutrition",
    items: [
      {
        icon: "bolt",
        title: "Athletic Performance Nutrition",
        description:
          "Optimizing nutrition for competitive athletes across all sports disciplines",
      },
      {
        icon: "target",
        title: "Weight Management",
        description:
          "Evidence-based approaches to healthy weight loss and muscle gain",
      },
      {
        icon: "heart",
        title: "Sports Recovery",
        description:
          "Nutrition strategies for faster recovery and injury prevention",
      },
      {
        icon: "calendar",
        title: "Meal Planning & Prep",
        description:
          "Practical meal planning solutions for busy athletes and professionals",
      },
    ],
  },

  es: {
    title: "Áreas de Experiencia",
    subtitle:
      "Conocimiento especializado y experiencia en áreas clave de la nutrición deportiva",
    items: [
      {
        icon: "bolt",
        title: "Nutrición para el Rendimiento Deportivo",
        description:
          "Optimización nutricional para atletas competitivos en todas las disciplinas",
      },
      {
        icon: "target",
        title: "Gestión del Peso",
        description:
          "Enfoques basados en evidencia para perder grasa y ganar masa muscular de forma saludable",
      },
      {
        icon: "heart",
        title: "Recuperación Deportiva",
        description:
          "Estrategias nutricionales para recuperar más rápido y prevenir lesiones",
      },
      {
        icon: "calendar",
        title: "Planificación y Meal Prep",
        description:
          "Soluciones prácticas de planificación para atletas y profesionales con poco tiempo",
      },
    ],
  },

  el: {
    title: "Τομείς Εξειδίκευσης",
    subtitle:
      "Εξειδικευμένη γνώση και εμπειρία σε βασικούς τομείς της αθλητικής διατροφής",
    items: [
      {
        icon: "bolt",
        title: "Διατροφή για Αθλητική Απόδοση",
        description:
          "Βελτιστοποίηση διατροφής για ανταγωνιστικούς αθλητές σε κάθε άθλημα",
      },
      {
        icon: "target",
        title: "Διαχείριση Βάρους",
        description:
          "Evidence-based προσεγγίσεις για υγιή απώλεια λίπους και αύξηση μυϊκής μάζας",
      },
      {
        icon: "heart",
        title: "Αθλητική Αποκατάσταση",
        description:
          "Διατροφικές στρατηγικές για ταχύτερη αποκατάσταση και πρόληψη τραυματισμών",
      },
      {
        icon: "calendar",
        title: "Meal Planning & Prep",
        description:
          "Πρακτικές λύσεις προγραμματισμού γευμάτων για busy αθλητές και επαγγελματίες",
      },
    ],
  },
};
// =======================
// Education & Certifications
// =======================

export type EducationItem = {
  title: string;
  institution: string;
  description: string;
  year?: string; // badge label (e.g. "2018" or "Ongoing")
};

export type AboutEducationContent = {
  title: string;
  subtitle: string;
  items: EducationItem[];
};

export type AboutEducationData = {
  en: AboutEducationContent;
  es: AboutEducationContent;
  el: AboutEducationContent;
};

export const aboutEducationData: AboutEducationData = {
  en: {
    title: "Education & Certifications",
    subtitle:
      "Continuous learning and professional development to provide the highest level of coaching.",
    items: [
      {
        title: "MSc in Football Nutrition",
        institution: "Football Science Institute (FSI)",
        description:
          "Specialized postgraduate degree focused on performance nutrition in elite football environments.",
        year: "2020",
      },
      {
        title: "Master’s Degree in Nutrition",
        institution: "Universidad Complutense de Madrid (UCM)",
        description:
          "Advanced academic training in applied nutrition science and metabolic health.",
        year: "2018",
      },
      {
        title: "Bachelor’s Degree in Nutrition",
        institution: "Vienna",
        description:
          "Foundational education in nutritional science, physiology, and dietetics.",
        year: "2015",
      },
      {
        title: "Professional Seminars & Certifications",
        institution: "Francis Holway and other leading experts",
        description:
          "Ongoing specialization through seminars with world-renowned practitioners in sports nutrition.",
        year: "Ongoing",
      },
    ],
  },

  es: {
    title: "Educación y Certificaciones",
    subtitle:
      "Formación continua y desarrollo profesional para ofrecer el máximo nivel de acompañamiento.",
    items: [
      {
        title: "Máster en Nutrición para el Fútbol",
        institution: "Football Science Institute (FSI)",
        description:
          "Formación especializada en nutrición aplicada al rendimiento en entornos de fútbol profesional.",
        year: "2020",
      },
      {
        title: "Máster en Nutrición",
        institution: "Universidad Complutense de Madrid (UCM)",
        description:
          "Formación académica avanzada en nutrición aplicada y salud metabólica.",
        year: "2018",
      },
      {
        title: "Grado en Nutrición",
        institution: "Viena",
        description:
          "Base científica sólida en nutrición, fisiología y dietética.",
        year: "2015",
      },
      {
        title: "Seminarios y Certificaciones Profesionales",
        institution: "Francis Holway y otros expertos internacionales",
        description:
          "Especialización continua mediante seminarios con referentes mundiales en nutrición deportiva.",
        year: "En curso",
      },
    ],
  },

  el: {
    title: "Εκπαίδευση & Πιστοποιήσεις",
    subtitle:
      "Συνεχής εκπαίδευση και επαγγελματική εξέλιξη για το υψηλότερο επίπεδο καθοδήγησης.",
    items: [
      {
        title: "MSc στη Διατροφή Ποδοσφαίρου",
        institution: "Football Science Institute (FSI)",
        description:
          "Εξειδικευμένο μεταπτυχιακό στη διατροφή απόδοσης σε elite ποδοσφαιρικά περιβάλλοντα.",
        year: "2020",
      },
      {
        title: "Μεταπτυχιακό στη Διατροφή",
        institution: "Universidad Complutense de Madrid (UCM)",
        description:
          "Προχωρημένη ακαδημαϊκή εκπαίδευση στην εφαρμοσμένη διατροφική επιστήμη.",
        year: "2018",
      },
      {
        title: "Πτυχίο Διατροφής",
        institution: "Βιέννη",
        description:
          "Ισχυρή επιστημονική βάση στη διατροφή, φυσιολογία και διαιτολογία.",
        year: "2015",
      },
      {
        title: "Επαγγελματικά Σεμινάρια & Πιστοποιήσεις",
        institution: "Francis Holway και άλλοι διεθνείς ειδικοί",
        description:
          "Συνεχής εξειδίκευση μέσω σεμιναρίων με κορυφαίους επαγγελματίες της αθλητικής διατροφής.",
        year: "Σε εξέλιξη",
      },
    ],
  },
};

// =======================
// Values / Philosophy (My Philosophy layout)
// =======================

export type PhilosophyIconKey = "check" | "user" | "target";

export type PhilosophyItem = {
  icon: PhilosophyIconKey;
  title: string;
  description: string;
};

export type PhilosophyQuote = {
  text: string;
  author: string;
};

export type AboutPhilosophyContent = {
  title: string;
  items: PhilosophyItem[];
  quote: PhilosophyQuote;
};

export type AboutPhilosophyData = {
  en: AboutPhilosophyContent;
  es: AboutPhilosophyContent;
  el: AboutPhilosophyContent;
};

export const aboutPhilosophyData: AboutPhilosophyData = {
  en: {
    title: "My Philosophy",
    items: [
      {
        icon: "check",
        title: "Evidence-Based",
        description:
          "Every recommendation is grounded in scientific literature—not trends—so you follow a plan that actually works.",
      },
      {
        icon: "user",
        title: "Built for Your Life",
        description:
          "No two people are the same. Your strategy is designed around your schedule, preferences, and constraints—so it’s sustainable.",
      },
      {
        icon: "target",
        title: "Results-Focused",
        description:
          "Practical execution that produces measurable progress in performance, physique, and long-term health.",
      },
    ],
    quote: {
      text: "Nutrition isn’t about perfection. It’s about progress, consistency, and a plan you can execute for years.",
      author: "The E-Nutritionist Method",
    },
  },

  es: {
    title: "Mi Filosofía",
    items: [
      {
        icon: "check",
        title: "Basado en Evidencia",
        description:
          "Cada recomendación se apoya en la ciencia—no en modas—para que sigas un plan que realmente funciona.",
      },
      {
        icon: "user",
        title: "Diseñado para Tu Vida",
        description:
          "No hay dos personas iguales. Tu estrategia se adapta a tu agenda, preferencias y limitaciones—para que sea sostenible.",
      },
      {
        icon: "target",
        title: "Enfocado en Resultados",
        description:
          "Ejecución práctica que genera progreso medible en rendimiento, físico y salud a largo plazo.",
      },
    ],
    quote: {
      text: "La nutrición no se trata de perfección. Se trata de progreso, constancia y un plan que puedas sostener durante años.",
      author: "Método The E-Nutritionist",
    },
  },

  el: {
    title: "Η Φιλοσοφία Μου",
    items: [
      {
        icon: "check",
        title: "Evidence-Based",
        description:
          "Κάθε σύσταση βασίζεται στην επιστήμη—όχι σε trends—ώστε να εφαρμόζεις ένα πλάνο που δουλεύει πραγματικά.",
      },
      {
        icon: "user",
        title: "Φτιαγμένο για τη Ζωή σου",
        description:
          "Δεν υπάρχουν δύο ίδιοι άνθρωποι. Η στρατηγική σου προσαρμόζεται στο πρόγραμμα, τις προτιμήσεις και τους περιορισμούς σου—ώστε να είναι βιώσιμη.",
      },
      {
        icon: "target",
        title: "Results-Focused",
        description:
          "Πρακτική εφαρμογή που φέρνει μετρήσιμη πρόοδο σε απόδοση, σώμα και μακροχρόνια υγεία.",
      },
    ],
    quote: {
      text: "Η διατροφή δεν είναι τελειότητα. Είναι πρόοδος, συνέπεια και ένα πλάνο που μπορείς να εκτελείς για χρόνια.",
      author: "The E-Nutritionist Method",
    },
  },
};
// =======================
// Final CTA Banner (2 buttons)
// =======================

export type FinalCtaLink = {
  label: string;
  href: string;
};

export type FinalCtaContent = {
  title: string;
  description: string;
  cta: {
    primary: FinalCtaLink;
    secondary: FinalCtaLink;
  };
  note?: string;
};

export type AboutFinalCtaData = {
  en: FinalCtaContent;
  es: FinalCtaContent;
  el: FinalCtaContent;
};

export const aboutFinalCtaData: AboutFinalCtaData = {
  en: {
    title: "Ready to Write Your Own Success Story?",
    description:
      "If you’re ready to close the gap between your effort and your results, the first step is a 1-on-1 conversation.",
    cta: {
      primary: {
        label: "BOOK YOUR PHYSIQUE AUDIT",
        href: "https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA=",
      },
      secondary: {
        label: "VIEW MY SERVICES",
        href: "/services",
      },
    },
    note: "High-touch, evidence-based coaching. No guesswork.",
  },

  es: {
    title: "¿Listo para Escribir Tu Propia Historia de Éxito?",
    description:
      "Si quieres cerrar la brecha entre tu esfuerzo y tus resultados, el primer paso es una conversación 1 a 1.",
    cta: {
      primary: {
        label: "RESERVA TU PHYSIQUE AUDIT",
        href: "https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA=",
      },
      secondary: {
        label: "VER MIS SERVICIOS",
        href: "/services",
      },
    },
    note: "Coaching cercano y basado en evidencia. Sin adivinanzas.",
  },

  el: {
    title: "Έτοιμος να Γράψεις τη Δική σου Ιστορία Επιτυχίας;",
    description:
      "Αν θέλεις να κλείσεις το κενό ανάμεσα στην προσπάθεια και στο αποτέλεσμα, το πρώτο βήμα είναι μια 1:1 συζήτηση.",
    cta: {
      primary: {
        label: "ΚΛΕΙΣΕ ΤΟ PHYSIQUE AUDIT",
        href: "https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA=",
      },
      secondary: {
        label: "ΔΕΣ ΤΙΣ ΥΠΗΡΕΣΙΕΣ",
        href: "/services",
      },
    },
    note: "Υψηλή υποστήριξη, επιστημονική προσέγγιση. Χωρίς μαντεψιές.",
  },
};
