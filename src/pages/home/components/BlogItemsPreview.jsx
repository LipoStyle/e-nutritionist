import React, { useEffect, useState, useMemo } from 'react';
import Slider from "react-slick";
import { Link } from 'react-router-dom';
import "./blogitempreview.css";

const API_BASE_URL = 'https://e-nutritionist-08e05a1c6652.herokuapp.com';

const BlogItemsPreview = () => {
  const url = API_BASE_URL;
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const settings = useMemo(() => ({
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
          dots: true,
        },
      },
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
        breakpoint: 500,
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
      <h2 className='title'>Delve into Our Latest Articles and Discover New Perspectives</h2>
      <Slider {...settings}>
        {blogs.map((blog) => (
          <div className='blog-items-container-outer' key={blog.id}>
            <div className='blog-items-container-inner'>
              <img 
                src={`${url}/${blog.img_url}`} 
                alt={`${blog.title}`} 
                loading="lazy" 
              />
              <h3>{blog.title}</h3>
              <p>{blog.description}</p>
              <Link to="/blogs">Go To Blogs</Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BlogItemsPreview;
