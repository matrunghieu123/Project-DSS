import React, { useEffect } from 'react';
import './ChatRoomHeader.css';
import NotificationIcon from './notification/NotificationIcon';
import UserProfile from './user/UserProfile';
import NavBar from './navbar/NavBar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import InfoPanel from './inforitem/InfoPanel';

const Header = () => {
  useEffect(() => {
    const handleResize = () => {
      const logo = document.getElementById('main-logo');
      if (window.innerWidth <= 480) {
        logo.src = 'https://cdn.omicrm.com/web/agency/omi/logo/small.png';
      } else {
        logo.src = 'https://cdn.omicrm.com/web/agency/omi/logo/logo_header.png';
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial logo src based on the current window size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="header">
        <div className="logo-container">
            <a 
                className='jss2375-mix'
                href="/dashboard/workflow-management"
                aria-label='Trang chủ'
            >
                <img 
                    id="main-logo"
                    className='main-logo'
                    src="https://cdn.omicrm.com/web/agency/omi/logo/logo_header.png"
                    alt="OMICall Logo" 
                />
            </a>
            <div className="nav">
                <NavBar />
            </div>
        </div>
        <div className="user-section">
            <div className="notification">
                <div style={{ padding: "10px" }}>
                    <NotificationIcon />
                </div>
            </div>
            <div className="user">
                <div className="user-profile">
                    <UserProfile />
                </div>
            </div>
            <div className="user-status">
                <div className='info-item'>
                    <InfoPanel />
                </div>
            </div>
            <div 
                className="logout-section"
                onMouseEnter={(e) => e.currentTarget.querySelector('.logout-tooltip').style.display = 'block'}
                onMouseLeave={(e) => e.currentTarget.querySelector('.logout-tooltip').style.display = 'none'}
                onClick={() => console.log("Đăng xuất")}
            >
                <i className="logout-icon fas fa-sign-out-alt"></i> 
                <div className="logout-tooltip">Đăng xuất</div>
            </div>
        </div>
    </header>
  );
};

export default Header;
