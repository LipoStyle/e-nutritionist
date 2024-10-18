import SocialMediaIcons from "./SocialMediaIcons"
import logo from "../../../images/headerimages/logo.svg"
import "./firstFooterSection.css"
const FirstFooterSection = () =>{
  return(
    <div className="first-footer-section">
      <img className="footer-logo" src={logo} alt="logo" />
      <p className="copyright">© Thymios Arvanitis Nutritionist 2024 ©</p>
      <SocialMediaIcons />
    </div>
  )
}

export default FirstFooterSection