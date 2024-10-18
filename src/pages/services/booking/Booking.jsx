// Booking.jsx
import { useState } from "react";
import MultipleChoice from "./MultipleChoice";
import "./booking.css"
import Payment from "./payment/PaymentSection";
import AppointmentScheduler from "./appointmentscheduler/AppointmentScheduler ";

const Booking = () => {
  const [priceOfProgram, setPriceOfProgram] = useState(null);
  const [typeOfConsultation, setTypeOfConsultation] = useState(null)

  const handlePriceOfProgram = (option) => {
    switch (option) {
      case "option1": setPriceOfProgram(50); setTypeOfConsultation("First Consultation"); break;
      case "option2": setPriceOfProgram(150); setTypeOfConsultation("1st MONTH - INITIAL PACK"); break;
      case "option3": setPriceOfProgram(70); setTypeOfConsultation("Fortnightly Pack"); break;
      case "option4": setPriceOfProgram(40); setTypeOfConsultation("Weekly Tune-Up Consultation"); break;
      case "option5": setPriceOfProgram(450); setTypeOfConsultation("6 - MONTH PACKAGE"); break;
      case "option6": setPriceOfProgram(75); setTypeOfConsultation("Personalized Workout and Nutrition Plan"); break;
      default: setPriceOfProgram(null);setTypeOfConsultation(null);// Reset to null if no option is selected
    }
  };

  // passing items for schedule 
  const [selectedTime, setSelectedTime] = useState(null);

  const handleTimeSelect = (timeSlot) => {
    setSelectedTime(timeSlot);
    // You can also add additional logic here, such as sending the selected time to a server or storing it in a state management system
  };

  // passing the day we want to capture
  const [selectedDay, setSelectedDay] = useState(null)
  const handleSelectedDay = (fullDay) =>{
    setSelectedDay(fullDay)
  }
  return (
    <div className="booking">
      <AppointmentScheduler />
    </div>
  );
};

export default Booking;
