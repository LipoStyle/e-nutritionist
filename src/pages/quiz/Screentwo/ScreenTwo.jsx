import React, { useState } from 'react';
import image from '../../../images/quizImages/2.svg';
import InputField from '../InputField';
import Buttons from '../Buttons';
import ProgressBar from '../ProgressBar';
import './screentwo.css';

const ScreenTwo = ({ screen, nmscreen, formData, handleInputChange }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextScreen = () => {
    if (validateForm()) {
      screen('screen3');
    }
  };

  const getInputClass = (field) => (errors[field] ? 'invalid' : '');

  return (
    <div id="screen2" className="screen">
      <h1 className="title">
        First we are going to need some of your personal information
      </h1>
      <p className="message">
        Don’t worry everything will be kept anonymous and it is in safe hands!
      </p>
      <div className="contact-details">
        <InputField
          className={`name ${getInputClass('name')}`}
          type="text"
          name="Name"
          value={formData.name}
          placeHolderMessage="ex. Manuel Aguires"
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
        {errors.name && <p className="error-message visible">{errors.name}</p>}

        <InputField
          className={`mail ${getInputClass('email')}`}
          type="text"
          name="Mail"
          value={formData.email}
          placeHolderMessage="ex. youremail@gmail.com"
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
        {errors.email && <p className="error-message visible">{errors.email}</p>}

        <InputField
          className={`phone-number ${getInputClass('phone')}`}
          type="tel"
          name="PhoneNumber"
          value={formData.phone}
          placeHolderMessage="ex. +(34) 6548752146"
          onChange={(e) => handleInputChange('phone', e.target.value)}
        />
        {errors.phone && (
          <p className="error-message visible">{errors.phone}</p>
        )}

        <InputField
          className={`gender ${getInputClass('gender')}`}
          type="text"
          name="Gender"
          value={formData.gender}
          placeHolderMessage="Male / Female"
          onChange={(e) => handleInputChange('gender', e.target.value)}
        />
        {errors.gender && (
          <p className="error-message visible">{errors.gender}</p>
        )}
      </div>
      <Buttons
        changeScreen={screen}
        back={'screen1'}
        next={handleNextScreen}
        nb={1}
        nn={3}
      />
      <div className="graph">
        <img src={image} alt="image" />
      </div>
    </div>
  );
};

export default ScreenTwo;
