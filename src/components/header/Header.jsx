import React from "react";
import { useState } from "react"; 
import "./header.css"

import NavigationMenu from "./navigationmenu/NavigationMenu";
import LogoSection from ".//logosection/LogoSection";
import BurgerButton from ".//burgerbutton/BurgerButton";

const Header = () =>{
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return(
    <header>
      <LogoSection />
      <NavigationMenu toggle={toggle} handleToggle={handleToggle}/>
      <BurgerButton toggle={toggle} handleToggle={handleToggle}/>
    </header>
  )
}

export default Header;