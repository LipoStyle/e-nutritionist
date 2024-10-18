import ContactIntro from "./contactintro/ContactIntro";
import ContactInfo from "./contactinformation/ContactInfo";
import ContactForm from "./contactform/ContactForm";
import "./contactus.css"

const ContactMe = ({localHost, heroku}) => {
  return(
    <div className="contact-us">
      <ContactIntro />
      <ContactInfo />
      <ContactForm />
    </div>
  )
}

export default ContactMe;