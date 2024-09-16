import React, { useLayoutEffect } from 'react';
import './MessageList.css';
import ImageMessage from './imghanlde/ImageMessage';

const MessageList = ({ chats, userData, endOfMessagesRef }) => {

    useLayoutEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chats, endOfMessagesRef]);

    const renderFileContent = (file) => {
        if (file && file.type && file.type.startsWith('image/')) {
            return <ImageMessage src={file.data} alt="Sent image" />;
        } else if (file) {
            return <a href={file.data} download={file.name}>{file.name}</a>;
        }
        return null;
    };

    return (
        <ul className="chat-messages">
            {chats && chats.map((chat, index) => {
                const previousChat = chats[index - 1];
                const isSameSender = previousChat && previousChat.senderName === chat.senderName;

                return (
                    <li
                        className={`message ${chat.senderName === userData.username ? "self" : ""}`}
                        key={index}
                    >
                        {!isSameSender && chat.senderName !== userData.username && (
                            <img
                                className="message-avatar"
                                src={chat.avatar || 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-2-1.jpg'}
                                alt="avatar"
                                style={{ backgroundColor: 'black', color: 'white' }}
                            />
                        )}
                        {isSameSender && chat.senderName !== userData.username && (
                            <div className="message-avatar-placeholder"></div>
                        )}
                        <div className="message-data">
                            <span className="message-content">{chat.message}</span>
                            {chat.file && renderFileContent(chat.file)}
                            <span className="message-time">{chat.time}</span>
                        </div>
                        {!isSameSender && chat.senderName === userData.username && (
                            <img
                                className="avatar self"
                                src={chat.avatar || 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-2-1.jpg'}
                                alt="avatar"
                                style={{ backgroundColor: 'black', color: 'white' }}
                            />
                        )}
                        {isSameSender && chat.senderName === userData.username && (
                            <div className="avatar-placeholder self"></div>
                        )}
                    </li>
                );
            })}
            <div ref={endOfMessagesRef} /> {/* Phần tử để cuộn tới cuối */}
        </ul>
    );
};

export default MessageList;
