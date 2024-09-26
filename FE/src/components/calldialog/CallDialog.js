import React, { useState } from 'react';
import { Button, Input, Tooltip } from 'antd';
import { CustomerServiceOutlined, CloseOutlined, RightOutlined } from '@ant-design/icons';
import './CallDialog.css';

const CallDialog = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Tooltip title="Gọi điện">
        <Button
          type="primary"
          icon={<CustomerServiceOutlined />}
          onClick={showModal}
          size="large"
          style={{
            position: 'fixed',
            right: 30,
            bottom: 30,
            height: 55,
            width: 55,
            borderRadius: '10px',
          }}
        />
      </Tooltip>

      {/* Modal */}
      {isModalVisible && (
        <div
          style={{
            position: 'fixed',
            right: 19,
            top: '3.5%',
            height: '94vh',
            width: 327,
            zIndex: 1000,
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Nút đóng */}
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={handleCancel}
            style={{
              top: 0,
              left: -30,
              position: 'absolute',
            }}
          />

          {/* Nội dung của modal */}
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', height: '100%' }}>
            {/* Phần trên cùng */}
            <div 
              style={{ 
                cursor: 'pointer',
                height: '75px',
                display: 'flex',
                padding: '16px 24px',
                alignItems: 'center',
                borderBottom: '1px solid rgba(0, 177, 255, 0.1)',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>02854026336</h3>
                <img
                  src="" // Thêm URL của logo SPT vào đây
                  alt="SPT"
                />
              </div>
              <Button
                type="text"
                icon={<RightOutlined />}
                style={{
                  fontSize: '16px',
                  color: '#000',
                }}
              />
            </div>

            {/* Phần giữa */}
            <div 
              style={{ 
                gap: '16px',
                flex: 1,
                display: 'flex',
                padding: '16px 0',
                borderBottom: '1px solid rgba(0, 177, 255, 0.1)',
                flexDirection: 'column', 
              }}
            >
            </div>

            {/* Phần dưới */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
              }}
            >
              <Input
                bordered={false}
                placeholder="Nhập số điện thoại"
                style={{ 
                  width: '100%', 
                  fontSize: 24,
                  height: 70, // Giữ chiều cao ban đầu
                  lineHeight: '1.2', // Đặt lại line-height
                  padding: '8px 10px', // Điều chỉnh padding cho phù hợp
                }}
                className="custom-input"
              />
              <Button
                type="primary"
                shape="square"
                icon={<CustomerServiceOutlined />}
                size="large"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CallDialog;
