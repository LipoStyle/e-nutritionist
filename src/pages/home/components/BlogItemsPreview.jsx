import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useInView } from 'react-intersection-observer'; // Import the hook
import Slider from "react-slick";
import { Link } from 'react-router-dom';
import "./blogitempreview.css";

const API_BASE_URL = 'https://e-nutritionist-08e05a1c6652.herokuapp.com';

const BlogItemsPreview = () => {
  const url = API_BASE_URL;
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { ref: titleRef, inView } = useInView({ threshold: 0.1 }); // Use the hook

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${url}/blogs`);
        if (!response.ok) throw new Error("Failed to fetch blogs.");
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, [url]);

  // Set heights after blogs have been fetched
  useEffect(() => {
    if (blogs.length > 0) {
      const cardHeights = document.querySelectorAll('.blog-items-container-inner');
      let maxHeight = 0;

      // Get the maximum height
      cardHeights.forEach(card => {
        maxHeight = Math.max(maxHeight, card.offsetHeight);
      });

      // Set all cards to the maximum height
      cardHeights.forEach(card => {
        card.style.height = `${maxHeight}px`;
      });
    }
  }, [blogs]);

  const settings = useMemo(() => ({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }), []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='blog-items-preview'>
      <h2 className={`animated-title ${inView ? 'animate' : ''}`} ref={titleRef}>Delve into Our Latest Articles and Discover New Perspectives</h2>
      <Slider {...settings}>
        {blogs.map((blog) => (
          <div className='blog-items-container-outer' key={blog.id}>
            <div className='blog-items-container-inner'>
              <img 
                src={`${url}/${blog.img_url}`} 
                alt={`${blog.title}`} 
                loading="lazy" 
                className='blog-image'
              />
              <h3 className='blog-title'>{blog.title}</h3>
              <p className='blog-description'>{blog.description}</p>
              <Link to="/blogs" className='blog-link'>Go To Blogs</Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BlogItemsPreview;
