import React from "react";
import Buttons from "../Buttons";
import ProgressBar from "../ProgressBar";
import { answerContent } from "./answerContent";
import "./screenfive.css";

const ScreenFive = ({ screen, nmscreen, formData, handleInputChange }) => {
  const handleDivClick = (id, name) => {
    if (id === 9) {
      // Handle selection of "None of the above"
      handleInputChange("primaryGoal", "None of the above");
    } else {
      // Handle selection of other options
      handleInputChange("primaryGoal", name);
    }
  };

  const handleNextScreen = () => {
    if (formData.primaryGoal) {
      screen("screen6"); // Proceed to the next screen if an option is selected
    } else {
      alert("Please select at least one option."); // Validation message
    }
  };

  const progressPercentage = (nmscreen / 7) * 100; // Adjust based on your total screens

  return (
    <div id="screen5" className="screen5">
      <h1 className="title">What is your primary goal?</h1>
      <div className="answer-container">
        {answerContent.map((answer) => (
          <div
            key={answer.id}
            className={
              formData.primaryGoal === answer.name
                ? "answer-card active"
                : "answer-card"
            }
            onClick={() => handleDivClick(answer.id, answer.name)}
          >
            <h4>{answer.name}</h4>
            <p>{answer.description}</p>
          </div>
        ))}
        <div
          className={
            formData.primaryGoal === "None of the above"
              ? "answer-card active"
              : "answer-card"
          }
          onClick={() => handleDivClick(9, "None of the above")}
        >
          <h4>None of the above</h4>
          <textarea
            name="#"
            id="other-answer"
            placeholder="Elaborate Further"
            value={formData.otherPrimaryGoal || ""}
            onChange={(e) =>
              handleInputChange("otherPrimaryGoal", e.target.value)
            }
          ></textarea>
        </div>
      </div>
      <Buttons
        changeScreen={screen}
        back={"screen4"}
        next={handleNextScreen}
        nb={4}
        nn={6}
      />
    </div>
  );
};

export default ScreenFive;
