import React, { useEffect } from 'react';
import './MessageList.css'

const MessageList = ({ chats, tab, userData, endOfMessagesRef }) => {

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chats]);

    return (
        <ul className="chat-messages">
            {chats && chats.map((chat, index) => (
                <li
                    className={`message ${chat.senderName === userData.username ? "self" : ""}`}
                    key={index}
                >
                    {chat.senderName !== userData.username && (
                        <img
                            className="message-avatar"
                            src={chat.avatar || 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-2-1.jpg'} // Đặt avatar, nếu không có thì dùng ảnh mặc định
                            alt="avatar"
                            style={{ backgroundColor: 'black', color: 'white' }}
                        />
                    )}
                    <div className="message-data">
                        {chat.senderName !== userData.username && (
                            <span className="message-sender">{chat.senderName}</span>
                        )}
                        <span className="message-content">{chat.message}</span>
                        <span className="message-time">{chat.time}</span> {/* Thời gian nhắn tin cuối cùng */}
                    </div>
                    {chat.senderName === userData.username && (
                        <img
                            className="avatar self"
                            src={chat.avatar || 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-2-1.jpg'} // Avatar của người dùng
                            alt="avatar"
                            style={{ backgroundColor: 'black', color: 'white' }}
                        />
                    )}
                </li>
            ))}
            <div ref={endOfMessagesRef} /> {/* Phần tử để cuộn tới cuối */}
        </ul>
    );
};

export default MessageList;
