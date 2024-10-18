import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./blog.css";
import backgroundImage from "../../images/blogimages/blogBackground.jpg";

const API_BASE_URL = 'https://e-nutritionist-08e05a1c6652.herokuapp.com/'; 
const API_Local_Host = "http://localhost:3000"


const Blogs = () => {

  const url = API_BASE_URL;

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch(`${url}/blogs`) 
      .then(response => response.json())
      .then(data => setBlogs(data));
  }, []);

  return (
    <div className='blogs'>
      <h1 className='title'>Blogs</h1>
      <ul className='blog-container'>
        {blogs.map(blog => (
          <li key={blog.id} className='blog'>
            <img src={`${url}/${blog.img_url}`} alt="test" className='blog-image'/>
            <h2 className='blog-title'>{blog.title}</h2>
            <p className='blog-description'>{blog.description}</p>
            <Link to={`/blogs/${blog.slug}`} className='blog-a'>Read More</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blogs;
