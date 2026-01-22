"use client";

import "@/styles/header/BurgerMenu.css";

const BurgerMenu = ({
  isOpen,
  toggleBurger,
}: {
  isOpen: boolean;
  toggleBurger: () => void;
}) => {
  return (
    <div
      className={`burger-button ${isOpen ? "burger-active" : ""}`}
      onClick={toggleBurger}
    >
      <div className="line" />
      <div className="line" />
      <div className="line" />
    </div>
  );
};

export default BurgerMenu;
