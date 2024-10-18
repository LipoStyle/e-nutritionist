import React from "react";
import { useState } from "react"; 
import "./header.css"

// import NavigationMenu from "./navigationmenu/NavigationMenu";
// import LogoSection from ".//logosection/LogoSection";
// import BurgerButton from ".//burgerbutton/BurgerButton";
 
import logo from "../../images/headerimages/logo.svg"

const Header = () =>{
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return(
    <header>
      {/* <LogoSection />
      <NavigationMenu toggle={toggle} handleToggle={handleToggle}/>
      <BurgerButton toggle={toggle} handleToggle={handleToggle}/> */}

      <div className="navigation-menu">
        <div className="navbar">
          <a href="./">Home</a>
          <a href="./services">Services</a>
          <a href="./blogs">Blogs</a>
          <a href="./about">About</a>
          <a href="./contactus">Contact</a>
        </div>
        <a href="#" className="green-button">Book A Consultation</a>
      </div>
      <div>
        <div className="homepg-logo">
          <a href="./" >
            <div className="logo-pack">
              <img src={logo} alt="logo" />
              <p className="author-name">Thymios Arvanitis</p>
              <p className="author-job">Nutritionist</p>
            </div>
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header;