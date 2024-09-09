import React from 'react';
import './NotificationIcon.css';

const NotificationIcon = () => {
  return (
    <div className="notification-navbar">
      <div className="notification-icon-container">
        <button className="notification-item">
          <i className="fa fa-bell notification-icons"></i>
          <span className="MuiTypography-caption">Thông báo</span>
        </button>
      </div>

      <div className="notification-icon-container">
        <button className="notification-item">
          <i className="fa fa-question-circle notification-icons"></i>
          <span className="MuiTypography-caption">Công cụ</span>
        </button>
      </div>

      <div className="notification-icon-container">
        <button className="notification-item">
          <i className="fa fa-comments notification-icons"></i>
          <span className="MuiTypography-caption">Hỗ trợ</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationIcon;
