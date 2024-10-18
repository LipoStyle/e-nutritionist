import "./about.css";
import PointComponent from "./PointComponent";
import { pointContent } from "./pointContent";
import { useState, useEffect } from "react";

// Define your API base URL
const API_BASE_URL = 'https://e-nutritionist-08e05a1c6652.herokuapp.com';
// Uncomment this for local testing
const API_Local_Host = "http://localhost:3000";

const About = () => {
  const url = API_BASE_URL;

  const [activePoint, setActivePoint] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`${url}/images/aboutimages/image-of-me.jpg`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const imageBlob = await response.blob();
        const imageURL = URL.createObjectURL(imageBlob);
        setImageUrl(imageURL);
        setLoading(false);
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        setError(true);
        setLoading(false);
      }
    };

    fetchImage();

    // Cleanup function to revoke the object URL
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [url]); // Only depend on `url` for fetching

  const handlePointClick = (index) => {
    setActivePoint(index === activePoint ? null : index);
  };

  return (
    <div className="grid-container-about">
      <h1 className="name-of-doctor">
        Thymios Arvanitis <b className="proficient">Nutritionist</b>
      </h1>
      <h2 className="tag-quote">
        I'm Thymios Arvanitis, and I’m here to guide you on a journey to better
        health, whether it's through personalized nutrition, sports performance,
        or transformative lifestyle changes.
      </h2>
      {loading ? (
        <p>Loading image...</p>
      ) : error ? (
        <p>Error loading image</p>
      ) : (
        <img src={imageUrl} alt="my face" className="image-of-me" />
      )}

      {pointContent.map((information) => (
        <PointComponent
          key={information.id}
          title={information.title}
          description={information.description}
          active={activePoint === information.id}
          handlePoint={() => handlePointClick(information.id)}
        />
      ))}
    </div>
  );
};

export default About;
