import React from 'react';
import { Avatar, Button, Row, Col, Typography } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import './MessageInfor.css'

const { Text } = Typography;

const MessageInfor = () => {
    return (
        <div className='top-chat'>
            <Row 
                align="middle" 
                style={{  }}
            >
                {/* Ảnh đại diện và thông tin người dùng */}
                <Col span={2}>
                    <Avatar size={50} style={{ backgroundColor: '#87d068' }}>HT</Avatar>
                </Col>
                <Col span={10}>
                    <Text strong>Trung Hiếu</Text><br />
                    <Text type="secondary">0983003306</Text>
                </Col>
                {/* Nút liên kết và biểu tượng */}
                <Col span={8} offset={4} style={{ textAlign: 'right' }}>
                    <Button icon={<LinkOutlined />} size="middle" type="primary">Liên kết</Button>
                </Col>
            </Row>
        </div>
    );
};

export default MessageInfor;