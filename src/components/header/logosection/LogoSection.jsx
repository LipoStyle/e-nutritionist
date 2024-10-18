import "./logosection.css";
import logo from '../../../images/headerimages/logo.svg';
import { Link } from 'react-router-dom'; // Import Link from React Router

const LogoSection = () => {
  return (
    <Link to="/" className="logo-section"> {/* Wrap the logo section in a Link */}
      <img src={logo} alt="logo-of-the-site" />
      <p className="name-of-author">Thymios Arvanitis</p>
      <p className="job-of-author">Nutritionist</p>
    </Link>
  );
};

export default LogoSection;
