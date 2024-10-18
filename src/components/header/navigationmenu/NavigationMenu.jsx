import React from 'react';
import { Link } from 'react-router-dom';
import './navigationmenu.css';

const NavigationMenu = ({toggle, handleToggle}) => {
  return (
      <ul className={toggle ? "navigation-menu active" : "navigation-menu"}>
        <li><Link to="/" onClick={handleToggle}>Home</Link></li>
        <li><Link to="/services" onClick={handleToggle}>Services</Link></li>
        <li><Link to="/blogs" onClick={handleToggle}>Blogs</Link></li>
        <li><Link to="/about" onClick={handleToggle}>About</Link></li>
        <li><Link to="/contactus" onClick={handleToggle}>Contact Us</Link></li>
      </ul>
  );
};

export default NavigationMenu;
