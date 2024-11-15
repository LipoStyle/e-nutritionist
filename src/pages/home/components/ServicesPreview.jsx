import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer'; // Import the hook
import './servicepreview.css';

const API_BASE_URL = 'https://e-nutritionist-08e05a1c6652.herokuapp.com';

const ServicesPreview = () => {
  const url = API_BASE_URL;
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null); // Create a ref for the slider
  const { ref: titleRef, inView } = useInView({ threshold: 0.1 }); // Use the hook

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
  }, [url]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1040,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    }),
    []
  );
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        // Use slickGoTo to move to the next slide
        sliderRef.current.slickNext();
      }
    }, 2000); // Change slide every 1.5 seconds

    return () => {
      clearInterval(interval); // Clear the interval on component unmount
    };
  }, []);

  if (loading) {
    return <div>Loading services...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='carusel-section-services'>
      <h2 className={`animated-title ${inView ? 'animate' : ''}`} ref={titleRef}>
        Explore Our Exceptional Services Designed Just for You
      </h2>
      <Slider ref={sliderRef} {...sliderSettings}>
        {services.map((service, index) => (
          <div className='service-container-outer' key={index}>
            <div className='service-container-inner'>
              <h2 className='title-of-service'>{service.title}</h2>
              <p className='description-of-service'>{service.description}</p>
              <Link to='/services' className='go-button'>
                Go To Service
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ServicesPreview;
