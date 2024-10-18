import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { sanitizeHtml } from '../../components/usefullfunctions/sanitizeHtml';
import "./singleblogstyle.css";

const API_BASE_URL = 'https://e-nutritionist-08e05a1c6652.herokuapp.com';

const BlogDetail = () => {
  const url = API_BASE_URL;

  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetch(`${url}/blogs/${slug}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => setBlog(data))
        .catch(error => setError(error));
    }
  }, [slug]);

  const shareUrl = `${window.location.href}`; // Current URL of the blog

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className='blog-detail-background'>
      {/* Sharing Links */}
      <aside className="floating-share">
        <h4>Share this blog</h4>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
        <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=Check out this article`} target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </aside>

      {/* Blog Content */}
      <article className="blog-detail">
        <section dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }} /> {/* Section used for the article content */}
      </article>
    </div>
  );
};

export default BlogDetail;
