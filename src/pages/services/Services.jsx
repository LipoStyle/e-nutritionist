import React, { useState, useEffect } from 'react';
import GetInTouchComponent from "./getintouchcomponent/GetInTouchComponent";
import "./service.css";
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://e-nutritionist-08e05a1c6652.herokuapp.com'; 
const API_Local_Host = "http://localhost:3000"


const Services = () => {

  const url = API_BASE_URL;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    fetch(`${url}/services.json`)  // Adjust the URL as needed
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching services:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading services: {error.message}</p>;

  return (
    <div className='services'>
      <div className="background-image"></div>
      <h1 className="title-service-page">Choose the Best Plan For You</h1>
      <div className='grid-container'>
        {services.length > 0 ? services.map(service => (
          <div className='service-plan' key={service.id}>
            <h2 className="title-of-plan">{service.title}</h2>
            <p className="price-of-plan">{Math.floor(service.price)} <em>€</em></p>
            <div className="features-of-plan">
              {service.features && service.features.length > 0 ? (
                service.features.map((feature, index) => (
                  <p className='feature' key={feature.id}>{feature.name}</p>
                ))
              ) : (
                <p>No features available</p>
              )}
            </div>
            <p className="explainable-question">Why should you pick this program?</p>
            <p className="description-of-plan">{service.description2}</p>
            <Link to="/booking" className='button'>Book Now</Link>
          </div>
        )) : (
          <p>No services available</p>
        )}
      </div>
      <GetInTouchComponent />
    </div>
  );
};

export default Services;
