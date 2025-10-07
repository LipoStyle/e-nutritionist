import { ServiceCardData } from "../types"

export const servicesEN: ServiceCardData[] = [
  {
    id: "ebook",
    title: "The 15-Minute Macro Manual",
    tagline: "The busy lifter's guide to muscle and fat loss—without guesswork.",
    priceLabel: "€19.99",
    image: "/assets/images/home-services/image1.jpg",
    badge: "new",
    detailsHref: "/services/the-15-minute-macro-manual",
    bookingHref: "/shop/the-15-minute-macro-manual",
    showHomeService: true, // ✅ show on homepage
  },
  {
    id: "audit",
    title: "The Physique Audit",
    tagline: "90-minute strategy session to unlock your full potential.",
    priceLabel: "€129",
    image: "/assets/images/home-services/image1.jpg",
    detailsHref: "/services/the-physique-audit",
    bookingHref: "/booking/physique-audit",
    showHomeService: true, // ✅ show on homepage
  },
  {
    id: "ignition",
    title: "The 12-Week Lifter's Ignition Program",
    tagline: "From lost to confident in the gym & kitchen, in 12 weeks.",
    priceLabel: "€1,197",
    image: "/assets/images/home-services/image1.jpg",
    detailsHref: "/services/lifters-ignition",
    bookingHref: "/booking/physique-audit", // starts with audit
    showHomeService: true, // ✅ show on homepage
  },
  {
    id: "intensive",
    title: "The 3-Month Physique Efficiency Intensive",
    tagline: "Dedicated 1-on-1 nutrition coaching for 12 weeks.",
    priceLabel: "€1,197",
    image: "/assets/images/home-services/image1.jpg",
    detailsHref: "/services/physique-efficiency-intensive",
    bookingHref: "/booking/physique-audit",
    // showHomeService: false // (omit or set false)
  },
  {
    id: "mastery",
    title: "The 6-Month Physique Mastery Program",
    tagline: "Elite 1-on-1 partnership for true mastery & autonomy.",
    priceLabel: "€2,197",
    image: "/assets/images/home-services/image1.jpg",
    detailsHref: "/services/physique-mastery",
    bookingHref: "/booking/physique-audit",
  },
  {
    id: "vip",
    title: "The VIP Coaching Year",
    tagline: "12 months of ultimate support, accountability & results.",
    priceLabel: "€3,997",
    image: "/assets/images/home-services/image1.jpg",
    badge: "limited",
    detailsHref: "/services/vip-coaching",
    bookingHref: "/booking/physique-audit",
  },
]
