import React, { useState } from 'react';
import './ImageMessage.css';

const ImageMessage = ({ src, alt }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`image-message ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpand}>
      <img src={src} alt={alt} className="message-image" />
    </div>
  );
};

export default ImageMessage;
