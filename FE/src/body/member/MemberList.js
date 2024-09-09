import React from 'react';
import { Typography } from 'antd';
import './MemberList.css';

// Hàm formatDate để định dạng thời gian
const formatDate = (timestamp) => {
    if (!timestamp) return "Không có thời gian";
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Thời gian không hợp lệ";
    
    // Định dạng thời gian theo giờ và phút
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MemberList = ({ privateChats, setTab, tab }) => {
    const getLastMessageTime = (name) => {
        const chat = privateChats.get(name);
        if (chat && chat.length > 0) {
            const lastMessage = chat[chat.length - 1];
            const timestamp = lastMessage.timestamp;

            // Sử dụng hàm formatDate để định dạng thời gian
            return formatDate(timestamp);
        }
        return "Không có tin nhắn";
    };

    return (
        <div className="member-list">
            <ul>
                {[...privateChats.keys()].map((name, index) => (
                    <li
                        onClick={() => setTab(name)}
                        className={`member ${tab === name ? "active" : ""}`}
                        key={index}
                    >
                        <div className="member-item">
                            {/* Avatar */}
                            <div className="avatar-member-list">
                                <Typography.Text>{name.charAt(0).toUpperCase()}</Typography.Text>
                            </div>

                            {/* Thông tin thành viên */}
                            <div className="member-info">
                                <Typography.Text className="member-name">
                                    {name}
                                </Typography.Text>
                                <Typography.Text className="member-time">
                                    {getLastMessageTime(name)}
                                </Typography.Text>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MemberList;
