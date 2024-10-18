import { Link } from 'react-router-dom';
import "./secondFooterSection.css"

const SecondFooterSection = () =>{
  return(
    <div className="second-footer-section">
      <div className="privicy-policies">
        <h3>LEGAL POLICIES</h3>
        <Link to="/legalnotice" className='p-links' onClick={()=>{window.scrollTo(0, 0)}}>Legal notice</Link>
        <Link to="/privacypolicy" className='p-links'  onClick={()=>{window.scrollTo(0, 0)}}>Privacy policy</Link>
        <Link to="/cookiespolicy" className='p-links'  onClick={()=>{window.scrollTo(0, 0)}}>Cookies policy</Link>
      </div>
      <div className="footer-links-to-website">
        <h3>LINKS</h3>
        <Link to="/services" className='p-links'  onClick={()=>{window.scrollTo(0, 0)}}>Services</Link>
        <Link to="/Blogs" className='p-links'  onClick={()=>{window.scrollTo(0, 0)}}>Blogs</Link>
        <Link to="/about" className='p-links'  onClick={()=>{window.scrollTo(0, 0)}}>About</Link>
      </div>
      <div className="footer-contact-info">
        <h3>CONTACT</h3>
        <p>thimiosarvanitis@gmail.com</p>
        <p>+ (34)613497305</p>
        <p>Madrid, Spain</p>
      </div>
    </div>
  )
}

export default SecondFooterSection