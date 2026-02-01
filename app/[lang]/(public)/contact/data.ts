// =======================
// Contact Hero
// =======================

export type ContactHeroContent = {
  title: string;
  description: string;
};

export type ContactHeroData = {
  en: ContactHeroContent;
  es: ContactHeroContent;
  el: ContactHeroContent;
};

export const contactHeroData: ContactHeroData = {
  en: {
    title: "Get In Touch",
    description:
      "Ready to start your nutrition journey? I'm here to help you achieve your health and performance goals. Let's discuss how we can work together.",
  },
  es: {
    title: "Ponte en Contacto",
    description:
      "¿Listo para comenzar tu camino en nutrición? Estoy aquí para ayudarte a lograr tus objetivos de salud y rendimiento. Hablemos de cómo podemos trabajar juntos.",
  },
  el: {
    title: "Επικοινώνησε Μαζί Μου",
    description:
      "Έτοιμος να ξεκινήσεις το ταξίδι σου στη διατροφή; Είμαι εδώ για να σε βοηθήσω να πετύχεις τους στόχους σου σε υγεία και απόδοση. Ας δούμε πώς μπορούμε να συνεργαστούμε.",
  },
};
// =======================
// Contact Form
// =======================

export type ContactServiceOption = {
  value: string;
  label: string;
};

export type ContactFormContent = {
  title: string;
  subtitle: string;

  fields: {
    fullName: { label: string; placeholder: string; requiredLabel: string };
    email: { label: string; placeholder: string; requiredLabel: string };
    phone: { label: string; placeholder: string };
    service: { label: string; placeholder: string };
    subject: { label: string; placeholder: string };
    message: { label: string; placeholder: string; requiredLabel: string };
  };

  services: ContactServiceOption[];

  submitLabel: string;
  successTitle: string;
  successMessage: string;
};

export type ContactFormData = {
  en: ContactFormContent;
  es: ContactFormContent;
  el: ContactFormContent;
};

