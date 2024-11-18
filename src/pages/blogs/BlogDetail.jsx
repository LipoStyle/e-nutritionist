import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { sanitizeHtml } from '../../components/usefullfunctions/sanitizeHtml';

import OtherPost from "../../components/posts/otherpost/OtherPost"

import imgBackground from "../../images/home-images/hero-section/background.jpg"
import BlogPost from './blogpost/BlogPost';

const API_BASE_URL = 'https://e-nutritionist-08e05a1c6652.herokuapp.com';

const BlogDetail = () => {
  // const url = API_BASE_URL;

  // const { slug } = useParams();
  // const [blog, setBlog] = useState(null);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   if (slug) {
  //     fetch(`${url}/blogs/${slug}`)
  //       .then(response => {
  //         if (!response.ok) {
  //           throw new Error('Network response was not ok');
  //         }
  //         return response.json();
  //       })
  //       .then(data => setBlog(data))
  //       .catch(error => setError(error));
  //   }
  // }, [slug]);

  // const shareUrl = `${window.location.href}`; // Current URL of the blog

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  // if (!blog) {
  //   return <div>Loading...</div>;
  // }

  return (
      <div className='blog-page-container'>
        <h1 className='image-background'></h1>
        <article className="blog-post-container">
          {/* <section dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }} />  */}
          <section className="cookies-policy">
            <BlogPost />
          </section>
          <aside>
            <OtherPost />
          </aside>
        </article>
      </div>
  );
};

export default BlogDetail;
