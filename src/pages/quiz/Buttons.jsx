import React from "react";
// import "./buttons.css";

const Buttons = ({ changeScreen, back, next, nb, nn, handleSubmit }) => {
  const handleNextClick = () => {
    if (typeof next === "function") {
      next(); // Call next function (e.g., handleSubmit in ScreenSix)
    } else {
      changeScreen(next, nn); // Navigate to next screen
    }
  };

  return (
    <div className="buttons">
      {back && (
        <button onClick={() => changeScreen(back, nb)} className="button-back">
          Back
        </button>
      )}
      {next && (
        <button onClick={handleNextClick} className="button-next">
          Next
        </button>
      )}
    </div>
  );
};

export default Buttons;
