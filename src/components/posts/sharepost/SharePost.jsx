import React from "react";
import "./sharePost.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";

const SharePost = ({ postLink }) => {
  const socialPlatforms = [
    {
      name: "Facebook",
      icon: <FaFacebookF />,
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${postLink}`,
    },
    {
      name: "Instagram",
      icon: <FaInstagram />,
      shareUrl: `https://www.instagram.com/`,
    },
    {
      name: "Twitter",
      icon: <FaTwitter />,
      shareUrl: `https://twitter.com/share?url=${postLink}&text=Check this out!`,
    },
    {
      name: "TikTok",
      icon: <FaTiktok />,
      shareUrl: `https://www.tiktok.com/`, // TikTok doesn't have direct share links.
    },
  ];

  return (
    <div className="share-post">
      <p className="share-text">Share:</p>
      <div className="share-icons">
        {socialPlatforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="share-icon"
            title={`Share on ${platform.name}`}
          >
            {platform.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SharePost;
