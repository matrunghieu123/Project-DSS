import React, { useLayoutEffect } from 'react';
import './MessageList.css';
import ImageMessage from './imghanlde/ImageMessage';
import FileMessage from './filehandle/FileMessage';

const MessageList = ({ chats, userData, endOfMessagesRef, tab }) => {
    useLayoutEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chats, endOfMessagesRef, tab]);

    const renderFileContent = (fileUrl, fileType) => {
        if (fileType && fileType.startsWith('image/')) {
            return <ImageMessage src={fileUrl} alt="Sent image" />;
        } else if (fileUrl) {
            return <FileMessage fileUrl={fileUrl} fileType={fileType} />;
        }
        return null;
    };

    return (
        <ul className="chat-messages">
            {chats && chats
                // Điều kiện lọc tin nhắn cho private chat
                .filter(chat => {
                    if (tab === 'private') {
                        // Hiển thị tin nhắn trong private chat nếu người dùng hiện tại là người gửi hoặc người nhận
                        return (chat.senderName === userData.username || chat.receiverName === userData.username);
                    }
                    // Hiển thị tất cả tin nhắn cho public chat
                    return true;
                })
                .map((chat, index) => {
                    const previousChat = chats[index - 1];
                    const isSameSender = previousChat && previousChat.senderName === chat.senderName;

                    return (
                        <li
                            className={`message ${chat.senderName === userData.username ? "self" : ""}`}
                            key={index}
                            title={chat.time ? `Gửi lúc: ${chat.time}` : ''}
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
                            <div className="message-content-wrapper">
                                <div className="message-content-inner">
                                    <div className="message-sender-time-wrapper">
                                        <span className="message-sender-time">
                                            {chat.senderName}, {chat.time ? chat.time : 'Không rõ thời gian'}
                                        </span>
                                    </div>
                                    <div className="message-data">
                                        <span className="message-content">{chat.message}</span>
                                        {chat.fileUrl && renderFileContent(chat.fileUrl, chat.fileType)}
                                        <span className="message-time-hover">{chat.time}</span> {/* Thêm dòng này */}
                                    </div>
                                </div>
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
            <div ref={endOfMessagesRef} />
        </ul>
    );
};

export default React.memo(MessageList);
