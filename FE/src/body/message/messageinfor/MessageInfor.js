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
                {/* Ảnh đại diện và thông tin người dùng */}
                <Col xs={6} sm={4} md={3} lg={2}>
                    <Avatar size={40} style={{ fontSize: 14, backgroundColor: '#87d068' }}>HT</Avatar>
                </Col>
                <Col xs={12} sm={10} md={8} lg={6}>
                    <Text strong>Trung Hiếu</Text><br />
                    <Text type="secondary">0983003306</Text>
                </Col>
                {/* Nút liên kết và biểu tượng */}
                <Col xs={24} sm={8} md={8} lg={6} style={{ textAlign: 'right' }}>
                    <Button icon={<LinkOutlined />} size="middle" type="primary">Liên kết</Button>
                </Col>
            </Row>
        </div>
    );
};

export default MessageInfor;
