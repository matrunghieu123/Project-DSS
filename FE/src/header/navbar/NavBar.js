import React, { useState } from 'react';
import './NavBar.css';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar-container">
      <div className="nav-items-container">
        {/* Hiển thị tất cả các icon khi màn hình rộng */}

        {/* Icon Phiếu ghi */}
        <div className="nav-icon-container">
          <button className="nav-item-button">
            <i className="fa fa-ticket-alt nav-icons"></i>
            <span className="nav-caption">Phiếu ghi</span>
          </button>
        </div>

        {/* Icon Khách hàng */}
        <div className="nav-icon-container">
          <button className="nav-item-button">
            <i className="fa fa-user nav-icons"></i>
            <span className="nav-caption">Khách hàng</span>
          </button>
        </div>
        
        {/* Icon OMIFlow */}
        <div className="nav-icon-container">
          <button className="nav-item-button">
            <i className="fa fa-sitemap nav-icons"></i>
            <span className="nav-caption">OMIFlow</span>
          </button>
        </div>

        {/* Icon Đa kênh */}
        <div className="nav-icon-container">
          <button className="nav-item-button" onClick={handleMenuToggle}>
            <i className="fa fa-project-diagram nav-icons"></i>
            <span className="nav-caption">Đa kênh</span>
          </button>
        </div>

        {/* Icon Tổng đài */}
        <div className="nav-icon-container">
          <button className="nav-item-button">
            <i className="fa fa-desktop nav-icons"></i>
            <span className="nav-caption">Tổng đài</span>
          </button>
        </div>
      </div>
      
      {/* Menu ẩn hiển thị khi nhấn vào Đa kênh */}
      <div className={`nav-more-menu-content ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-icon-container">
          <button className="nav-item-button">
            <i className="fa fa-ticket-alt nav-icons"></i>
            <span className="nav-caption">Phiếu ghi</span>
          </button>
        </div>
        <div className="nav-icon-container">
          <button className="nav-item-button">
            <i className="fa fa-user nav-icons"></i>
            <span className="nav-caption">Khách hàng</span>
          </button>
        </div>
        <div className="nav-icon-container">
          <button className="nav-item-button">
            <i className="fa fa-sitemap nav-icons"></i>
            <span className="nav-caption">OMIFlow</span>
          </button>
        </div>
        <div className="nav-icon-container">
          <button className="nav-item-button">
            <i className="fa fa-project-diagram nav-icons"></i>
            <span className="nav-caption">Đa kênh</span>
          </button>
        </div>
        <div className="nav-icon-container">
          <button className="nav-item-button">
            <i className="fa fa-desktop nav-icons"></i>
            <span className="nav-caption">Tổng đài</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
