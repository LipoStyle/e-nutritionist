import { useState, useEffect } from "react";
import Buttons from "../Buttons";
import "./screensix.css";
import ProgressBar from "../ProgressBar";

const ScreenSix = ({
  screen,
  nmscreen,
  formData,
  handleInputChange,
  submitData,
}) => {
  const [clicked, setClicked] = useState(false);
  const [customerMessage, setCustomerMessage] = useState(
    formData.customerMessage || ""
  );
  const [consultationFrequency, setConsultationFrequency] = useState(
    formData.consultationFrequency || null
  );

  useEffect(() => {
    setCustomerMessage(formData.customerMessage || "");
    setConsultationFrequency(formData.consultationFrequency || null);
  }, [formData]);

  const handleMeetingClick = (num) => {
    setConsultationFrequency(num);
    handleInputChange("consultationFrequency", num); // Ensure correct state update
  };

  const handleCustomerMessageChange = (e) => {
    setCustomerMessage(e.target.value);
    handleInputChange("customerMessage", e.target.value);
  };

  const handleNext = () => {
    console.log("FormData before submission:", formData); // Check formData
    submitData(formData); // Pass collected form data to the submitData function
    setTimeout(() => {
      screen("screen7", 7); // Navigate to screen7 after submission
    }, 1000); // Adjust timing as needed for your submission process
  };

  return (
    <div id="screen6">
      <div className="section1">
        <h1 className="title">
          What are you hoping to achieve with our service?
        </h1>
        <textarea
          name="answer"
          id="answer-screen6"
          className={clicked ? "clicked" : ""}
          placeholder="Enter your message here.."
          onClick={() => {
            setClicked(true);
          }}
          value={customerMessage}
          onChange={handleCustomerMessageChange}
        ></textarea>
      </div>
      <div className="section2">
        <h1 className="title">How many meetings per month would you like to have?</h1>
        <div className="buttons-of-input">
          <p
            className={consultationFrequency === 1 ? "clicked" : ""}
            onClick={() => handleMeetingClick(1)}
          >
            1
          </p>
          <p
            className={consultationFrequency === 2 ? "clicked" : ""}
            onClick={() => handleMeetingClick(2)}
          >
            2-3
          </p>
          <p
            className={consultationFrequency === 3 ? "clicked" : ""}
            onClick={() => handleMeetingClick(3)}
          >
            4
          </p>
        </div>
      </div>
      <Buttons
        changeScreen={screen}
        back={"screen5"}
        next={handleNext}
        nb={5}
        nn={7}
      />
    </div>
  );
};

export default ScreenSix;
