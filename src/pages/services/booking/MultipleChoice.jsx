// MultipleChoice.jsx
import React, { useState } from 'react';

function MultipleChoice({ charge }) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    charge(selectedValue); // Call the charge function passed from the Booking component
  };

  return (
    <div className='multiple-choice'>
      <select value={selectedOption} onChange={handleSelectChange}>
        <option value="">Select an Option</option>
        <option value="option1">First Consultation</option>
        <option value="option2">1st MONTH - INITIAL PACK</option>
        <option value="option3">Fortnightly Pack</option>
        <option value="option4">Weekly Tune-Up Consultation</option>
        <option value="option5">6 - MONTH PACKAGE</option>
        <option value="option6">Personalized Workout and Nutrition Plan</option>
      </select>
    </div>
  );
}

export default MultipleChoice;