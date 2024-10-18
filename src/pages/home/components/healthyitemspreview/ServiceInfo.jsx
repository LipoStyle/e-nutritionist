import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrayOfServicesInfo } from "./ArrayOfServicesInfo";
import ServiceInfoContent from "./ServiceInfoContent";
import "./serviceinfo.css";

function ServiceInfo() {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    infinite: true,
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

  return (
    <div className="carusel-section">
      <h1 className="service-info-title">Some Information About Our Services</h1>
      <Slider {...settings}>
        {ArrayOfServicesInfo.map((service, index) => (
          <div key={index}>
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
