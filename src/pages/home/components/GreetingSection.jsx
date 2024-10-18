import React from 'react';
import { Link } from 'react-router-dom';
import nutritionistImg from '../../../images/home-images/greeting-section/NutritionisT-768x450.jpg'; // Adjust the path as needed
import './greetingsection.css';

const GreetingSection = () => {
  return (
    <section className="greeting-section">
      <div className="text-content">
        <h1>Looking for an Online Nutritionist?</h1>
        <p>You deserve to live a happy, healthy life. Discover your unique path to wellness with our personalized nutrition quiz. Click below to begin your journey towards better health and well-being.</p>
        <Link to="/quiz" className="quiz-button" aria-label="Take our personalized nutrition quiz">Take Our Quiz</Link>
      </div>
      <div className='image-content'>
        <img src={nutritionistImg} alt="Professional online nutritionist offering personalized plans" className="nutritionist-img" />
      </div>
    </section>
  );
};

export default GreetingSection;
