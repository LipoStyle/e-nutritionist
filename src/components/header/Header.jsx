import React, { useState } from "react"; 
import { Link, useLocation } from 'react-router-dom';
import "./header.css";
import logo from "../../images/headerimages/logo.svg";

const Header = () => {
  const [burgerToggle, setBurgerToggle] = useState(false);
  const location = useLocation();

  const handleBurgerToggle = () => {
    setBurgerToggle((prev) => !prev);
  };

  // Function to check if the link is active
  const isActive = (path) => location.pathname === path;

  return (
    <header>
      <div className="navigation-menu">
        <div className={`burger-button ${burgerToggle ? 'burger-active' : ''}`} onClick={handleBurgerToggle}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <div className={`navbar ${burgerToggle ? "active" : ""}`}>
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Home</Link>
          <Link to="/services" className={`nav-link ${isActive("/services") ? "active" : ""}`}>Services</Link>
          <Link to="/blogs" className={`nav-link ${isActive("/blogs") ? "active" : ""}`}>Blogs</Link>
          <Link to="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`}>About</Link>
          <Link to="/contactus" className={`nav-link ${isActive("/contactus") ? "active" : ""}`}>Contact</Link>
        </div>
        <Link to="/booking" className="green-button">Book A Consultation</Link>
      </div>
      <div>
        <div className="homepg-logo">
          <Link to="/">
            <div className="logo-pack">
              <img src={logo} alt="logo" />
              <p className="author-name">Thymios Arvanitis</p>
              <p className="author-job">Nutritionist</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
