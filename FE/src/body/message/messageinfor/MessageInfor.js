import React, { useState } from 'react';
import { Avatar, Button, Typography } from 'antd';
import { UserAddOutlined, SolutionOutlined, PhoneOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons';
import Ticket from './ticket/Ticket';
import './MessageInfor.css';

const { Text } = Typography;

const MessageInfor = ({ currentCustomer }) => {
    const [visible, setVisible] = useState(false);

    const getInitials = (name) => {
        const nameParts = name.split(' ');
        const initials = nameParts.map(part => part[0]).join('');
        return initials.toUpperCase();
    };

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    return (
        <div className='top-chat'>
            <div className="avatar-section">
                <div className="avatar-info">
                    <Avatar size={40} style={{ fontSize: 14, backgroundColor: currentCustomer.color || '#f56a00' }}>
                        {getInitials(currentCustomer.name)}
                    </Avatar>
                    <div className="info">
                        <Text strong>{currentCustomer.name}</Text><br />
                        <Text type="secondary">Không có số điện thoại</Text>
                    </div>
                </div>
                <div className="icons">
                    <Button icon={<UserAddOutlined />} size="middle" type="text" />
                    <Button icon={<SolutionOutlined />} size="middle" type="text" onClick={showDrawer} /> {/* Thêm sự kiện onClick */}
                    <Button icon={<PhoneOutlined />} size="middle" type="text" />
                    <Button icon={<MailOutlined />} size="middle" type="text" />
                    <Button icon={<MessageOutlined />} size="middle" type="text" />
                </div>
            </div>
            <div className="link-section">
                <Avatar size={40} style={{ fontSize: 14, backgroundColor: '#1890ff' }}>U</Avatar>
                <div style={{ marginLeft: '10px' }}>
                    <Text strong>Tên BOT</Text>
                </div>
            </div>
            <Ticket visible={visible} onClose={onClose} />
        </div>
    );
};

export default MessageInfor;