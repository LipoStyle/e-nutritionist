import React from 'react';
import GreetingSection from './components/GreetingSection';
import HealthyItemsPreview from './components/HealthyItemsPreview';
import ServicesPreview from './components/ServicesPreview';
import BlogItemsPreview from './components/BlogItemsPreview';
import BMICalculator from './components/BMICalculator';

const Home = () => {
  return (
    <div className='home'>
      <GreetingSection />
      <HealthyItemsPreview />
      <ServicesPreview />
      <BlogItemsPreview />
      {/* <BMICalculator /> */}
    </div>
  );
};

export default Home;
