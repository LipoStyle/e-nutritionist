import { ServiceCardData } from "../types"

export const servicesES: ServiceCardData[] = [
  {
    id: "ebook",
    title: "El Manual de Macros en 15 Minutos",
    tagline: "La guía para aumentar músculo y perder grasa, sin complicaciones.",
    priceLabel: "€19.99",
    image: "/assets/images/home-services/image1.jpg",
    badge: "nuevo",
    detailsHref: "/es/services/el-manual-de-macros",
    bookingHref: "/es/shop/el-manual-de-macros",
    showHomeService: true, // ✅ show on homepage
  },
  {
    id: "audit",
    title: "La Auditoría Física",
    tagline: "Sesión estratégica de 90 minutos para desbloquear tu potencial.",
    priceLabel: "€129",
    image: "/assets/images/home-services/image1.jpg",
    detailsHref: "/es/services/la-auditoria-fisica",
    bookingHref: "/es/booking/auditoria-fisica",
    showHomeService: true, // ✅ show on homepage
  },
  {
    id: "ignition",
    title: "Programa de 12 Semanas: Encendido del Levantador",
    tagline: "De perdido a seguro en el gimnasio y la nutrición.",
    priceLabel: "€1,197",
    image: "/assets/images/home-services/image1.jpg",
    detailsHref: "/es/services/programa-encendido",
    bookingHref: "/es/booking/auditoria-fisica",
    showHomeService: true, // ✅ show on homepage
  },
  {
    id: "intensive",
    title: "Intensivo de 3 Meses en Eficiencia Física",
    tagline: "Coaching nutricional 1-a-1 durante 12 semanas.",
    priceLabel: "€1,197",
    image: "/assets/images/home-services/image1.jpg",
    detailsHref: "/es/services/intensivo-eficiencia-fisica",
    bookingHref: "/es/booking/auditoria-fisica",
  },
  {
    id: "mastery",
    title: "Programa de Maestría Física de 6 Meses",
    tagline: "Asociación de élite para lograr verdadera autonomía.",
    priceLabel: "€2,197",
    image: "/assets/images/home-services/image1.jpg",
    detailsHref: "/es/services/maestria-fisica",
    bookingHref: "/es/booking/auditoria-fisica",
  },
  {
    id: "vip",
    title: "El Año VIP de Coaching",
    tagline: "12 meses de apoyo y responsabilidad de máximo nivel.",
    priceLabel: "€3,997",
    image: "/assets/images/home-services/image1.jpg",
    badge: "limitado",
    detailsHref: "/es/services/coaching-vip",
    bookingHref: "/es/booking/auditoria-fisica",
  },
]
