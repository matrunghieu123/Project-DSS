import React from 'react';
import './UserProfile.css';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space, notification } from 'antd';

const UserProfile = () => {
  const openNotification = () => {
    notification.open({
      message: 'Thông báo',
      description: 'Bạn vừa nhấn vào thẻ UserProfile!',
    });
  };

  return (
    <div className="user-profile" onClick={openNotification}>
      <div className="avatar-container">
        <div className="avatar-profile">
          <Space wrap size={16}>
            <Avatar size={43} icon={<UserOutlined />} />
          </Space>
          <span className="status-indicator"></span>
        </div>
      </div>
      <div className="user-info">
        <span className="username">NV1</span>
        <span className="email">ngactt@callcenter.vn</span>
      </div>
    </div>
  );
};

export default UserProfile;
