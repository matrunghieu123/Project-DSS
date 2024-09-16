import React from 'react';
import { Avatar, Button, Row, Col, Typography } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import './MessageInfor.css';

const { Text } = Typography;

const MessageInfor = () => {
    return (
        <div className='top-chat'>
            <Row 
                align="middle" 
                justify="space-between"
                gutter={[16, 16]}
            >
                {/* Phần avatar và tên */}
                <Col xs={18} sm={14} md={11} lg={8}>
                    <div className="avatar-section">
                        <Avatar size={40} style={{ fontSize: 14, backgroundColor: '#87d068' }}>HT</Avatar>
                        <div style={{ marginLeft: '10px' }}>
                            <Text strong>Trung Hiếu</Text><br />
                            <Text type="secondary">0983003306</Text>
                        </div>
                    </div>
                </Col>
                {/* Phần nút liên kết */}
                <Col xs={6} sm={10} md={8} lg={6} className="link-section">
                    <Button icon={<LinkOutlined />} size="middle" type="primary">Liên kết</Button>
                </Col>
            </Row>
        </div>
    );
};

export default MessageInfor;