export const contactFormData: ContactFormData = {
  en: {
    title: "Send Me a Message",
    subtitle:
      "Fill out the form below and I'll get back to you within 24 hours.",

    fields: {
      fullName: {
        label: "Full Name",
        placeholder: "Your full name",
        requiredLabel: "*",
      },
      email: {
        label: "Email Address",
        placeholder: "your.email@example.com",
        requiredLabel: "*",
      },
      phone: {
        label: "Phone Number",
        placeholder: "+1 (555) 123-4567",
      },
      service: {
        label: "Service Interest",
        placeholder: "Select a service",
      },
      subject: {
        label: "Subject",
        placeholder: "Brief subject line",
      },
      message: {
        label: "Message",
        placeholder:
          "Tell me about your goals, current situation, and how I can help you...",
        requiredLabel: "*",
      },
    },

    services: [
      { value: "physique-audit", label: "Physique Audit" },
      { value: "vip-year", label: "VIP Coaching Year" },
      { value: "performance", label: "Performance Nutrition Coaching" },
      { value: "meal-prep", label: "Meal Planning & Prep" },
      { value: "other", label: "Other" },
    ],

    submitLabel: "Send Message",
    successTitle: "Message sent",
    successMessage:
      "Thanks for reaching out. I’ll get back to you within 24 hours.",
  },

  es: {
    title: "Envíame un Mensaje",
    subtitle: "Completa el formulario y te responderé en un plazo de 24 horas.",

    fields: {
      fullName: {
        label: "Nombre Completo",
        placeholder: "Tu nombre completo",
        requiredLabel: "*",
      },
      email: {
        label: "Correo Electrónico",
        placeholder: "tu.correo@ejemplo.com",
        requiredLabel: "*",
      },
      phone: {
        label: "Teléfono",
        placeholder: "+34 600 000 000",
      },
      service: {
        label: "Interés de Servicio",
        placeholder: "Selecciona un servicio",
      },
      subject: {
        label: "Asunto",
        placeholder: "Asunto breve",
      },
      message: {
        label: "Mensaje",
        placeholder:
          "Cuéntame tus objetivos, tu situación actual y cómo puedo ayudarte...",
        requiredLabel: "*",
      },
    },

    services: [
      { value: "physique-audit", label: "Physique Audit" },
      { value: "vip-year", label: "VIP Coaching Year" },
      { value: "performance", label: "Coaching de Rendimiento" },
      { value: "meal-prep", label: "Planificación de Comidas" },
      { value: "other", label: "Otro" },
    ],

    submitLabel: "Enviar Mensaje",
    successTitle: "Mensaje enviado",
    successMessage:
      "Gracias por escribir. Te responderé en un plazo de 24 horas.",
  },

  el: {
    title: "Στείλε μου Μήνυμα",
    subtitle: "Συμπλήρωσε τη φόρμα και θα σου απαντήσω μέσα σε 24 ώρες.",

    fields: {
      fullName: {
        label: "Ονοματεπώνυμο",
        placeholder: "Το ονοματεπώνυμό σου",
        requiredLabel: "*",
      },
      email: {
        label: "Email",
        placeholder: "to.email@sou.gr",
        requiredLabel: "*",
      },
      phone: {
        label: "Τηλέφωνο",
        placeholder: "+30 690 000 0000",
      },
      service: {
        label: "Ενδιαφέρον Υπηρεσίας",
        placeholder: "Επέλεξε υπηρεσία",
      },
      subject: {
        label: "Θέμα",
        placeholder: "Σύντομο θέμα",
      },
      message: {
        label: "Μήνυμα",
        placeholder:
          "Πες μου τους στόχους σου, την τωρινή κατάσταση και πώς μπορώ να σε βοηθήσω...",
        requiredLabel: "*",
      },
    },

    services: [
      { value: "physique-audit", label: "Physique Audit" },
      { value: "vip-year", label: "VIP Coaching Year" },
      { value: "performance", label: "Coaching Απόδοσης" },
      { value: "meal-prep", label: "Οργάνωση Γευμάτων" },
      { value: "other", label: "Άλλο" },
    ],

    submitLabel: "Αποστολή Μηνύματος",
    successTitle: "Το μήνυμα στάλθηκε",
    successMessage:
      "Ευχαριστώ για την επικοινωνία. Θα σου απαντήσω μέσα σε 24 ώρες.",
  },
};
// =======================
// Contact Info + Book Directly
// =======================

export type ContactInfoItemIcon = "phone" | "email" | "office" | "hours";

export type ContactInfoItem = {
  icon: ContactInfoItemIcon;
  label: string;
  value: string;
  helper: string;
};

export type ContactBookCard = {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
};

export type ContactInfoContent = {
  infoTitle: string;
  items: ContactInfoItem[];
  book: ContactBookCard;
};

export type ContactInfoData = {
  en: ContactInfoContent;
  es: ContactInfoContent;
  el: ContactInfoContent;
};

