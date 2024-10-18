import React, { useState } from 'react';
import './bmicalculator.css';

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBMI] = useState(null);
  const [message, setMessage] = useState('');

  const calculateBMI = (e) => {
    e.preventDefault();

    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setBMI(bmiValue);

      if (bmiValue < 18.5) {
        setMessage('You are underweight.');
      } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
        setMessage('You have a normal weight.');
      } else if (bmiValue >= 25 && bmiValue < 29.9) {
        setMessage('You are overweight.');
      } else {
        setMessage('You are obese.');
      }
    } else {
      setMessage('Please enter valid weight and height.');
    }
  };

  return (
    <div className="bmi-calculator">
      <div className='background'></div> {/* Background only for this section */}
      <div className='calculator-content'>
        <div className='calculator-text'>
          <h2>This is a message as a second heder for calculator quote</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur modi ipsam voluptate exercitationem eum perferendis sed expedita odio quasi dolorum libero aut, reiciendis, iusto velit molestiae repellat dolor nostrum nam?</p>
        </div>
        <div className='calculator-container'>
        <h2>Calculate Your BMI</h2>
        <p>Find out your Body Mass Index and take the first step towards a healthier you!</p>
        <form onSubmit={calculateBMI}>
          <div className="input-group">
            <label htmlFor="weight">Weight (kg):</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
            />
          </div>
          <div className="input-group">
            <label htmlFor="height">Height (cm):</label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter your height"
            />
          </div>
          <button type="submit">Calculate BMI</button>
        </form>
        {bmi && (
          <div className="result">
            <h2>Your BMI: {bmi}</h2>
            <p>{message}</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default BMICalculator;
