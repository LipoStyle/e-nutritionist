import "./Hero.css"

import background from "../../../images/home-images/hero-section/background.jpg"

const Hero = () => {
  return(
    <section className="hero-section">
      <img src={background} alt="a backgorund image for hero section" />
    </section>
  )
}
export default Hero;