export const contactInfoData: ContactInfoData = {
  en: {
    infoTitle: "Contact Information",
    items: [
      {
        icon: "phone",
        label: "Phone",
        value: "+34 613497305",
        helper: "Call for immediate assistance",
      },
      {
        icon: "email",
        label: "Email",
        value: "info@e-nutritionist.com",
        helper: "Send us a detailed message",
      },
      {
        icon: "hours",
        label: "Hours",
        value: "Mon–Fri: 8AM–6PM",
        helper: "Weekend appointments by request",
      },
    ],
    book: {
      title: "Book Directly",
      description:
        "Ready to get started? Book your free consultation call directly.",
      buttonLabel: "Schedule Free Call",
      buttonHref:
        "https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA=",
    },
  },

  es: {
    infoTitle: "Información de Contacto",
    items: [
      {
        icon: "phone",
        label: "Teléfono",
        value: "+34 613497305",
        helper: "Llama para asistencia inmediata",
      },
      {
        icon: "email",
        label: "Email",
        value: "info@e-nutritionist.com",
        helper: "Envíanos un mensaje detallado",
      },
      {
        icon: "hours",
        label: "Horario",
        value: "Lun–Vie: 8:00–18:00",
        helper: "Citas en fin de semana bajo solicitud",
      },
    ],
    book: {
      title: "Reserva Directamente",
      description:
        "¿Listo para empezar? Reserva tu llamada gratuita de consulta directamente.",
      buttonLabel: "Agendar Llamada Gratis",
      buttonHref:
        "https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA=",
    },
  },

  el: {
    infoTitle: "Στοιχεία Επικοινωνίας",
    items: [
      {
        icon: "phone",
        label: "Τηλέφωνο",
        value: "+34 613497305",
        helper: "Κάλεσε για άμεση εξυπηρέτηση",
      },
      {
        icon: "email",
        label: "Email",
        value: "info@e-nutritionist.com",
        helper: "Στείλε μας ένα αναλυτικό μήνυμα",
      },
      {
        icon: "hours",
        label: "Ώρες",
        value: "Δευ–Παρ: 8:00–18:00",
        helper: "Σαββατοκύριακο κατόπιν αιτήματος",
      },
    ],
    book: {
      title: "Κλείσε Απευθείας",
      description:
        "Έτοιμος να ξεκινήσεις; Κλείσε απευθείας τη δωρεάν κλήση συμβουλευτικής.",
      buttonLabel: "Κλείσε Δωρεάν Κλήση",
      buttonHref:
        "https://calendar.google.com/calendar/u/0/appointments/AcZssZ1ZKA4hOGC52fSzMnzNNlrgcMYEppqRLbXwhVA=",
    },
  },
};
// =======================
// What to Expect
// =======================

export type ContactExpectItem = {
  title: string;
  description: string;
};

export type ContactExpectContent = {
  title: string;
  items: ContactExpectItem[];
};

export type ContactExpectData = {
  en: ContactExpectContent;
  es: ContactExpectContent;
  el: ContactExpectContent;
};

export const contactExpectData: ContactExpectData = {
  en: {
    title: "What to Expect",
    items: [
      {
        title: "Quick Response",
        description: "You’ll receive a reply within 24 hours.",
      },
      {
        title: "Free Initial Consultation",
        description: "A short call to understand your goals and needs.",
      },
      {
        title: "Personalized Guidance",
        description: "Clear, evidence-based recommendations tailored to you.",
      },
      {
        title: "Ongoing Support",
        description: "Long-term guidance focused on sustainable results.",
      },
    ],
  },

  es: {
    title: "Qué Puedes Esperar",
    items: [
      {
        title: "Respuesta Rápida",
        description: "Recibirás respuesta en un plazo de 24 horas.",
      },
      {
        title: "Consulta Inicial Gratuita",
        description: "Una llamada corta para entender tus objetivos.",
      },
      {
        title: "Guía Personalizada",
        description:
          "Recomendaciones claras y basadas en evidencia, adaptadas a ti.",
      },
      {
        title: "Acompañamiento Continuo",
        description:
          "Soporte a largo plazo enfocado en resultados sostenibles.",
      },
    ],
  },

  el: {
    title: "Τι να Περιμένεις",
    items: [
      {
        title: "Γρήγορη Απόκριση",
        description: "Θα λάβεις απάντηση μέσα σε 24 ώρες.",
      },
      {
        title: "Δωρεάν Αρχική Συνεδρία",
        description: "Μια σύντομη κλήση για να κατανοήσουμε τους στόχους σου.",
      },
      {
        title: "Εξατομικευμένη Καθοδήγηση",
        description:
          "Ξεκάθαρες, επιστημονικά τεκμηριωμένες προτάσεις για εσένα.",
      },
      {
        title: "Συνεχής Υποστήριξη",
        description:
          "Μακροπρόθεσμη καθοδήγηση με έμφαση σε βιώσιμα αποτελέσματα.",
      },
    ],
  },
};
// =======================
// Contact FAQ
// =======================

