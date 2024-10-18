import React from "react";
import Buttons from "../Buttons";
import "./screenthree.css";
import ProgressBar from "../ProgressBar";
import { answerContent } from "./answerContent";

const ScreenThree = ({ screen, nmscreen, formData, handleInputChange }) => {
  const handleDivClick = (id, name) => {
    if (name === "Other Conditions") {
      if (formData.healthProblems.includes(formData.otherConditions)) {
        // Remove only the textarea content if it's already included
        const updatedHealthProblems = formData.healthProblems.filter(
          (item) => item !== formData.otherConditions
        );
        handleInputChange("healthProblems", updatedHealthProblems);
      } else {
        // Add only the textarea content
        const updatedHealthProblems = [
          ...formData.healthProblems,
          formData.otherConditions,
        ];
        handleInputChange("healthProblems", updatedHealthProblems);
      }
    } else {
      // Handle other health problems
      const updatedHealthProblems = formData.healthProblems.includes(name)
        ? formData.healthProblems.filter((item) => item !== name)
        : [...formData.healthProblems, name];
      handleInputChange("healthProblems", updatedHealthProblems);
    }
  };

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    handleInputChange("otherConditions", value);

    // Update the health problems array if "Other Conditions" is active
    if (formData.healthProblems.includes(formData.otherConditions)) {
      const updatedHealthProblems = formData.healthProblems.map((item) =>
        item === formData.otherConditions ? value : item
      );
      handleInputChange("healthProblems", updatedHealthProblems);
    }
  };

  const progressPercentage = (nmscreen / 7) * 100; // Adjust based on your total screens

  return (
    <div id="screen3" className="screen3">
      <h1 className="title">
        Are you currently experiencing any health problems or have any chronic
        diseases?
      </h1>
      <div className="answer-container">
        <h4
          className={
            formData.healthProblems.includes(
              "No, I am not experiencing any health problems."
            )
              ? "answer-card active"
              : "answer-card"
          }
          onClick={() =>
            handleDivClick(
              0,
              "No, I am not experiencing any health problems."
            )
          }
        >
          No, I am not experiencing any health problems.
        </h4>
        {answerContent.map((answer) => (
          <div
            key={answer.id}
            className={
              formData.healthProblems.includes(answer.name)
                ? "answer-card active"
                : "answer-card"
            }
            onClick={() => handleDivClick(answer.id, answer.name)}
          >
            <h4>{answer.name}</h4>
            <p className="description">{answer.description}</p>
          </div>
        ))}
        <div
          className={
            formData.healthProblems.includes(formData.otherConditions)
              ? "answer-card active"
              : "answer-card"
          }
          onClick={() => handleDivClick(8, "Other Conditions")}
        >
          <h4>Other Conditions</h4>
          <textarea
            name="#"
            id="other-answer"
            placeholder="Please specify if comfortable"
            value={formData.otherConditions}
            onChange={handleTextareaChange}
          ></textarea>
        </div>
      </div>
      <Buttons
        changeScreen={screen}
        back={"screen2"}
        next={"screen4"}
        nb={2}
        nn={4}
      />
    </div>
  );
};

export default ScreenThree;
