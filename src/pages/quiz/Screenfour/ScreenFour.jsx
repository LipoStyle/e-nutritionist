import React from "react";
import Buttons from "../Buttons";
import ProgressBar from "../ProgressBar";
import { answerContent } from "./answerContent";
import "./screenfour.css";

const ScreenFour = ({ screen, nmscreen, formData, handleInputChange }) => {
  const handleDivClick = (id, name) => {
    if (name === "I experience other chronic conditions not listed here.") {
      if (formData.allergies.includes(formData.otherAllergies)) {
        // Remove only the textarea content if it's already included
        const updatedAllergies = formData.allergies.filter(
          (item) => item !== formData.otherAllergies
        );
        handleInputChange("allergies", updatedAllergies);
      } else {
        // Add only the textarea content
        const updatedAllergies = [
          ...formData.allergies,
          formData.otherAllergies,
        ];
        handleInputChange("allergies", updatedAllergies);
      }
    } else {
      // Handle other allergies
      const updatedAllergies = formData.allergies.includes(name)
        ? formData.allergies.filter((item) => item !== name)
        : [...formData.allergies, name];
      handleInputChange("allergies", updatedAllergies);
    }
  };

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    handleInputChange("otherAllergies", value);

    // Update the allergies array if the textarea's content is already selected
    if (formData.allergies.includes(formData.otherAllergies)) {
      const updatedAllergies = formData.allergies.map((item) =>
        item === formData.otherAllergies ? value : item
      );
      handleInputChange("allergies", updatedAllergies);
    }
  };

  const progressPercentage = (nmscreen / 7) * 100; // Adjust based on your total screens

  return (
    <div id="screen4" className="screen4">
      <h1 className="title">
        Do you have any of the following allergies or intolerances?
      </h1>
      <div className="answer-container">
        <h4
          className={
            formData.allergies.includes(
              "No, I don't have allergies issues"
            )
              ? "answer-card active"
              : "answer-card"
          }
          onClick={() =>
            handleDivClick(8, "No, I don't have allergies issues")
          }
        >
          No, I don't have allergies issues
        </h4>
        {answerContent.map((answer) => (
          <div
            key={answer.id}
            className={
              formData.allergies.includes(answer.name)
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
            formData.allergies.includes(formData.otherAllergies)
              ? "answer-card active"
              : "answer-card"
          }
          onClick={() =>
            handleDivClick(
              9,
              "I experience other chronic conditions not listed here."
            )
          }
        >
          <h4>I experience other chronic conditions not listed here.</h4>
          <textarea
            name="#"
            id="other-answer"
            placeholder="Please specify if comfortable"
            value={formData.otherAllergies}
            onChange={handleTextareaChange}
          ></textarea>
        </div>
      </div>
      <Buttons
        changeScreen={screen}
        back={"screen3"}
        next={"screen5"}
        nb={3}
        nn={5}
      />
    </div>
  );
};

export default ScreenFour;
