import React, { useEffect } from 'react';
import './MessageList.css'

const MessageList = ({ chats, tab, userData, endOfMessagesRef }) => {

    // Cuộn tới cuối danh sách tin nhắn khi có tin nhắn mới
    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chats]); // Cuộn mỗi khi danh sách chats thay đổi

    return (
        <ul className="chat-messages">
            {chats && chats.map((chat, index) => (
                <li
                    className={`message ${chat.senderName === userData.username ? "self" : ""}`}
                    key={index}
                >
                    {chat.senderName !== userData.username && (
                        <div className="message-avatar" style={{ backgroundColor: 'black', color: 'white' }}>
                            {chat.senderName[0]} {/* Hiển thị chữ cái đầu trong tên */}
                        </div>
                    )}
                    <div className="message-data">
                        {chat.senderName !== userData.username && (
                            <span className="message-sender">{chat.senderName}</span>
                        )}
                        <span className="message-content">{chat.message}</span>
                        <span className="message-time">{chat.time}</span> {/* Thời gian nhắn tin cuối cùng */}
                    </div>
                    {chat.senderName === userData.username && (
                        <div className="avatar self" style={{ backgroundColor: 'black', color: 'white' }}>
                            {chat.senderName[0]} {/* Hiển thị chữ cái đầu trong tên */}
                        </div>
                    )}
                </li>
            ))}
            <div ref={endOfMessagesRef} /> {/* Phần tử để cuộn tới cuối */}
        </ul>
    );
};

export default MessageList;
