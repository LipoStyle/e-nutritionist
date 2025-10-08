import { ServiceCardData } from "../types"

export const servicesEL: ServiceCardData[] = [
  {
    id: "ebook",
    title: "Το Εγχειρίδιο Μακροθρεπτικών σε 15 Λεπτά",
    tagline: "Ο οδηγός για αύξηση μυών και καύση λίπους—χωρίς περιττή σύγχυση.",
    priceLabel: "€19.99",
    image: "/assets/images/home-services/image1.jpg",
    badge: "νέο",
    detailsHref: "/el/services/egcheiridio-makrothreptikon",
    bookingHref: "/el/shop/egcheiridio-makrothreptikon",
    showHomeService: true, // ✅ show on homepage
  },
  {
    id: "audit",
    title: "Ο Έλεγχος Σωματικής Διάπλασης",
    tagline: "90 λεπτά στρατηγικής για να ξεκλειδώσεις τις δυνατότητές σου.",
    priceLabel: "€129",
    image: "/assets/images/home-services/image1.jpg",
    detailsHref: "/el/services/elegxos-somatikis-diaplaseis",
    bookingHref: "/el/booking/elegxos-somatikis",
    showHomeService: true, // ✅ show on homepage
  },
  {
    id: "ignition",
    title: "Το 12-Εβδομάδων Πρόγραμμα Ανάφλεξης",
    tagline: "Από αρχάριος σε σίγουρος στο γυμναστήριο και τη διατροφή.",
    priceLabel: "€1,197",
    image: "/assets/images/home-services/image1.jpg",
    detailsHref: "/el/services/prog-anaplexis",
    bookingHref: "/el/booking/elegxos-somatikis",
    showHomeService: true, // ✅ show on homepage
  },
  {
    id: "intensive",
    title: "Η 3-Μηνών Εντατική Εφαρμογή Διατροφής",
    tagline: "Προσωπικό coaching διατροφής για 12 εβδομάδες.",
    priceLabel: "€1,197",
    image: "/assets/images/home-services/image1.jpg",
    detailsHref: "/el/services/entatiki-diatrofis",
    bookingHref: "/el/booking/elegxos-somatikis",
  },
  {
    id: "mastery",
    title: "Το 6-Μηνών Πρόγραμμα Μάστερι",
    tagline: "Συνεργασία υψηλού επιπέδου για πραγματική αυτονομία.",
    priceLabel: "€2,197",
    image: "/assets/images/home-services/image1.jpg",
    detailsHref: "/el/services/prog-mastery",
    bookingHref: "/el/booking/elegxos-somatikis",
  },
  {
    id: "vip",
    title: "Το VIP Coaching Έτους",
    tagline: "12 μήνες μέγιστης υποστήριξης και υπευθυνότητας.",
    priceLabel: "€3,997",
    image: "/assets/images/home-services/image1.jpg",
    badge: "περιορισμένο",
    detailsHref: "/el/services/vip-coaching",
    bookingHref: "/el/booking/elegxos-somatikis",
  },
]
