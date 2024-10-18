import "./contactinfo.css"
import ContactMethod from "./ContactMethod"

import instagram from "../../../images/contactusimages/instagram.svg"
import whatsapp from "../../../images/contactusimages/whatsapp.svg"
import email from "../../../images/contactusimages/email.svg"


const ContactInfo = () => {
  return(
    <div className="contact-info">
      <h2 className="title">Get in touch</h2>
      <p className="text">Use our contact form for all information requests or contact us directly using the contact information below.</p>
      <p className="text">Feel free to get in touch with us via email or phone</p>
      <p className="line"></p>
      <div className="contact-method">
        <img src={instagram} alt="instagram" className="contact-instagram"/>
        <a href="https://www.instagram.com/enutritionist_" className="contact-click">Nutrition Arvanitis</a>
      </div>
      <div className="contact-method">
        <img src={whatsapp} alt="whatsapp" className="contact-whatsapp"/>
        <p>+34613497305</p>
      </div>
      <div className="contact-method">
        <img src={email} alt="email" className="contact-email"/>
        <p>thimiosarvanitis@gmail.com</p>
      </div>
    </div>
  )
}

export default ContactInfo