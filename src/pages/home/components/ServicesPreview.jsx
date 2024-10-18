import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Slider from "react-slick";
import { Link } from 'react-router-dom';
import "./servicepreview.css";

const API_BASE_URL = 'https://e-nutritionist-08e05a1c6652.herokuapp.com'; 
const API_Local_Host = "http://localhost:3000"

const ServicesPreview = () => {
  const url = API_BASE_URL;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services data
  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch(`${url}/services.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Slider settings memoization
  const sliderSettings = useMemo(() => ({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }), []);

  // Display error or loading state
  if (loading) {
    return <div>Loading services...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='service-preview'>
      <div className='background'></div>
      <h2 className='title'>Explore Our Exceptional Services Designed Just for You</h2>
      <Slider {...sliderSettings}>
        {services.map((service, index) => (
          <div className='service-container-outer' key={index}>
            <div className='service-container-inner'>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <Link to="/services">Go To Service</Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ServicesPreview;
