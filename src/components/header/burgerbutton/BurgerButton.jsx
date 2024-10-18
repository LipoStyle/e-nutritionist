import React from 'react';
import './burgerbutton.css';

const BurgerButton = ({toggle, handleToggle}) => {
  
  return(
    <div className={toggle ? "burger-bars active" : "burger-bars"} onClick={()=>{handleToggle()}}>
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
    </div>
  )
}

export default BurgerButton;