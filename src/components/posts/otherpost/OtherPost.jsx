import React from "react";
import "./otherPost.css"

import img from "../../../images/home-images/hero-section/background.jpg"

const OtherPost = () => {
  return(
    <aside className="other-post">
      <h2 className="title-of-aside">Other Posts</h2>
      <div className="posts">
        <img src={img} alt="image-of-the-post" className="img-of-post"/>
        <h4 className="title-of-other-post">B12 Supplementation for Vegans and Vegetarians: Essential Information and Sources</h4>
      </div>
      <div className="posts">
        <img src="#" alt="image-of-the-post" className="img-of-post"/>
        <h4 className="title-of-other-post">test</h4>
      </div>
      <div className="posts">
        <img src="#" alt="image-of-the-post" className="img-of-post"/>
        <h4 className="title-of-other-post">test</h4>
      </div>
      <div className="posts">
        <img src="#" alt="image-of-the-post" className="img-of-post"/>
        <h4 className="title-of-other-post">test</h4>
      </div>
      <div className="posts">
        <img src="#" alt="image-of-the-post" className="img-of-post"/>
        <h4 className="title-of-other-post">test</h4>
      </div>
    </aside>
  )
}

export default OtherPost;