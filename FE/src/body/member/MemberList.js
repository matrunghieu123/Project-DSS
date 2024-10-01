import React, { useEffect, useRef } from 'react';
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

const MemberList = ({ privateChats, setTab, tab, userData, setAvatarColors }) => {
    const avatarColors = useRef({});

    useEffect(() => {
        const newAvatarColors = { ...avatarColors.current };
        let hasChanged = false;

        privateChats.forEach((_, name) => {
            if (!newAvatarColors[name]) {
                newAvatarColors[name] = getRandomColor();
                hasChanged = true;
            }
        });

        if (hasChanged) {
            avatarColors.current = newAvatarColors;
            setAvatarColors(newAvatarColors); // Cập nhật state màu avatar trong ChatRoom
        }
    }, [privateChats, setAvatarColors]);

    const getAvatar = (name) => {
        // Lấy URL từ database hoặc API
        return null; // Trả về null để sử dụng avatar mặc định của Ant Design
    };

    const getLastMessageTime = (name) => {
        const chat = privateChats.get(name);
        if (chat && chat.length > 0) {
            const lastMessage = chat[chat.length - 1];
            const time = lastMessage.time; // Sử dụng thuộc tính time

            // Sử dụng hàm formatDate để định dạng thời gian
            return formatDate(time);
        }
        return "Không có tin nhắn"; // Trả về thông báo nếu không có tin nhắn
    };

    const getInitials = (name) => {
        const nameParts = name.split(' ');
        const initials = nameParts.map(part => part[0]).join('');
        return initials.toUpperCase();
    };

    const getRandomColor = () => {
        const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#ff4d4f', '#52c41a', '#1890ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div className="member-list">
            <List
                dataSource={[...privateChats.keys()]}
                renderItem={(name) => (
                    <List.Item
                        onClick={() => setTab(name, avatarColors.current[name])}
                        className={`member ${tab === name ? "active" : ""}`}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar style={{ backgroundColor: avatarColors.current[name] }} src={getAvatar(name)}>
                                    {getAvatar(name) ? null : getInitials(name)}
                                </Avatar>
                            }
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