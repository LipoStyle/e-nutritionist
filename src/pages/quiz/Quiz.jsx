import { useState } from "react";
import ScreenOne from "./Screenone/ScreenOne";
import ScreenTwo from "./Screentwo/ScreenTwo";
import ScreenThree from "./Screenthree/ScreenThree";
import ScreenFour from "./Screenfour/ScreenFour";
import ScreenFive from "./Screenfive/ScreenFive";
import ScreenSix from "./Screensix/ScreenSix";
import ScreenSeven from "./Screenseven/ScreenSeven";
import "./quiz.css";

const API_BASE_URL = 'https://e-nutritionist-08e05a1c6652.herokuapp.com/'; 
const API_Local_Host = "http://localhost:3000"


const Quiz = () => {
  
  const url = API_BASE_URL;

  const [screen, setScreen] = useState("screen1");
  const [numberOfCurrentScreen, setNumberOfCurrentScreen] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    healthProblems: [],
    otherConditions: "",
    allergies: [],
    otherAllergies: "",
    primaryGoal: null,
    otherPrimaryGoal: "",
    customerMessage: "",
    consultationFrequency: null
  });

  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const changeScreen = (screen, number) => {
    setScreen(screen);
    setNumberOfCurrentScreen(number);
    window.scrollTo(0, 0);
  };



  const submitData = async () => {
   const sentItem = {
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone,
      gender: formData.gender,
      health_conditions: formData.healthProblems,
      allergies: formData.allergies,
      primaryGoal: formData.primaryGoal,
      customerMessage: formData.customerMessage,
      consultationFrequency: formData.consultationFrequency
    }
    try {
      const response = await fetch(`${url}/quiz_customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quiz_customer: sentItem }),
      });
  
      if (!response.ok) {
        if (response.status === 422) {
          const errorData = await response.json();
          console.error("Validation errors:", errorData);
          alert("Failed to create customer: " + JSON.stringify(errorData));
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } else {
        const result = await response.json();
        console.log("Data submitted successfully:", result);
        alert("Customer created successfully!");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred. Please try again.");
    }
    console.log(sentItem)
  };
  
  
  

  const totalScreens = 7; // total number of screens
  const progressPercentage = (numberOfCurrentScreen / totalScreens) * 100;

  return (
    <>
      <div className="progress-background">
        <div className="progress-container">
          <div className="progress-bar-background">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}>
              {numberOfCurrentScreen} / {totalScreens}
            </div>
          </div>
        </div>
      </div>
      {screen === "screen1" && (
        <ScreenOne screen={changeScreen} nmscreen={numberOfCurrentScreen} />
      )}
      {screen === "screen2" && (
        <ScreenTwo
          screen={changeScreen}
          nmscreen={numberOfCurrentScreen}
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}
      {screen === "screen3" && (
        <ScreenThree
          screen={changeScreen}
          nmscreen={numberOfCurrentScreen}
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}
      {screen === "screen4" && (
        <ScreenFour
          screen={changeScreen}
          nmscreen={numberOfCurrentScreen}
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}
      {screen === "screen5" && (
        <ScreenFive
          screen={changeScreen}
          nmscreen={numberOfCurrentScreen}
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}
      {screen === "screen6" && (
        <ScreenSix
          screen={changeScreen}
          nmscreen={numberOfCurrentScreen}
          formData={formData}
          handleInputChange={handleInputChange}
          submitData={submitData}
        />
      )}
      {screen === "screen7" && (
        <ScreenSeven />
      )}
    </>
  );
};

export default Quiz;