export type ContactFaqItem = {
  question: string;
  answer: string;
};

export type ContactFaqContent = {
  title: string;
  subtitle: string;
  items: ContactFaqItem[];
};

export type ContactFaqData = {
  en: ContactFaqContent;
  es: ContactFaqContent;
  el: ContactFaqContent;
};

export const contactFaqData: ContactFaqData = {
  en: {
    title: "Frequently Asked Questions",
    subtitle:
      "Quick answers to common questions about coaching, scheduling, and what to expect.",
    items: [
      {
        question: "Do you offer virtual consultations?",
        answer:
          "Yes. Most consultations are done online, making it easy to work together from anywhere while still providing high-touch support.",
      },
      {
        question: "How quickly will I hear back after submitting the form?",
        answer:
          "You’ll receive a response within 24 hours on business days. If it’s urgent, call or book directly from the right panel.",
      },
      {
        question: "What happens during the first call?",
        answer:
          "We’ll discuss your goals, training routine, current nutrition habits, and challenges. You’ll leave with clear next steps and the best service recommendation.",
      },
      {
        question: "How long does it take to see results?",
        answer:
          "It depends on your starting point and consistency, but many clients notice measurable progress within the first 2–4 weeks when following the plan.",
      },
    ],
  },

  es: {
    title: "Preguntas Frecuentes",
    subtitle:
      "Respuestas rápidas a dudas comunes sobre coaching, agenda y qué puedes esperar.",
    items: [
      {
        question: "¿Ofreces consultas online?",
        answer:
          "Sí. La mayoría de las consultas son online, lo que facilita trabajar juntos desde cualquier lugar con apoyo cercano.",
      },
      {
        question: "¿Cuánto tardas en responder el formulario?",
        answer:
          "Responderé en un plazo de 24 horas en días laborables. Si es urgente, llama o reserva directamente desde la sección lateral.",
      },
      {
        question: "¿Qué ocurre en la primera llamada?",
        answer:
          "Hablaremos de tus objetivos, tu entrenamiento, tus hábitos actuales y los principales obstáculos. Saldrás con pasos claros y la mejor recomendación de servicio.",
      },
      {
        question: "¿Cuánto se tarda en ver resultados?",
        answer:
          "Depende del punto de partida y la constancia, pero muchos clientes notan progreso medible en 2–4 semanas siguiendo el plan.",
      },
    ],
  },

  el: {
    title: "Συχνές Ερωτήσεις",
    subtitle:
      "Γρήγορες απαντήσεις για coaching, ραντεβού και τι να περιμένεις.",
    items: [
      {
        question: "Κάνεις online συνεδρίες;",
        answer:
          "Ναι. Οι περισσότερες συνεδρίες γίνονται online, ώστε να συνεργαζόμαστε από οπουδήποτε με υψηλό επίπεδο υποστήριξης.",
      },
      {
        question: "Πότε θα λάβω απάντηση αφού στείλω τη φόρμα;",
        answer:
          "Θα λάβεις απάντηση μέσα σε 24 ώρες τις εργάσιμες ημέρες. Αν είναι επείγον, μπορείς να καλέσεις ή να κλείσεις απευθείας.",
      },
      {
        question: "Τι γίνεται στην πρώτη κλήση;",
        answer:
          "Συζητάμε στόχους, προπόνηση, τωρινές συνήθειες διατροφής και δυσκολίες. Θα φύγεις με ξεκάθαρα επόμενα βήματα και πρόταση υπηρεσίας.",
      },
      {
        question: "Πόσο γρήγορα θα δω αποτελέσματα;",
        answer:
          "Εξαρτάται από το σημείο εκκίνησης και τη συνέπεια, αλλά πολλοί βλέπουν μετρήσιμη πρόοδο στις πρώτες 2–4 εβδομάδες με σωστή εφαρμογή.",
      },
    ],
  },
};
