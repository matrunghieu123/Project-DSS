import React, { useState, useEffect } from 'react';
import './ImageMessage.css';

const ImageMessage = ({ src, alt }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height
      });
    };
    img.src = src;
  }, [src]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getImageStyle = () => {
    const maxWidth = 300; // Độ rộng tối đa của ảnh
    const maxHeight = 200; // Chiều cao tối đa của ảnh
    let { width, height } = imageDimensions;

    // Kiểm tra kích thước thực tế của ảnh trước khi áp dụng
    if (width > maxWidth) {
      const ratio = maxWidth / width;
      width = maxWidth;
      height *= ratio;
    }

    if (height > maxHeight) {
      const ratio = maxHeight / height;
      height = maxHeight;
      width *= ratio;
    }

    return {
      width: `${width}px`,
      height: `${height}px`,
      transition: 'all 0.3s ease' // Thêm hiệu ứng chuyển đổi mượt mà
    };
  };

  return (
    <div 
      className={`image-message ${isExpanded ? 'expanded' : ''}`} 
      onClick={toggleExpand} 
      role="button" 
      aria-label="Expand image" 
      tabIndex={0}
      style={{ cursor: 'pointer' }} // Thêm con trỏ chỉ tay khi hover vào ảnh
    >
      <img 
        src={src} 
        alt={alt || 'Image message'} // Đảm bảo alt không bị rỗng
        className="message-image" 
        style={isExpanded ? { width: '100%', height: 'auto', transition: 'all 0.3s ease' } : getImageStyle()}
      />
    </div>
  );
};

export default ImageMessage;
