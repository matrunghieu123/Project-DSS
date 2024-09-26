import React from 'react';
import { Typography, Avatar, List } from 'antd';
import './MemberList.css';

// Hàm formatDate để định dạng thời gian
const formatDate = (time) => {
    if (!time) return "Không có thời gian";
    
    // Kiểm tra nếu time là một chuỗi thời gian đầy đủ
    const date = new Date(time);
    if (isNaN(date.getTime())) {
        // Nếu time chỉ là giờ và phút, thêm ngày mặc định
        const dateWithDefaultDay = new Date(`1970-01-01T${time}Z`);
        if (isNaN(dateWithDefaultDay.getTime())) return "Thời gian không hợp lệ";
        return dateWithDefaultDay.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Định dạng thời gian theo giờ và phút
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MemberList = ({ privateChats, setTab, tab }) => {
    // Hàm để lấy avatar
    const getAvatar = (name) => {
        // Lấy URL từ database hoặc API
        return `https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-2-1.jpg`;
    };

    const getLastMessageTime = (name) => {
        const chat = privateChats.get(name);
        if (chat && chat.length > 0) {
            const lastMessage = chat[chat.length - 1];
            const time = lastMessage.time; // Sử dụng thuộc tính time

            // Sử dụng hàm formatDate để định dạng thời gian
            return formatDate(time);
        }
        return "Không có tin nhắn";
    };

    return (
        <div className="member-list">
            <List
                dataSource={[...privateChats.keys()]}
                renderItem={(name) => (
                    <List.Item
                        onClick={() => setTab(name)}
                        className={`member ${tab === name ? "active" : ""}`}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={getAvatar(name)} />}
                            title={<Typography.Text className="member-name">{name}</Typography.Text>}
                            description={<Typography.Text className="member-time">{getLastMessageTime(name)}</Typography.Text>}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default MemberList;
