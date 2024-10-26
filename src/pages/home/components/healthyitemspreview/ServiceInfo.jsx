import {React, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrayOfServicesInfo } from "./ArrayOfServicesInfo";
import ServiceInfoContent from "./ServiceInfoContent";
import "./serviceinfo.css";

function ServiceInfo() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1012,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
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
  };

  //title animation
  const titleRef = useRef(null); // Reference for the title element

  useEffect(() => {
    const titleElement = titleRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // Add the class when it's in view
          } else {
            entry.target.classList.remove('visible'); // Optionally remove the class when it's out of view
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (titleElement) {
      observer.observe(titleElement); // Observe the title
    }

    return () => {
      if (titleElement) {
        observer.unobserve(titleElement); // Cleanup observer on unmount
      }
    };
  }, []);

  return (
    <div className="service-info-section">
      <h1 className="service-info-title" ref={titleRef}>Some Information About Our Services</h1>
      <Slider {...settings}>
        {ArrayOfServicesInfo.map((service, index) => (
          <div key={index} className="carousel-item-wrapper">
            <ServiceInfoContent
              imgUrl={service.imgUrl}
              title={service.title}
              description={service.description}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ServiceInfo;
