import type { HomeAboutData } from '../types'

export const aboutEN: HomeAboutData = {
  id: 'about',
  intro: 'About the Coach',
  title: "It's Not Just About Eating Right. It's About Finally Seeing the Results You've Earned.",
  lead:
    "I bridge the gap between hard work and real, repeatable results with evidence-based nutrition you can live with.",
  // keep a couple of body paragraphs (optional)
  paragraphs: [
    "There’s a frustrating gap between working hard and actually seeing the results in the mirror. I know, because I've been there. My own journey didn't start with a perfect plan. It started with a hard look in the mirror as an overweight young adult, knowing I deserved to be stronger and healthier.",
    "At 20 I decided things had to change. Training lit the spark; nutrition made it sustainable and powerful. That led me to study the science, separate fact from fiction, and build methods that actually work in real life."
  ],
  // 3 credentials in a row
  credentials: [
    "MSc, UCM",
    "MSc, Football Nutrition (FSI)",
    "BSc, Vienna"
  ],
  // 3 USPs
  usps: [
    "Evidence-based, not trends",
    "Built for busy lifters",
    "Education-first coaching"
  ],
  image: '/assets/images/about-home/profile-image.png',
  bestServiceHref: "/service",
  aboutHref : "/about",
  ctaPrimaryText: 'Start With the Best Program',
  ctaPrimaryHref: '/services/physique-mastery',   // best service
  ctaSecondaryText: 'Learn More About Me',
  ctaSecondaryHref: '/about'                      // about page
}
